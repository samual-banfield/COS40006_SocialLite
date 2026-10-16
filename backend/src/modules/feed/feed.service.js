const postService = require("../post/post.service");

exports.getFeed = () => {
    return {
        posts: postService.listPosts(),
    };
};
