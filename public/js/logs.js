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

async function loadLogs() {
    try {
        const clubName = filterClub.value.trim();
        const url = clubName ? `/membership-logs?clubName=${encodeURIComponent(clubName)}` : "/membership-logs";
        const logs = await api.get(url);
        renderLogs(logs);
        if (clubName) loadStats(clubName);
        else statsBanner.classList.add("hidden");
    } catch (err) {
        list.innerHTML = `<p class="error">Failed to load logs.</p>`;
    }
}

async function loadStats(clubName) {
    try {
        const data = await api.get(`/membership-logs/stats/${encodeURIComponent(clubName)}`);
        statsClubName.textContent = clubName;
        statsAvg.textContent = data.avgHours;
        statsBanner.classList.remove("hidden");
    } catch (err) {
        statsBanner.classList.add("hidden");
    }
}

function renderLogs(logs) {
    if (logs.length === 0) {
        list.innerHTML = `<p class="empty">No logs found.</p>`;
        return;
    }
    list.innerHTML = `<div class="logs-grid">${logs
        .map(
            (l) => `
    <div class="log-card">
      <div class="log-card-header">
        <h3>${l.clubName}</h3>
        <div class="card-actions">
          <button class="btn-edit" data-id="${l._id}">Edit</button>
          <button class="btn-delete" data-id="${l._id}">Delete</button>
        </div>
      </div>
      <span class="hours">⏱ ${l.weeklyHours} hrs/week</span>
      <p><span class="label-benefits">✓ Benefits:</span> ${l.benefits}</p>
      <p><span class="label-challenges">✗ Challenges:</span> ${l.challenges}</p>
    </div>
  `
        )
        .join("")}</div>`;

    list.querySelectorAll(".btn-edit").forEach((btn) => {
        btn.addEventListener("click", () => openEdit(btn.dataset.id));
    });
    list.querySelectorAll(".btn-delete").forEach((btn) => {
        btn.addEventListener("click", () => deleteLog(btn.dataset.id));
    });
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