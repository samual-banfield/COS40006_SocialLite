const validInteger = function (req, res, next) {
    const id = Number(req.params.id);
    // checking that id is a valid positive whole integer
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: "id must be a positive integer",
        });
    }
    req.params.id = Number(req.params.id);
    next();
};

module.exports = validInteger;
