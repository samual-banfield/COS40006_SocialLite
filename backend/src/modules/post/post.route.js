const express = require("express");
const ctrl = require("./post.controller");
const requireAuth = require("../../middleware/requireAuth");
const validaId = require("../../middleware/validaId");
const validPostContent = require("../../middleware/validPostContent");

const router = express.Router();
router.get("/:id", validaId, ctrl.getPost);
router.post("/", requireAuth, validPostContent, ctrl.createPost);
router.patch("/:id", requireAuth, validaId, validPostContent, ctrl.updatePost);

router.post("/:id/like", requireAuth, validaId, ctrl.likePost);
router.delete("/:id/like", requireAuth, validaId, ctrl.unlikePost);

module.exports = router;
