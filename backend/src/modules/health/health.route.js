const express = require("express");
const prisma = require("../../db");
const router = express.Router();

// version is the code hash the image was built from, so deploys can check the new image is live.
// The database is queried too, so "ok" means the app can actually serve requests.
router.get("/", async (req, res) => {
    const version = process.env.APP_VERSION || "dev";
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({ status: "ok", version });
    } catch (err) {
        console.error(err);
        res.status(503).json({ status: "database unreachable", version });
    }
});

module.exports = router;
