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
  const navLinks = document.querySelector(".nav-links");
  if (!navLinks) return;

  const existing = document.getElementById("auth-nav-btn");
  if (existing) existing.remove();

  if (user) {
    const btn = document.createElement("button");
    btn.id = "auth-nav-btn";
    btn.className = "btn-auth-nav";
    btn.textContent = `👤 ${user.name.split(" ")[0]}`;
    btn.addEventListener("click", () => {
      if (confirm(`Log out of ${user.name}'s account?`)) {
        logout();
      }
    });
    navLinks.appendChild(btn);
  } else {
    const link = document.createElement("a");
    link.id = "auth-nav-btn";
    link.href = "/login.html";
    link.className = "btn-auth-nav";
    link.textContent = "Log In";
    navLinks.appendChild(link);
  }
}
