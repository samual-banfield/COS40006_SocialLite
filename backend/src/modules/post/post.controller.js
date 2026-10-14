const postService = require("./post.service");

exports.getPost = (req, res) => {
    const id = Number(req.params.id);
    const post = postService.getPost(id);
    res.json(post);
};
