Dependencies have been split between dependencies and devDependencies.
npm i will install all dependencies

Can run locally with `node .\src\server.js`

Tests can be run with npm run test which will run execute jest to search and execute any files named as '*.test.js'.
It will also post the coverage report to /coverage hich can be checked in a browser at 'localhost/backend/coverage/lcov-report/index.html' 

First time setup:
  1. install and start a MySQL server (8.x) locally
  2. copy .env.example to .env, fill in JWT_SECRET and set DATABASE_URL to your MySQL user, password and port
  3. from /backend, `npm i` (also runs `prisma generate`)
  4. `npm run db:reset` creates the tables from the migrations and seeds them

Every seeded user (test, dev, user, lorem.ipsum, dolor_sit, consectetur) has the password "password".

Scripts:
  npm run db:migrate   after editing schema.prisma, creates and applies a new migration
  npm run db:seed      wipes the data and re-inserts the seed data from prisma/seed.js
  npm run db:reset     drops the database, re-applies every migration and seeds it

After changing schema.prisma, run `npx prisma generate` if the client types look out of date.
