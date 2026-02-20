import { api } from "./api.js";

const list = document.getElementById("members-list");
const searchInput = document.getElementById("search-members");
const adminBtn = document.getElementById("admin-btn");
const createProfileBtn = document.getElementById("create-profile-btn");
const profileFormContainer = document.getElementById("profile-form-container");
const profileForm = document.getElementById("profile-form");
const profileFormTitle = document.getElementById("profile-form-title");
const cancelProfileBtn = document.getElementById("cancel-profile-btn");
const detailOverlay = document.getElementById("member-detail-overlay");
const detailContent = document.getElementById("member-detail-content");
const detailClose = document.getElementById("member-detail-close");
const tabBtns = document.querySelectorAll(".tab-btn");

const ADMIN_PASSWORD = "clubmatch2025";
let isAdmin = false;
let allMembers = [];
let activeTab = "all";

adminBtn.addEventListener("click", () => {
    if (isAdmin) {
        isAdmin = false;
        adminBtn.classList.remove("active");
        adminBtn.textContent = "Admin";
        renderMembers(getFilteredMembers());
    } else {
        const pwd = prompt("Enter admin password:");
        if (pwd === ADMIN_PASSWORD) {
            isAdmin = true;
            adminBtn.classList.add("active");
            adminBtn.textContent = "Admin ✓";
            renderMembers(getFilteredMembers());
        } else if (pwd !== null) {
            alert("Incorrect password.");
        }
    }
});

tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        tabBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeTab = btn.dataset.tab;
        renderMembers(getFilteredMembers());
    });
});

function getFilteredMembers() {
    const search = searchInput.value.trim().toLowerCase();
    let filtered = allMembers;

    if (activeTab === "members") {
        filtered = allMembers.filter(
            (m) => m.joinedClubs && m.joinedClubs.length > 0
        );
    } else if (activeTab === "students") {
        filtered = allMembers.filter(
            (m) => !m.joinedClubs || m.joinedClubs.length === 0
        );
    }

    if (search) {
        filtered = filtered.filter(
            (m) =>
                m.name.toLowerCase().includes(search) ||
                (m.interests && m.interests.some((i) => i.toLowerCase().includes(search)))
        );
    }

    return filtered;
}

createProfileBtn.addEventListener("click", () => {
    profileFormTitle.textContent = "Create My Profile";
    profileForm.reset();
    document.getElementById("profile-id").value = "";
    profileFormContainer.classList.remove("hidden");
    profileFormContainer.scrollIntoView({ behavior: "smooth" });
});

cancelProfileBtn.addEventListener("click", () => {
    profileFormContainer.classList.add("hidden");
    profileForm.reset();
});

profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("profile-id").value;
    const interestsRaw = document.getElementById("profile-interests").value;
    const clubsRaw = document.getElementById("profile-clubs").value;
    const data = {
        name: document.getElementById("profile-name").value,
        email: document.getElementById("profile-email").value,
        major: document.getElementById("profile-major").value,
        year: document.getElementById("profile-year").value,
        bio: document.getElementById("profile-bio").value,
        interests: interestsRaw
            ? interestsRaw.split(",").map((s) => s.trim()).filter(Boolean)
            : [],
        joinedClubs: clubsRaw
            ? clubsRaw.split(",").map((s) => s.trim()).filter(Boolean)
            : [],
    };
    try {
        if (id) {
            await api.put(`/users/${id}`, data);
        } else {
            await api.post("/users", data);
        }
        profileFormContainer.classList.add("hidden");
        profileForm.reset();
        await loadMembers();
    } catch (err) {
        alert(err.message);
    }
});

async function loadMembers() {
    try {
        allMembers = await api.get("/users");
        renderMembers(getFilteredMembers());
    } catch (err) {
        list.innerHTML = `<p class="error">Failed to load members.</p>`;
    }
}

