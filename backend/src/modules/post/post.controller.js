const postService = require("./post.service");

const notFound = (res) => res.status(404).json({ error: "post not found" });

exports.getPost = (req, res) => {
    const post = postService.getPost(req.params.id);
    if (!post) return notFound(res);
    res.json(post);
};

exports.createPost = (req, res) => {
    const { username, title, content } = req.body;
    const post = postService.createPost({ username, title, content });
    res.status(201).json(post);
};

exports.deletePost = (req, res) => {
    const post = postService.getPost(req.params.id);
    if (!post) return notFound(res);
    if (post.username !== req.body.username) {
        return res.status(403).json({ error: "you can only delete your own posts" });
    }
    postService.deletePost(req.params.id);
    res.status(204).end();
};

exports.likePost = (req, res) => {
    const post = postService.likePost(req.params.id, req.body.username);
    if (!post) return notFound(res);
    res.json(post);
};

exports.unlikePost = (req, res) => {
    const post = postService.unlikePost(req.params.id, req.body.username);
    if (!post) return notFound(res);
    res.json(post);
};
