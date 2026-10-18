FROM node:24-slim

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json prisma.config.js ./
COPY prisma ./prisma
COPY src/env.js ./src/env.js
RUN DATABASE_URL=mysql://build:build@localhost:3306/build npm ci

COPY . .

EXPOSE 3000

# apply any migrations that haven't run yet, then start the api
CMD ["sh", "-c", "npx prisma migrate deploy && node src/server.js"]
