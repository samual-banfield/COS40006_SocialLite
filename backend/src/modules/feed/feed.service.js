const postService = require("../post/post.service");

exports.getFeed = async (userId) => {
    return { posts: await postService.listPosts(userId) };
};
