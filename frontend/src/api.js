// thin wrappers around the backend API, see backend/src/app.js for routes

export async function getFeed() {
    const res = await fetch("/api/feed");
    if (!res.ok) {
        throw new Error(`failed to load feed (${res.status})`);
    }
    const data = await res.json();
    return data.posts;
}
