const express = require("express");
const ctrl = require("./auth.controller");

const router = express.Router();
router.post("/signup", ctrl.signup);
router.post("/login", ctrl.login);

module.exports = router;
