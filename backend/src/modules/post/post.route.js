const express = require("express");
const ctrl = require("./post.controller");
const validInteger = require("../../middleware/validInteger");

const router = express.Router();
router.get("/:id", validInteger, ctrl.getPost);

module.exports = router;
