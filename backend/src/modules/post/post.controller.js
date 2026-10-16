const postService = require("./post.service");
const authService = require("../auth/auth.service");

const notFound = (res) => res.status(404).json({ error: "post not found" });

exports.getPost = (req, res) => {
    const post = postService.getPost(req.params.id);
    if (!post) return notFound(res);
    const username = authService.usernameFromHeader(req.headers.authorization);
    res.json(postService.withLikes(post, username));
};

exports.createPost = (req, res) => {
    const { title, content } = req.body;
    const { username } = req.user;
    const post = postService.createPost({ username, title, content });
    res.status(201).json(postService.withLikes(post, username));
};

exports.likePost = (req, res) => {
    if (!postService.likePost(req.params.id, req.user.username)) return notFound(res);
    exports.getPost(req, res);
};

exports.unlikePost = (req, res) => {
    if (!postService.unlikePost(req.params.id, req.user.username)) return notFound(res);
    exports.getPost(req, res);
};
