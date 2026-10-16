const express = require("express");
const ctrl = require("./post.controller");
const validaId = require("../../middleware/validaId");
const validPostContent = require("../../middleware/validPostContent");

const router = express.Router();
router.get("/:id", validaId, ctrl.getPost);
router.post("/", validPostContent, ctrl.createPost);
router.delete("/:id", validaId, ctrl.deletePost);

router.post("/:id/like", validaId, ctrl.likePost);
router.delete("/:id/like", validaId, ctrl.unlikePost);

module.exports = router;
