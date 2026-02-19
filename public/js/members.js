import { api } from "./api.js";

const list = document.getElementById("members-list");
const formContainer = document.getElementById("member-form-container");
const form = document.getElementById("member-form");
const formTitle = document.getElementById("form-title");
const registerBtn = document.getElementById("register-btn");
const cancelBtn = document.getElementById("cancel-member-btn");
const searchInput = document.getElementById("search-members");

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
        <div class="card-actions">
          <button class="btn-edit" data-id="${m._id}">Edit</button>
          <button class="btn-delete" data-id="${m._id}">Delete</button>
        </div>
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

  list.querySelectorAll(".btn-edit").forEach((btn) => {
    btn.addEventListener("click", () => openEdit(btn.dataset.id));
  });
  list.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", () => deleteMember(btn.dataset.id));
  });
}

function openAdd() {
  formTitle.textContent = "Register Profile";
  form.reset();
  document.getElementById("member-id").value = "";
  formContainer.classList.remove("hidden");
}

async function openEdit(id) {
  try {
    const member = await api.get(`/users/${id}`);
    formTitle.textContent = "Edit Profile";
    document.getElementById("member-id").value = member._id;
    document.getElementById("member-name").value = member.name;
    document.getElementById("member-email").value = member.email;
    document.getElementById("member-major").value = member.major;
    document.getElementById("member-year").value = member.year;
    document.getElementById("member-bio").value = member.bio || "";
    document.getElementById("member-interests").value = (member.interests || []).join(", ");
    document.getElementById("member-clubs").value = (member.joinedClubs || []).join(", ");
    formContainer.classList.remove("hidden");
  } catch (err) {
    alert("Failed to load member details.");
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

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("member-id").value;
  const interestsRaw = document.getElementById("member-interests").value;
  const clubsRaw = document.getElementById("member-clubs").value;
  const data = {
    name: document.getElementById("member-name").value,
    email: document.getElementById("member-email").value,
    major: document.getElementById("member-major").value,
    year: document.getElementById("member-year").value,
    bio: document.getElementById("member-bio").value,
    interests: interestsRaw ? interestsRaw.split(",").map((s) => s.trim()).filter(Boolean) : [],
    joinedClubs: clubsRaw ? clubsRaw.split(",").map((s) => s.trim()).filter(Boolean) : [],
  };
  try {
    if (id) {
      await api.put(`/users/${id}`, data);
    } else {
      await api.post("/users", data);
    }
    formContainer.classList.add("hidden");
    form.reset();
    loadMembers();
  } catch (err) {
    alert(err.message);
  }
});

registerBtn.addEventListener("click", openAdd);
cancelBtn.addEventListener("click", () => {
  formContainer.classList.add("hidden");
  form.reset();
});

let debounceTimer;
searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(loadMembers, 400);
});

loadMembers();
