const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://grocerystorenodefinal-5.onrender.com";

function getToken() {
  try {
    return localStorage.getItem('authToken') || '';
  } catch {
    return '';
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
    ...options,
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

export const postsApi = {
  list: () => request("/posts", { method: "GET" }),
  get: (id) => request(`/posts/${id}`, { method: "GET" }),
  create: (data) => request("/posts", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/posts/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => request(`/posts/${id}`, { method: "DELETE" }),
};

export default postsApi;


