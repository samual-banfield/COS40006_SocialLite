const express = require("express");
const router = express.Router();

// version is the code hash the image was built from, so deploys can check the new image is live
router.get("/", (req, res) => res.json({ status: "ok", version: process.env.APP_VERSION || "dev" }));

module.exports = router;
