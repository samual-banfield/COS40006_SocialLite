const validPostContent = function (req, res, next) {
    const postContent = req.body.postContent;
    // checking that req.body.postContent is a valid string
    if (typeof postContent !== "string" && postContent.trim().length == 0) {
        return res.status(400).json({
            error: "posts must contain a non-whitespace string",
        });
    }
    req.body.postContent = req.body.postContent.trim();
    next();
};

module.exports = validPostContent;
