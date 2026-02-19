import { api } from "./api.js";

const list = document.getElementById("members-list");
const searchInput = document.getElementById("search-members");
const adminBtn = document.getElementById("admin-btn");

const ADMIN_PASSWORD = "clubmatch2025";
let isAdmin = false;

adminBtn.addEventListener("click", () => {
  if (isAdmin) {
    isAdmin = false;
    adminBtn.classList.remove("active");
    adminBtn.textContent = "Admin";
    loadMembers();
  } else {
    const pwd = prompt("Enter admin password:");
    if (pwd === ADMIN_PASSWORD) {
      isAdmin = true;
      adminBtn.classList.add("active");
      adminBtn.textContent = "Admin ✓";
      loadMembers();
    } else if (pwd !== null) {
      alert("Incorrect password.");
    }
  }
});

async function loadMembers() {
  try {
    const search = searchInput.value.trim();
    const url = search ? `/users?name=${encodeURIComponent(search)}` : "/users";
    const members = await api.get(url);
    renderMembers(members);
  } catch (err) {
    list.innerHTML = `<p class="error">Failed to load members.</p>`;
  }
}

function renderMembers(members) {
  if (members.length === 0) {
    list.innerHTML = `<p class="empty">No members found.</p>`;
    return;
  }
  list.innerHTML = members
    .map(
      (m) => `
    <div class="member-card">
      <div class="member-card-header">
        <div class="avatar">${m.name.charAt(0).toUpperCase()}</div>
        <div class="member-info">
          <h3>${m.name}</h3>
          <span>${m.major} · ${m.year}</span>
        </div>
        ${isAdmin ? `
        <div class="card-actions">
          <button class="btn-edit" data-id="${m._id}">Edit</button>
          <button class="btn-delete" data-id="${m._id}">Delete</button>
        </div>` : ""}
      </div>
      ${m.bio ? `<p class="member-bio">${m.bio}</p>` : ""}
      ${m.interests && m.interests.length > 0 ? `
        <div class="tags">
          ${m.interests.map((i) => `<span class="tag">${i}</span>`).join("")}
        </div>` : ""}
      ${m.joinedClubs && m.joinedClubs.length > 0 ? `
        <p class="joined-clubs">🏛 ${m.joinedClubs.join(", ")}</p>` : ""}
    </div>
  `
    )
    .join("");

  if (isAdmin) {
    list.querySelectorAll(".btn-edit").forEach((btn) => {
      btn.addEventListener("click", () => openEdit(btn.dataset.id));
    });
    list.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", () => deleteMember(btn.dataset.id));
    });
  }
}

async function openEdit(id) {
  try {
    const member = await api.get(`/users/${id}`);
    const name = prompt("Full Name:", member.name);
    if (name === null) return;
    const email = prompt("Email:", member.email);
    if (email === null) return;
    const major = prompt("Major:", member.major);
    if (major === null) return;
    const year = prompt("Year (Freshman/Sophomore/Junior/Senior/Graduate):", member.year);
    if (year === null) return;
    const bio = prompt("Bio:", member.bio || "");
    if (bio === null) return;
    const interests = prompt("Interests (comma separated):", (member.interests || []).join(", "));
    if (interests === null) return;
    const joinedClubs = prompt("Joined Clubs (comma separated):", (member.joinedClubs || []).join(", "));
    if (joinedClubs === null) return;

    const data = {
      name,
      email,
      major,
      year,
      bio,
      interests: interests ? interests.split(",").map((s) => s.trim()).filter(Boolean) : [],
      joinedClubs: joinedClubs ? joinedClubs.split(",").map((s) => s.trim()).filter(Boolean) : [],
    };
    await api.put(`/users/${id}`, data);
    loadMembers();
  } catch (err) {
    alert("Failed to update member.");
  }
}

async function deleteMember(id) {
  if (!confirm("Are you sure you want to delete this profile?")) return;
  try {
    await api.delete(`/users/${id}`);
    loadMembers();
  } catch (err) {
    alert("Failed to delete profile.");
  }
}

let debounceTimer;
searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(loadMembers, 400);
});

loadMembers();
