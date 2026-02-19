import { api } from "./api.js";

const grid = document.getElementById("clubs-grid");
const searchInput = document.getElementById("hero-search");
const searchBtn = document.getElementById("hero-search-btn");
const filterBtns = document.querySelectorAll(".filter-btn");
const adminBtn = document.getElementById("admin-btn");

const ADMIN_PASSWORD = "clubmatch2025";
let isAdmin = false;

let allClubs = [];
let activeCategory = "";

adminBtn.addEventListener("click", () => {
  if (isAdmin) {
    isAdmin = false;
    adminBtn.classList.remove("active");
    adminBtn.textContent = "Admin";
  } else {
    const pwd = prompt("Enter admin password:");
    if (pwd === ADMIN_PASSWORD) {
      isAdmin = true;
      adminBtn.classList.add("active");
      adminBtn.textContent = "Admin ✓";
    } else if (pwd !== null) {
      alert("Incorrect password.");
    }
  }
});

async function loadClubs(category = "", search = "") {
  try {
    const url = category
      ? `/clubs?category=${encodeURIComponent(category)}`
      : "/clubs";
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
    <div class="club-card" data-id="${c._id}" style="cursor:pointer;">
      <span class="badge">${c.category}</span>
      <h3>${c.name}</h3>
      <p>${c.description}</p>
      <span class="hours">⏱ ${c.weeklyTimeCommitment} hrs/week</span>
      <span class="click-hint">Click to view details & join →</span>
    </div>
  `
    )
    .join("");

  grid.querySelectorAll(".club-card").forEach((card) => {
    card.addEventListener("click", () => {
      const club = allClubs.find((c) => c._id === card.dataset.id);
      if (club) showDetail(club);
    });
  });
}

function showDetail(club) {
  const overlay = document.createElement("div");
  overlay.className = "detail-overlay";
  overlay.innerHTML = `
    <div class="detail-box">
      <button class="detail-close" id="detail-close">✕</button>
      <div class="detail-meta">
        <span class="badge">${club.category}</span>
        <span class="hours">⏱ ${club.weeklyTimeCommitment} hrs/week</span>
      </div>
      <h2>${club.name}</h2>
      <p>${club.description}</p>
      <p>To join this club, head over to the <a href="/clubs.html" style="color:#f97316;font-weight:600;">Clubs page</a> and click on the club to register.</p>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay
    .querySelector("#detail-close")
    .addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });
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
