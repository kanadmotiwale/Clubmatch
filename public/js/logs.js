import { api } from "./api.js";

const list = document.getElementById("logs-list");
const formContainer = document.getElementById("log-form-container");
const form = document.getElementById("log-form");
const formTitle = document.getElementById("form-title");
const addBtn = document.getElementById("add-log-btn");
const cancelBtn = document.getElementById("cancel-log-btn");
const filterClub = document.getElementById("filter-club");
const statsBanner = document.getElementById("stats-banner");
const statsClubName = document.getElementById("stats-club-name");
const statsAvg = document.getElementById("stats-avg");
const adminBtn = document.getElementById("admin-btn");
const tabBtns = document.querySelectorAll(".tab-btn");

const ADMIN_PASSWORD = "clubmatch2025";
let isAdmin = false;
let activeTab = "club";
let allLogs = [];

adminBtn.addEventListener("click", () => {
  if (isAdmin) {
    isAdmin = false;
    adminBtn.classList.remove("active");
    adminBtn.textContent = "Admin";
    renderLogs(allLogs);
  } else {
    const pwd = prompt("Enter admin password:");
    if (pwd === ADMIN_PASSWORD) {
      isAdmin = true;
      adminBtn.classList.add("active");
      adminBtn.textContent = "Admin ✓";
      renderLogs(allLogs);
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
    filterClub.placeholder =
      activeTab === "club"
        ? "Filter by club name..."
        : "Filter by member name...";
    filterClub.value = "";
    statsBanner.classList.add("hidden");
    loadLogs();
  });
});

async function loadLogs() {
  try {
    allLogs = await api.get("/membership-logs");
    const search = filterClub.value.trim().toLowerCase();
    let filtered = allLogs;
    if (search) {
      filtered =
        activeTab === "club"
          ? allLogs.filter((l) => l.clubName.toLowerCase().includes(search))
          : allLogs.filter(
              (l) => l.memberName && l.memberName.toLowerCase().includes(search)
            );
    }
    if (activeTab === "club" && filterClub.value.trim()) {
      loadStats(filterClub.value.trim());
    } else {
      statsBanner.classList.add("hidden");
    }
    renderLogs(filtered);
  } catch (err) {
    list.innerHTML = `<p class="error">Failed to load logs.</p>`;
  }
}

async function loadStats(clubName) {
  try {
    const data = await api.get(
      `/membership-logs/stats/${encodeURIComponent(clubName)}`
    );
    statsClubName.textContent = clubName;
    statsAvg.textContent = data.avgHours;
    statsBanner.classList.remove("hidden");
  } catch (err) {
    statsBanner.classList.add("hidden");
  }
}

function showLogDetail(log) {
  const overlay = document.createElement("div");
  overlay.className = "detail-overlay";
  if (activeTab === "club") {
    overlay.innerHTML = `
      <div class="detail-box">
        <button class="detail-close" id="log-detail-close">✕</button>
        <h2 style="margin-bottom:0.5rem;">${log.clubName}</h2>
        <span class="hours" style="display:inline-block; margin-bottom:1rem;">⏱ ${log.weeklyHours} hrs/week</span>
        <p style="margin-bottom:0.75rem;"><span class="label-benefits">✓ Benefits:</span> ${log.benefits}</p>
        <p><span class="label-challenges">✗ Challenges:</span> ${log.challenges}</p>
      </div>
    `;
  } else {
    overlay.innerHTML = `
      <div class="detail-box">
        <button class="detail-close" id="log-detail-close">✕</button>
        <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1rem;">
          <div class="log-avatar">${(log.memberName || "A").charAt(0).toUpperCase()}</div>
          <div>
            <h2 style="margin-bottom:0.1rem;">${log.memberName || "Anonymous"}</h2>
            <span class="log-club-tag">${log.clubName}</span>
          </div>
        </div>
        <span class="hours" style="display:inline-block; margin-bottom:1rem;">⏱ ${log.weeklyHours} hrs/week</span>
        <p style="margin-bottom:0.75rem;"><span class="label-benefits">✓ Benefits:</span> ${log.benefits}</p>
        <p><span class="label-challenges">✗ Challenges:</span> ${log.challenges}</p>
      </div>
    `;
  }
  document.body.appendChild(overlay);
  overlay
    .querySelector("#log-detail-close")
    .addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });
}

