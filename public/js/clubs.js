import { api } from "./api.js";

const list = document.getElementById("clubs-list");
const formContainer = document.getElementById("club-form-container");
const form = document.getElementById("club-form");
const formTitle = document.getElementById("form-title");
const addBtn = document.getElementById("add-club-btn");
const cancelBtn = document.getElementById("cancel-club-btn");
const filterCategory = document.getElementById("filter-category");
const filterTime = document.getElementById("filter-time");
const adminBtn = document.getElementById("admin-btn");
const detailOverlay = document.getElementById("club-detail-overlay");
const detailContent = document.getElementById("detail-content");
const detailClose = document.getElementById("detail-close");
const joinOverlay = document.getElementById("join-form-overlay");
const joinForm = document.getElementById("join-form");
const joinClose = document.getElementById("join-close");
const joinCancelBtn = document.getElementById("join-cancel-btn");

const ADMIN_PASSWORD = "clubmatch2025";
let isAdmin = false;
let allClubs = [];

adminBtn.addEventListener("click", () => {
    if (isAdmin) {
        isAdmin = false;
        adminBtn.classList.remove("active");
        adminBtn.textContent = "Admin";
        addBtn.classList.add("hidden");
        loadClubs();
    } else {
        const pwd = prompt("Enter admin password:");
        if (pwd === ADMIN_PASSWORD) {
            isAdmin = true;
            adminBtn.classList.add("active");
            adminBtn.textContent = "Admin ✓";
            addBtn.classList.remove("hidden");
            loadClubs();
        } else if (pwd !== null) {
            alert("Incorrect password.");
        }
    }
});

async function loadClubs() {
    try {
        let url = "/clubs?";
        if (filterCategory.value) url += `category=${encodeURIComponent(filterCategory.value)}&`;
        if (filterTime.value) url += `maxTime=${filterTime.value}`;
        allClubs = await api.get(url);
        renderClubs(allClubs);
    } catch (err) {
        list.innerHTML = `<p class="error">Failed to load clubs.</p>`;
    }
}

function renderClubs(clubs) {
    if (clubs.length === 0) {
        list.innerHTML = `<p class="empty">No clubs found. Try adjusting your filters.</p>`;
        return;
    }
    list.innerHTML = clubs
        .map(
            (c) => `
    <div class="club-card" data-id="${c._id}">
      <div class="club-card-header">
        <span class="badge">${c.category}</span>
        ${isAdmin ? `
        <div class="card-actions">
          <button class="btn-edit" data-id="${c._id}">Edit</button>
          <button class="btn-delete" data-id="${c._id}">Delete</button>
        </div>` : ""}
      </div>
      <h3>${c.name}</h3>
      <p>${c.description}</p>
      <div class="club-card-footer">
        <span class="hours">⏱ ${c.weeklyTimeCommitment} hrs/week</span>
        <span class="click-hint">Click for details & join →</span>
      </div>
    </div>
  `
        )
        .join("");

    list.querySelectorAll(".club-card").forEach((card) => {
        card.addEventListener("click", (e) => {
            if (e.target.classList.contains("btn-edit") || e.target.classList.contains("btn-delete")) return;
            const club = allClubs.find((c) => c._id === card.dataset.id);
            if (club) showDetail(club);
        });
    });

    if (isAdmin) {
        list.querySelectorAll(".btn-edit").forEach((btn) => {
            btn.addEventListener("click", (e) => { e.stopPropagation(); openEdit(btn.dataset.id); });
        });
        list.querySelectorAll(".btn-delete").forEach((btn) => {
            btn.addEventListener("click", (e) => { e.stopPropagation(); deleteClub(btn.dataset.id); });
        });
    }
}

function showDetail(club) {
    detailContent.innerHTML = `
    <div class="detail-meta">
      <span class="badge">${club.category}</span>
      <span class="hours">⏱ ${club.weeklyTimeCommitment} hrs/week</span>
    </div>
    <h2>${club.name}</h2>
    <p>${club.description}</p>
    <p style="color:#6b7280; font-size:0.875rem;">Interested in joining? Click the button below to register your details.</p>
    <button class="btn-join" id="open-join-btn" data-name="${club.name}">Join This Club</button>
  `;
    detailOverlay.classList.remove("hidden");
    document.getElementById("open-join-btn").addEventListener("click", () => {
        document.getElementById("join-club-name").value = club.name;
        detailOverlay.classList.add("hidden");
        joinOverlay.classList.remove("hidden");
    });
}

detailClose.addEventListener("click", () => detailOverlay.classList.add("hidden"));
detailOverlay.addEventListener("click", (e) => { if (e.target === detailOverlay) detailOverlay.classList.add("hidden"); });

joinClose.addEventListener("click", () => joinOverlay.classList.add("hidden"));
joinCancelBtn.addEventListener("click", () => joinOverlay.classList.add("hidden"));
joinOverlay.addEventListener("click", (e) => { if (e.target === joinOverlay) joinOverlay.classList.add("hidden"); });

joinForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
        name: document.getElementById("join-name").value,
        email: document.getElementById("join-email").value,
        major: document.getElementById("join-major").value,
        year: document.getElementById("join-year").value,
        bio: "",
        interests: [],
        joinedClubs: [document.getElementById("join-club-name").value],
    };
    try {
        await api.post("/users", data);
        joinOverlay.classList.add("hidden");
        joinForm.reset();
        alert(`You have successfully registered for ${data.joinedClubs[0]}!`);
    } catch (err) {
        alert(err.message);
    }
});

function openAdd() {
    formTitle.textContent = "Add Club";
    form.reset();
    document.getElementById("club-id").value = "";
    formContainer.classList.remove("hidden");
    formContainer.scrollIntoView({ behavior: "smooth" });
}

async function openEdit(id) {
    try {
        const club = await api.get(`/clubs/${id}`);
        formTitle.textContent = "Edit Club";
        document.getElementById("club-id").value = club._id;
        document.getElementById("club-name").value = club.name;
        document.getElementById("club-category").value = club.category;
        document.getElementById("club-description").value = club.description;
        document.getElementById("club-hours").value = club.weeklyTimeCommitment;
        formContainer.classList.remove("hidden");
        formContainer.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
        alert("Failed to load club details.");
    }
}

async function deleteClub(id) {
    if (!confirm("Are you sure you want to delete this club?")) return;
    try {
        await api.delete(`/clubs/${id}`);
        loadClubs();
    } catch (err) {
        alert("Failed to delete club.");
    }
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("club-id").value;
    const data = {
        name: document.getElementById("club-name").value,
        category: document.getElementById("club-category").value,
        description: document.getElementById("club-description").value,
        weeklyTimeCommitment: document.getElementById("club-hours").value,
    };
    try {
        if (id) {
            await api.put(`/clubs/${id}`, data);
        } else {
            await api.post("/clubs", data);
        }
        formContainer.classList.add("hidden");
        form.reset();
        loadClubs();
    } catch (err) {
        alert(err.message);
    }
});

addBtn.addEventListener("click", openAdd);
cancelBtn.addEventListener("click", () => {
    formContainer.classList.add("hidden");
    form.reset();
});
filterCategory.addEventListener("change", loadClubs);
filterTime.addEventListener("change", loadClubs);

loadClubs();