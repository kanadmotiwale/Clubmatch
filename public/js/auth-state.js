export function getUser() {
  try {
    const raw = localStorage.getItem("clubmatch_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem("clubmatch_user");
  window.location.href = "/";
}

export function setupAuthNav() {
  const user = getUser();
  const loginLink = document.getElementById("nav-login-link");
  const userBtn = document.getElementById("nav-user-name");

  if (!loginLink || !userBtn) return;

  if (user) {
    loginLink.classList.add("hidden");
    userBtn.classList.remove("hidden");
    userBtn.textContent = `👤 ${user.name.split(" ")[0]} ▾`;

    userBtn.addEventListener("click", () => {
      showUserModal(user);
    });
  } else {
    loginLink.classList.remove("hidden");
    userBtn.classList.add("hidden");
  }
}

function showUserModal(user) {
  const existing = document.getElementById("user-menu-modal");
  if (existing) {
    existing.remove();
    return;
  }

  const modal = document.createElement("div");
  modal.id = "user-menu-modal";
  modal.className = "admin-modal-overlay";
  modal.innerHTML = `
    <div class="admin-modal-box" style="max-width:360px;">
      <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1.25rem; padding-bottom:1rem; border-bottom:1px solid #f3f4f6;">
        <div style="background:linear-gradient(135deg,#1e293b,#334155); color:white; width:44px; height:44px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.2rem; font-weight:800; flex-shrink:0;">
          ${user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p style="font-weight:700; font-size:1rem; color:#111827; margin:0;">${user.name}</p>
          <p style="font-size:0.8rem; color:#6b7280; margin:0;">${user.email}</p>
        </div>
      </div>
      <button id="user-modal-edit" class="btn-primary" style="width:100%; margin-bottom:0.75rem;">✏️ Edit My Details</button>
      <button id="user-modal-logout" class="btn-secondary" style="width:100%; color:#dc2626; border-color:#fecaca;">🚪 Log Out</button>
    </div>
  `;
  document.body.appendChild(modal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.remove();
  });

  modal.querySelector("#user-modal-logout").addEventListener("click", () => {
    modal.remove();
    logout();
  });

  modal.querySelector("#user-modal-edit").addEventListener("click", () => {
    modal.remove();
    showEditModal(user);
  });
}

function showEditModal(user) {
  const existing = document.getElementById("edit-profile-modal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.id = "edit-profile-modal";
  modal.className = "admin-modal-overlay";
  modal.innerHTML = `
    <div class="admin-modal-box" style="max-width:500px;">
      <h2>Edit My Details</h2>
      <p style="color:#6b7280; font-size:0.875rem; margin-bottom:1.25rem;">Update your profile information.</p>
      <div id="edit-profile-error" class="admin-error hidden"></div>
      <div class="form-group">
        <label>Full Name</label>
        <input type="text" id="ep-name" value="${user.name || ""}" />
      </div>
      <div class="form-group">
        <label>Major</label>
        <input type="text" id="ep-major" value="${user.major || ""}" />
      </div>
      <div class="form-group">
        <label>Year</label>
        <select id="ep-year">
          <option value="">Select year</option>
          ${["Freshman", "Sophomore", "Junior", "Senior", "Graduate"]
            .map(
              (y) =>
                `<option value="${y}" ${user.year === y ? "selected" : ""}>${y}</option>`
            )
            .join("")}
        </select>
      </div>
      <div class="form-group">
        <label>Bio</label>
        <input type="text" id="ep-bio" value="${user.bio || ""}" />
      </div>
      <div class="form-group">
        <label>Interests (comma separated)</label>
        <input type="text" id="ep-interests" value="${(user.interests || []).join(", ")}" />
      </div>
      <div class="admin-modal-actions">
        <button id="ep-cancel" class="btn-secondary">Cancel</button>
        <button id="ep-save" class="btn-primary">Save Changes</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  modal
    .querySelector("#ep-cancel")
    .addEventListener("click", () => modal.remove());
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.remove();
  });

  modal.querySelector("#ep-save").addEventListener("click", async () => {
    const errorBox = modal.querySelector("#edit-profile-error");
    errorBox.classList.add("hidden");
    const updated = {
      name: modal.querySelector("#ep-name").value.trim(),
      email: user.email,
      major: modal.querySelector("#ep-major").value.trim(),
      year: modal.querySelector("#ep-year").value,
      bio: modal.querySelector("#ep-bio").value.trim(),
      interests: modal
        .querySelector("#ep-interests")
        .value.split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      joinedClubs: user.joinedClubs || [],
    };
    if (!updated.name || !updated.major || !updated.year) {
      errorBox.textContent = "Name, major and year are required.";
      errorBox.classList.remove("hidden");
      return;
    }
    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) {
        const data = await res.json();
        errorBox.textContent = data.error || "Failed to update profile.";
        errorBox.classList.remove("hidden");
        return;
      }
      const data = await res.json();
      localStorage.setItem("clubmatch_user", JSON.stringify(data));
      modal.remove();
      setupAuthNav();
      alert("Profile updated successfully!");
    } catch (err) {
      errorBox.textContent = "Something went wrong. Please try again.";
      errorBox.classList.remove("hidden");
    }
  });
}
