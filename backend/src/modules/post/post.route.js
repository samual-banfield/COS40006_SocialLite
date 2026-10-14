const express = require("express");
const ctrl = require("./post.controller");
const validaId = require("../../middleware/validaId");
const requireAuth = require("../../middleware/requireAuth");
const validPostContent = require("../../middleware/validPostContent");

const router = express.Router();
router.get("/:id", validaId, ctrl.getPost);
// router.post("/:post", validPostContent, ctrl.getPost);

// router.get("/:id/like", validaId, requireAuth, ctrl.getPost);
// router.delete("/:id/like", validaId, requireAuth, ctrl.getPost);

module.exports = router;
