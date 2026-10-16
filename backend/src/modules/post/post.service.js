// in-memory post store, swap this out for a real database later.
// everything resets when the server restarts.

const seedPosts = require("./post.seed");

let nextId = 1;
const posts = [];

function addPost({ username, title, content, image, createdAt, likedBy = [] }) {
    const post = {
        id: nextId++,
        username,
        title,
        content,
        createdAt: createdAt ?? new Date().toISOString(),
        likedBy: [...likedBy],
    };
    if (image) post.image = image;
    posts.push(post);
    return post;
}

seedPosts.forEach(addPost);

// newest first
exports.listPosts = () => {
    return [...posts].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
};

// returns the post, or null if it doesn't exist
exports.getPost = (id) => {
    return posts.find((p) => p.id === id) ?? null;
};

exports.createPost = ({ username, title, content }) => {
    return addPost({ username, title, content });
};

// returns true if a post was removed
exports.deletePost = (id) => {
    const index = posts.findIndex((p) => p.id === id);
    if (index === -1) return false;
    posts.splice(index, 1);
    return true;
};

// liking and unliking are idempotent, both return the updated post or null if it doesn't exist
exports.likePost = (id, username) => {
    const post = exports.getPost(id);
    if (!post) return null;
    if (!post.likedBy.includes(username)) post.likedBy.push(username);
    return post;
};

exports.unlikePost = (id, username) => {
    const post = exports.getPost(id);
    if (!post) return null;
    post.likedBy = post.likedBy.filter((u) => u !== username);
    return post;
};
