import { api } from "./api.js";

const list = document.getElementById("clubs-list");
const formContainer = document.getElementById("club-form-container");
const form = document.getElementById("club-form");
const formTitle = document.getElementById("form-title");
const addBtn = document.getElementById("add-club-btn");
const cancelBtn = document.getElementById("cancel-club-btn");
const filterCategory = document.getElementById("filter-category");
const filterTime = document.getElementById("filter-time");

async function loadClubs() {
    try {
        let url = "/clubs?";
        if (filterCategory.value) url += `category=${encodeURIComponent(filterCategory.value)}&`;
        if (filterTime.value) url += `maxTime=${filterTime.value}`;
        const clubs = await api.get(url);
        renderClubs(clubs);
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
        <div class="card-actions">
          <button class="btn-edit" data-id="${c._id}">Edit</button>
          <button class="btn-delete" data-id="${c._id}">Delete</button>
        </div>
      </div>
      <h3>${c.name}</h3>
      <p>${c.description}</p>
      <span class="hours">⏱ ${c.weeklyTimeCommitment} hrs/week</span>
      <div class="club-card-expanded hidden">
        <p><span>Category:</span> ${c.category}</p>
        <p><span>Weekly Commitment:</span> ${c.weeklyTimeCommitment} hrs/week</p>
        <p><span>Description:</span> ${c.description}</p>
      </div>
    </div>
  `
        )
        .join("");

    list.querySelectorAll(".club-card").forEach((card) => {
        card.addEventListener("click", (e) => {
            if (e.target.classList.contains("btn-edit") || e.target.classList.contains("btn-delete")) return;
            const expanded = card.querySelector(".club-card-expanded");
            expanded.classList.toggle("hidden");
        });
    });

    list.querySelectorAll(".btn-edit").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            openEdit(btn.dataset.id);
        });
    });

    list.querySelectorAll(".btn-delete").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            deleteClub(btn.dataset.id);
        });
    });
}

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