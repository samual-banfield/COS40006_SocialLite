// thin wrappers around the backend API, see backend/src/app.js for routes

// the JWT from /api/auth/login, sent with every request once logged in.
// it only lives in memory, so refreshing the page logs you out.
let token = null;

export function setToken(newToken) {
    token = newToken;
}

async function request(path, { method = "GET", body } = {}) {
    // FormData is sent as is, the browser sets its multipart content type
    const isForm = body instanceof FormData;
    const headers = {};
    if (body && !isForm) headers["Content-Type"] = "application/json";
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(path, {
        method,
        headers,
        body: body && !isForm ? JSON.stringify(body) : body,
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

// returns { token, user }, but the app logs in straight after rather than using it
export function signup({ username, password }) {
    return request("/api/auth/signup", {
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

// image is an optional File, which means the post has to be sent as multipart form data
export function createPost({ title, content, image }) {
    if (!image) {
        return request("/api/post", { method: "POST", body: { title, content } });
    }
    const form = new FormData();
    form.append("title", title);
    form.append("content", content);
    form.append("image", image);
    return request("/api/post", { method: "POST", body: form });
}

export function updatePost(id, { title, content }) {
    return request(`/api/post/${id}`, { method: "PATCH", body: { title, content } });
}

export function deletePost(id) {
    return request(`/api/post/${id}`, { method: "DELETE" });
}

export function likePost(id) {
    return request(`/api/post/${id}/like`, { method: "POST" });
}

export function unlikePost(id) {
    return request(`/api/post/${id}/like`, { method: "DELETE" });
}
