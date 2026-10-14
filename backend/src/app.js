const express = require("express");
const app = express();

app.use("/api/health", require("./modules/health/health.route"));
app.use("/api/post", require("./modules/post/post.route"));
app.use("/api/feed", require("./modules/feed/feed.route"));
// app.use("/api/auth", require("./modules/auth/auth.route"));

module.exports = app;
