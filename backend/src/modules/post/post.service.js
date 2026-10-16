const seedPosts = require("./post.seed");

const posts = seedPosts.map(({ likedBy, ...post }, i) => ({ id: i + 1, ...post }));
let nextId = posts.length + 1;

// postId -> Set of usernames, stands in for a likes(post_id, username) table
const likes = new Map(
    seedPosts.map(({ likedBy = [] }, i) => [i + 1, new Set(likedBy)]),
);

exports.listPosts = () => {
    return [...posts].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
};

exports.getPost = (id) => {
    return posts.find((p) => p.id === id) ?? null;
};

exports.createPost = ({ username, title, content }) => {
    const post = {
        id: nextId++,
        username,
        title,
        content,
        createdAt: new Date().toISOString(),
    };
    posts.push(post);
    return post;
};

exports.countLikes = (id) => {
    return likes.get(id)?.size ?? 0;
};

exports.hasLiked = (id, username) => {
    if (!username) return false;
    return likes.get(id)?.has(username) ?? false;
};

// the shape sent to clients, likedByMe is false when nobody is logged in
exports.withLikes = (post, username) => {
    return {
        ...post,
        likes: exports.countLikes(post.id),
        likedByMe: exports.hasLiked(post.id, username),
    };
};

// liking and unliking are idempotent, both return true or false if the post doesn't exist
exports.likePost = (id, username) => {
    if (!exports.getPost(id)) return false;
    if (!likes.has(id)) likes.set(id, new Set());
    likes.get(id).add(username);
    return true;
};

exports.unlikePost = (id, username) => {
    if (!exports.getPost(id)) return false;
    likes.get(id)?.delete(username);
    return true;
};
