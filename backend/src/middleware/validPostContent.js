const TITLE_MAX = 100;
const CONTENT_MAX = 500;

const isNonEmptyString = (value) =>
    typeof value === "string" && value.trim().length > 0;

const validPostContent = function (req, res, next) {
    const { title, content } = req.body ?? {};
    // checking that the title and content are non-whitespace strings within the limits
    if (!isNonEmptyString(title) || !isNonEmptyString(content)) {
        return res.status(400).json({
            error: "posts must have a title and content containing a non-whitespace string",
        });
    }
    if (title.trim().length > TITLE_MAX || content.trim().length > CONTENT_MAX) {
        return res.status(400).json({
            error: `titles are limited to ${TITLE_MAX} characters and content to ${CONTENT_MAX}`,
        });
    }
    req.body.title = title.trim();
    req.body.content = content.trim();
    next();
};

module.exports = validPostContent;
