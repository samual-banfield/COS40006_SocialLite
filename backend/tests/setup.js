const prisma = require("../src/db");

// the first model query opens the database connection and loads prisma's query
// compiler, which can take longer than the default 5s timeout, so it's done here
// once before each file's tests run. a raw query isn't enough, it skips the compiler
beforeAll(async () => {
    await prisma.post.findFirst({ select: { id: true } });
}, 30000);
