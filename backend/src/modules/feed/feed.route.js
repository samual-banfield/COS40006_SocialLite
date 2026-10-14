const express = require("express");
const ctrl = require("./feed.controller");

const router = express.Router();
router.get("/", ctrl.getFeed);

module.exports = router;
