const express = require("express");
const ctrl = require("./post.controller");
const requireAuth = require("../../middleware/requireAuth");
const validaId = require("../../middleware/validaId");
const validPostContent = require("../../middleware/validPostContent");
const uploadImage = require("../../middleware/uploadImage");

const router = express.Router();
router.get("/:id", validaId, ctrl.getPost);
// requireAuth runs first so only logged in users can upload
router.post("/", requireAuth, uploadImage, validPostContent, ctrl.createPost);

router.post("/:id/like", requireAuth, validaId, ctrl.likePost);
router.delete("/:id/like", requireAuth, validaId, ctrl.unlikePost);

module.exports = router;