function renderMembers(members) {
    if (members.length === 0) {
        list.innerHTML = `<p class="empty">No ${activeTab === "members" ? "club members" : activeTab === "students" ? "students without clubs" : "members"} found.</p>`;
        return;
    }
    list.innerHTML = members
        .map(
            (m) => `
    <div class="member-card" data-id="${m._id}" style="cursor:pointer;">
      <div class="member-card-header">
        <div class="avatar">${m.name.charAt(0).toUpperCase()}</div>
        <div class="member-info">
          <h3>${m.name}</h3>
          <span>${m.major} · ${m.year}</span>
        </div>
        <div style="display:flex; flex-direction:column; align-items:flex-end; gap:0.35rem;">
          <span class="member-role-badge ${m.joinedClubs && m.joinedClubs.length > 0 ? "badge-member" : "badge-student"}">
            ${m.joinedClubs && m.joinedClubs.length > 0 ? "Member" : "Student"}
          </span>
          ${isAdmin ? `
          <div class="card-actions">
            <button class="btn-edit" data-id="${m._id}">Edit</button>
            <button class="btn-delete" data-id="${m._id}">Delete</button>
          </div>` : ""}
        </div>
      </div>
      ${m.bio ? `<p class="member-bio">${m.bio}</p>` : ""}
      ${m.interests && m.interests.length > 0 ? `
        <div class="tags">
          ${m.interests.map((i) => `<span class="tag">${i}</span>`).join("")}
        </div>` : ""}
      ${m.joinedClubs && m.joinedClubs.length > 0 ? `
        <p class="joined-clubs">🏛 ${m.joinedClubs.join(", ")}</p>` : ""}
      <span class="click-hint" style="font-size:0.78rem; color:#f97316; font-weight:500; margin-top:0.25rem;">Click to view full profile →</span>
    </div>
  `
        )
        .join("");

    list.querySelectorAll(".member-card").forEach((card) => {
        card.addEventListener("click", (e) => {
            if (
                e.target.classList.contains("btn-edit") ||
                e.target.classList.contains("btn-delete")
            )
                return;
            const member = allMembers.find((m) => m._id === card.dataset.id);
            if (member) showProfile(member);
        });
    });

    if (isAdmin) {
        list.querySelectorAll(".btn-edit").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                openEdit(btn.dataset.id);
            });
        });
        list.querySelectorAll(".btn-delete").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                deleteMember(btn.dataset.id);
            });
        });
    }
}

function showProfile(member) {
    detailContent.innerHTML = `
    <div style="display:flex; align-items:center; gap:1rem; margin-bottom:1.25rem;">
      <div class="avatar" style="width:56px; height:56px; font-size:1.4rem;">${member.name.charAt(0).toUpperCase()}</div>
      <div>
        <h2 style="margin-bottom:0.1rem;">${member.name}</h2>
        <span style="color:#6b7280; font-size:0.9rem;">${member.major} · ${member.year}</span>
      </div>
      <span class="member-role-badge ${member.joinedClubs && member.joinedClubs.length > 0 ? "badge-member" : "badge-student"}" style="margin-left:auto;">
        ${member.joinedClubs && member.joinedClubs.length > 0 ? "Member" : "Student"}
      </span>
    </div>
    ${member.bio ? `<p style="margin-bottom:1rem;">${member.bio}</p>` : ""}
    ${member.interests && member.interests.length > 0 ? `
      <div style="margin-bottom:1rem;">
        <p style="font-weight:700; font-size:0.875rem; color:#374151; margin-bottom:0.5rem;">Interests</p>
        <div class="tags">${member.interests.map((i) => `<span class="tag">${i}</span>`).join("")}</div>
      </div>` : ""}
    ${member.joinedClubs && member.joinedClubs.length > 0 ? `
      <div>
        <p style="font-weight:700; font-size:0.875rem; color:#374151; margin-bottom:0.5rem;">Clubs</p>
        <div class="tags">${member.joinedClubs.map((c) => `<span class="tag" style="background:#f0fdf4; color:#16a34a;">${c}</span>`).join("")}</div>
      </div>` : ""}
  `;
    detailOverlay.classList.remove("hidden");
}

detailClose.addEventListener("click", () => detailOverlay.classList.add("hidden"));
detailOverlay.addEventListener("click", (e) => {
    if (e.target === detailOverlay) detailOverlay.classList.add("hidden");
});

async function openEdit(id) {
    try {
        const member = await api.get(`/users/${id}`);
        profileFormTitle.textContent = "Edit Profile";
        document.getElementById("profile-id").value = member._id;
        document.getElementById("profile-name").value = member.name;
        document.getElementById("profile-email").value = member.email;
        document.getElementById("profile-major").value = member.major;
        document.getElementById("profile-year").value = member.year;
        document.getElementById("profile-bio").value = member.bio || "";
        document.getElementById("profile-interests").value = (member.interests || []).join(", ");
        document.getElementById("profile-clubs").value = (member.joinedClubs || []).join(", ");
        profileFormContainer.classList.remove("hidden");
        profileFormContainer.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
        alert("Failed to load member details.");
    }
}

async function deleteMember(id) {
    if (!confirm("Are you sure you want to delete this profile?")) return;
    try {
        await api.delete(`/users/${id}`);
        await loadMembers();
    } catch (err) {
        alert("Failed to delete profile.");
    }
}

let debounceTimer;
searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => renderMembers(getFilteredMembers()), 400);
});

loadMembers();