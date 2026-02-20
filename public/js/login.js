const form = document.getElementById("login-form");
const errorBox = document.getElementById("auth-error");

const existing = localStorage.getItem("clubmatch_user");
if (existing) {
  window.location.href = "/";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorBox.classList.add("hidden");
  errorBox.textContent = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      errorBox.textContent = data.error || "Login failed. Please try again.";
      errorBox.classList.remove("hidden");
      return;
    }

    localStorage.setItem("clubmatch_user", JSON.stringify(data));
    window.location.href = "/";
  } catch (err) {
    errorBox.textContent = "Something went wrong. Please try again.";
    errorBox.classList.remove("hidden");
  }
});
