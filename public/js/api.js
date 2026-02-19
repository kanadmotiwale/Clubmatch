const BASE = "/api";

async function request(url, method = "GET", body = null) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(BASE + url, options);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Something went wrong");
  }
  return res.json();
}

export const api = {
  get: (url) => request(url),
  post: (url, body) => request(url, "POST", body),
  put: (url, body) => request(url, "PUT", body),
  delete: (url) => request(url, "DELETE"),
};
