require("./env");
const { PrismaClient } = require("@prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");

// prisma 7 needs a driver to connect, the mariadb driver also works with mysql
const adapter = new PrismaMariaDb(process.env.DATABASE_URL);

module.exports = new PrismaClient({ adapter });
