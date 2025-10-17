const STORAGE_KEY = "authUser";
const TOKEN_KEY = "authToken";

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function login(authorId) {
  const user = { authorId };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

export function isOwner(post, user) {
  if (!post || !user) return false;
  // Backend now uses authorId
  return post.authorId === user.authorId;
}

export async function loginAndFetchToken(authorId) {
  const res = await fetch((import.meta.env.VITE_API_BASE_URL || "https://grocerystorenodefinal-5.onrender.com") + "/login", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ authorId })
  });
  if (!res.ok) throw new Error('Login failed');
  const data = await res.json();
  localStorage.setItem(TOKEN_KEY, data.token);
  return data.token;
}


