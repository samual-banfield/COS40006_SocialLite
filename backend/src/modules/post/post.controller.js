const postService = require("./post.service");
const authService = require("../auth/auth.service");

const notFound = (res) => res.status(404).json({ error: "post not found" });

exports.getPost = async (req, res) => {
    // getPost is also used after liking, where requireAuth has already set req.user
    const user = req.user ?? authService.userFromHeader(req.headers.authorization);
    const post = await postService.getPost(req.params.id, user?.id);
    if (!post) return notFound(res);
    res.json(post);
};

exports.createPost = async (req, res) => {
    const { title, content } = req.body;
    const post = await postService.createPost({
        authorId: req.user.id,
        title,
        content,
        image: req.file,
    });
    res.status(201).json(post);
};

exports.updatePost = async (req, res) => {
    const { title, content } = req.body;
    const post = await postService.updatePost(req.params.id, req.user.id, { title, content });
    if (post === null) return notFound(res);
    if (post === false) return res.status(403).json({ error: "you can only edit your own posts" });
    res.json(post);
};

exports.deletePost = async (req, res) => {
    const deleted = await postService.deletePost(req.params.id, req.user.id);
    if (deleted === null) return notFound(res);
    if (deleted === false) return res.status(403).json({ error: "you can only delete your own posts" });
    res.status(204).end();
};

exports.likePost = async (req, res) => {
    if (!(await postService.likePost(req.params.id, req.user.id))) return notFound(res);
    await exports.getPost(req, res);
};

exports.unlikePost = async (req, res) => {
    if (!(await postService.unlikePost(req.params.id, req.user.id))) return notFound(res);
    await exports.getPost(req, res);
};
