const { CreatePostBody } = require("../schemas");

// checking that the title and content are non-whitespace strings within the limits, see schemas.js
const validPostContent = function (req, res, next) {
    const result = CreatePostBody.safeParse(req.body ?? {});
    if (!result.success) {
        return res.status(400).json({ error: result.error.issues[0].message });
    }
    // the parsed body has the title and content trimmed
    req.body = result.data;
    next();
};

module.exports = validPostContent;