function renderLogs(logs) {
  if (logs.length === 0) {
    list.innerHTML = `<p class="empty">No logs found.</p>`;
    return;
  }

  if (activeTab === "club") {
    const grouped = {};
    logs.forEach((l) => {
      if (!grouped[l.clubName]) grouped[l.clubName] = [];
      grouped[l.clubName].push(l);
    });

    list.innerHTML = Object.entries(grouped)
      .map(
        ([clubName, clubLogs]) => `
      <div class="log-group">
        <div class="log-group-header">
          <h2 class="log-group-title">${clubName}</h2>
          <span class="log-group-count">${clubLogs.length} review${clubLogs.length !== 1 ? "s" : ""}</span>
        </div>
        <div class="logs-grid">
          ${clubLogs
            .map(
              (l) => `
            <div class="log-card" data-id="${l._id}">
              <div class="log-card-header">
                <span class="hours">⏱ ${l.weeklyHours} hrs/week</span>
                ${
                  isAdmin
                    ? `
                <div class="card-actions">
                  <button class="btn-edit" data-id="${l._id}">Edit</button>
                  <button class="btn-delete" data-id="${l._id}">Delete</button>
                </div>`
                    : ""
                }
              </div>
              <p><span class="label-benefits">✓ Benefits:</span> ${l.benefits}</p>
              <p><span class="label-challenges">✗ Challenges:</span> ${l.challenges}</p>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `
      )
      .join("");
  } else {
    const namedLogs = logs.filter(
      (l) => l.memberName && l.memberName.trim() !== ""
    );
    if (namedLogs.length === 0) {
      list.innerHTML = `<p class="empty">No member reviews yet. Be the first to add one!</p>`;
      return;
    }
    list.innerHTML = `<div class="logs-grid">${namedLogs
      .map(
        (l) => `
      <div class="log-card log-card-member" data-id="${l._id}">
        <div class="log-card-header">
          <div style="display:flex; align-items:center; gap:0.6rem;">
            <div class="log-avatar">${l.memberName.charAt(0).toUpperCase()}</div>
            <h3>${l.memberName}</h3>
          </div>
          ${
            isAdmin
              ? `
          <div class="card-actions">
            <button class="btn-edit" data-id="${l._id}">Edit</button>
            <button class="btn-delete" data-id="${l._id}">Delete</button>
          </div>`
              : ""
          }
        </div>
        <span class="log-club-tag">${l.clubName}</span>
        <button class="btn-view-details" data-id="${l._id}">View Details →</button>
      </div>
    `
      )
      .join("")}</div>`;
  }

  list.querySelectorAll(".btn-view-details").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const log = allLogs.find((l) => l._id === btn.dataset.id);
      if (log) showLogDetail(log);
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
        deleteLog(btn.dataset.id);
      });
    });
  }
}

function openAdd() {
  formTitle.textContent = "Add Membership Log";
  form.reset();
  document.getElementById("log-id").value = "";
  formContainer.classList.remove("hidden");
  formContainer.scrollIntoView({ behavior: "smooth" });
}

async function openEdit(id) {
  try {
    const log = await api.get(`/membership-logs/${id}`);
    formTitle.textContent = "Edit Membership Log";
    document.getElementById("log-id").value = log._id;
    document.getElementById("log-club").value = log.clubName;
    document.getElementById("log-member").value = log.memberName || "";
    document.getElementById("log-hours").value = log.weeklyHours;
    document.getElementById("log-benefits").value = log.benefits;
    document.getElementById("log-challenges").value = log.challenges;
    formContainer.classList.remove("hidden");
    formContainer.scrollIntoView({ behavior: "smooth" });
  } catch (err) {
    alert("Failed to load log details.");
  }
}

async function deleteLog(id) {
  if (!confirm("Are you sure you want to delete this log?")) return;
  try {
    await api.delete(`/membership-logs/${id}`);
    loadLogs();
  } catch (err) {
    alert("Failed to delete log.");
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("log-id").value;
  const data = {
    clubName: document.getElementById("log-club").value,
    memberName: document.getElementById("log-member").value,
    weeklyHours: document.getElementById("log-hours").value,
    benefits: document.getElementById("log-benefits").value,
    challenges: document.getElementById("log-challenges").value,
  };
  try {
    if (id) {
      await api.put(`/membership-logs/${id}`, data);
    } else {
      await api.post("/membership-logs", data);
    }
    formContainer.classList.add("hidden");
    form.reset();
    loadLogs();
  } catch (err) {
    alert(err.message);
  }
});

addBtn.addEventListener("click", openAdd);
cancelBtn.addEventListener("click", () => {
  formContainer.classList.add("hidden");
  form.reset();
});

let debounceTimer;
filterClub.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(loadLogs, 400);
});

loadLogs();
