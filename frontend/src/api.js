// thin wrappers around the backend API, see backend/src/app.js for routes

// the JWT from /api/auth/login, sent with every request once logged in.
// it only lives in memory, so refreshing the page logs you out.
let token = null;

export function setToken(newToken) {
    token = newToken;
}

async function request(path, { method = "GET", body } = {}) {
    const headers = {};
    if (body) headers["Content-Type"] = "application/json";
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(path, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 204) return null;

    // the backend sends { error } on failures, fall back to the status if it didn't
    const data = await res.json().catch(() => null);
    if (!res.ok) {
        throw new Error(data?.error ?? `request failed (${res.status})`);
    }
    return data;
}

// returns { token, user }
export function login({ username, password }) {
    return request("/api/auth/login", {
        method: "POST",
        body: { username, password },
    });
}

export async function getFeed() {
    const data = await request("/api/feed");
    return data.posts;
}

export function getPost(id) {
    return request(`/api/post/${id}`);
}

export function createPost({ title, content }) {
    return request("/api/post", { method: "POST", body: { title, content } });
}

export function updatePost(id, { title, content }) {
    return request(`/api/post/${id}`, { method: "PATCH", body: { title, content } });
}

export function likePost(id) {
    return request(`/api/post/${id}/like`, { method: "POST" });
}

export function unlikePost(id) {
    return request(`/api/post/${id}/like`, { method: "DELETE" });
}
