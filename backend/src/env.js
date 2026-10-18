const fs = require("fs");
const path = require("path");
const { parseEnv } = require("util");

// loads backend/.env into process.env (process.loadEnvFile doesn't work inside jest)
try {
    const vars = parseEnv(fs.readFileSync(path.join(__dirname, "..", ".env"), "utf8"));
    for (const [key, value] of Object.entries(vars)) {
        process.env[key] ??= value;
    }
} catch (err) {
    if (err.code !== "ENOENT") throw err;
}
