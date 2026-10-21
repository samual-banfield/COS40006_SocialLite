const { Id } = require("../schemas");

// checking that id is a valid positive whole integer, see schemas.js
const validaId = function (req, res, next) {
    const result = Id.safeParse(req.params.id);
    if (!result.success) {
        return res.status(400).json({ error: result.error.issues[0].message });
    }
    req.params.id = result.data;
    next();
};

module.exports = validaId;
