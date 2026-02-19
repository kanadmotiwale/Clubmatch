import { api } from "./api.js";

const grid = document.getElementById("clubs-grid");
const searchInput = document.getElementById("hero-search");
const searchBtn = document.getElementById("hero-search-btn");
const filterBtns = document.querySelectorAll(".filter-btn");
const adminBtn = document.getElementById("admin-btn");
const clubsSection = document.getElementById("clubs-section");

const ADMIN_PASSWORD = "clubmatch2025";
let isAdmin = false;
let allClubs = [];
let activeCategory = "";

const categoryIcons = {
    Academic: "📚",
    Cultural: "🌍",
    Sports: "⚽",
    Professional: "💼",
    Arts: "🎨",
    Service: "🤝",
};

const categoryColors = {
    Academic: { bg: "#eff6ff", color: "#1d4ed8" },
    Cultural: { bg: "#fdf4ff", color: "#7e22ce" },
    Sports: { bg: "#f0fdf4", color: "#15803d" },
    Professional: { bg: "#fff7ed", color: "#c2410c" },
    Arts: { bg: "#fef9c3", color: "#a16207" },
    Service: { bg: "#f0fdfa", color: "#0f766e" },
};

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
        const url = category ? `/clubs?category=${encodeURIComponent(category)}` : "/clubs";
        allClubs = await api.get(url);
        const filtered = allClubs.filter((c) => {
            const q = search.toLowerCase();
            return (
                c.name.toLowerCase().includes(q) ||
                c.category.toLowerCase().includes(q) ||
                c.description.toLowerCase().includes(q)
            );
        });
        renderClubs(filtered.slice(0, 12));
    } catch (err) {
        grid.innerHTML = `<p class="error">Failed to load clubs.</p>`;
    }
}

function renderClubs(clubs) {
    if (clubs.length === 0) {
        grid.innerHTML = `<p class="empty">No clubs found. Try a different search term.</p>`;
        return;
    }
    grid.innerHTML = clubs
        .map((c) => {
            const icon = categoryIcons[c.category] || "🏛";
            const colors = categoryColors[c.category] || { bg: "#f3f4f6", color: "#374151" };
            return `
      <div class="club-card" data-id="${c._id}" style="cursor:pointer;">
        <div class="club-card-icon" style="background:${colors.bg}; color:${colors.color};">
          ${icon}
        </div>
        <div class="club-card-body">
          <span class="badge" style="background:${colors.bg}; color:${colors.color};">${c.category}</span>
          <h3>${c.name}</h3>
          <p>${c.description}</p>
          <div class="club-card-footer">
            <span class="hours">⏱ ${c.weeklyTimeCommitment} hrs/week</span>
            <span class="click-hint">View details →</span>
          </div>
        </div>
      </div>
    `;
        })
        .join("");

    grid.querySelectorAll(".club-card").forEach((card) => {
        card.addEventListener("click", () => {
            const club = allClubs.find((c) => c._id === card.dataset.id);
            if (club) showDetail(club);
        });
    });
}

function showDetail(club) {
    const icon = categoryIcons[club.category] || "🏛";
    const overlay = document.createElement("div");
    overlay.className = "detail-overlay";
    overlay.innerHTML = `
    <div class="detail-box">
      <button class="detail-close" id="detail-close">✕</button>
      <div class="detail-meta">
        <span class="badge">${icon} ${club.category}</span>
        <span class="hours">⏱ ${club.weeklyTimeCommitment} hrs/week</span>
      </div>
      <h2>${club.name}</h2>
      <p>${club.description}</p>
      <p style="color:#6b7280; font-size:0.875rem; margin-top:0.5rem;">
        To join this club, head over to the 
        <a href="/clubs.html" style="color:#f97316; font-weight:600;">Clubs page</a> 
        and click on the club to register.
      </p>
    </div>
  `;
    document.body.appendChild(overlay);
    overlay.querySelector("#detail-close").addEventListener("click", () => overlay.remove());
    overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });
}

function triggerSearch() {
    loadClubs(activeCategory, searchInput.value);
    if (searchInput.value || activeCategory) {
        clubsSection.scrollIntoView({ behavior: "smooth" });
    }
}

filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeCategory = btn.dataset.category;
        loadClubs(activeCategory, searchInput.value);
        clubsSection.scrollIntoView({ behavior: "smooth" });
    });
});

searchBtn.addEventListener("click", triggerSearch);
searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") triggerSearch();
});

loadClubs();