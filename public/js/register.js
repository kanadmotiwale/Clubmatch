const form = document.getElementById("register-form");
const errorBox = document.getElementById("auth-error");

const existing = localStorage.getItem("clubmatch_user");
if (existing) {
  window.location.href = "/";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorBox.classList.add("hidden");
  errorBox.textContent = "";

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const major = document.getElementById("major").value.trim();
  const year = document.getElementById("year").value;
  const bio = document.getElementById("bio").value.trim();
  const interestsRaw = document.getElementById("interests").value;
  const interests = interestsRaw
    ? interestsRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  if (password.length < 6) {
    errorBox.textContent = "Password must be at least 6 characters.";
    errorBox.classList.remove("hidden");
    return;
  }

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        major,
        year,
        bio,
        interests,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      errorBox.textContent =
        data.error || "Registration failed. Please try again.";
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
