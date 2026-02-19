import { api } from "./api.js";

const grid = document.getElementById("clubs-grid");
const searchInput = document.getElementById("hero-search");
const searchBtn = document.getElementById("hero-search-btn");
const filterBtns = document.querySelectorAll(".filter-btn");

let allClubs = [];
let activeCategory = "";

async function loadClubs(category = "", search = "") {
    try {
        const url = category ? `/clubs?category=${encodeURIComponent(category)}` : "/clubs";
        allClubs = await api.get(url);
        const filtered = allClubs.filter((c) =>
            c.name.toLowerCase().includes(search.toLowerCase())
        );
        renderClubs(filtered);
    } catch (err) {
        grid.innerHTML = `<p class="error">Failed to load clubs.</p>`;
    }
}

function renderClubs(clubs) {
    if (clubs.length === 0) {
        grid.innerHTML = `<p class="empty">No clubs found.</p>`;
        return;
    }
    grid.innerHTML = clubs
        .map(
            (c) => `
    <div class="club-card">
      <span class="badge">${c.category}</span>
      <h3>${c.name}</h3>
      <p>${c.description}</p>
      <span class="hours">⏱ ${c.weeklyTimeCommitment} hrs/week</span>
    </div>
  `
        )
        .join("");
}

function triggerSearch() {
    loadClubs(activeCategory, searchInput.value);
}

filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeCategory = btn.dataset.category;
        loadClubs(activeCategory, searchInput.value);
    });
});

searchBtn.addEventListener("click", triggerSearch);

searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") triggerSearch();
});

loadClubs();