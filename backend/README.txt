Dependencies have been split between dependencies and devDependencies.
npm i will install all dependencies

Can run locally with `node .\src\server.js`

Tests can be run with npm run test which will run execute jest to search and execute any files named as '*.test.js'.
It will also post the coverage report to /coverage hich can be checked in a browser at 'localhost/backend/coverage/lcov-report/index.html' 

Running with Docker (no local MySQL needed):
  1. from the repo root, copy .env.example to .env and fill in JWT_SECRET
  2. `docker compose up --build` starts mysql, the backend (applies migrations on start) and the frontend
     frontend http://localhost:5173, backend http://localhost:3000, mysql localhost:3306 (user root, password from MYSQL_ROOT_PASSWORD, defaults to "password")
  3. `docker compose run --rm backend npm run db:seed` to add the seed data
  `docker compose down` stops everything and keeps the data, `docker compose down -v` also wipes the database.
  Run any backend script inside the container the same way, e.g. `docker compose run --rm backend npm test`

First time setup (without Docker):
  1. install and start a MySQL server (8.x) locally
  2. from the repo root, copy .env.example to .env, fill in JWT_SECRET and set DATABASE_URL to your MySQL user, password and port
  3. from /backend, `npm i` (also runs `prisma generate`)
  4. `npm run db:reset` creates the tables from the migrations and seeds them

Every seeded user (test, dev, user, lorem.ipsum, dolor_sit, consectetur) has the password "password".

Scripts:
  npm run db:migrate   after editing schema.prisma, creates and applies a new migration
  npm run db:seed      wipes the data and re-inserts the seed data from prisma/seed.js
  npm run db:reset     drops the database, re-applies every migration and seeds it

After changing schema.prisma, run `npx prisma generate` if the client types look out of date.
