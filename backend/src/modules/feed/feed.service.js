const postService = require("../post/post.service");

exports.getFeed = (username) => {
    return {
        posts: postService.listPosts().map((post) => postService.withLikes(post, username)),
    };
};
