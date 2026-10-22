const express = require("express");
const ctrl = require("./image.controller");

const router = express.Router();
// e.g. /api/images/posts/<uuid>.jpg, key is the path split into an array
router.get("/*key", ctrl.getImage);

module.exports = router;
