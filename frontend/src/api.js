// thin wrappers around the backend API, see backend/src/app.js for routes

// TODO: once auth exists the backend will know who the user is, so the
// username arguments below can be dropped

async function request(path, { method = "GET", body } = {}) {
    const res = await fetch(path, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
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

export async function getFeed() {
    const data = await request("/api/feed");
    return data.posts;
}

export function getPost(id) {
    return request(`/api/post/${id}`);
}

export function createPost({ username, title, content }) {
    return request("/api/post", {
        method: "POST",
        body: { username, title, content },
    });
}

export function deletePost(id, username) {
    return request(`/api/post/${id}`, { method: "DELETE", body: { username } });
}

export function likePost(id, username) {
    return request(`/api/post/${id}/like`, { method: "POST", body: { username } });
}

export function unlikePost(id, username) {
    return request(`/api/post/${id}/like`, { method: "DELETE", body: { username } });
}
