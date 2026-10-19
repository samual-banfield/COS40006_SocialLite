require("./env");

const express = require("express");
const app = express();

app.use(express.json());

app.use("/api/health", require("./modules/health/health.route"));
app.use("/api/post", require("./modules/post/post.route"));
app.use("/api/feed", require("./modules/feed/feed.route"));
app.use("/api/auth", require("./modules/auth/auth.route"));

app.use("/api", (req, res) => {
    res.status(404).json({ error: "route not found" });
});

// malformed json bodies and anything else that throws
app.use((err, req, res, next) => {
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ error: "request body must be valid json" });
    }
    console.error(err);
    res.status(500).json({ error: "internal server error" });
});

module.exports = app;
