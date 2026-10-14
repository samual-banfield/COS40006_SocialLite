const express = require("express");
const app = express();

app.use("/api/health", require("./modules/health/health.route"));
app.use("/api/post", require("./modules/post/post.route"));

module.exports = app;
