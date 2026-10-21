# Production image. The backend serves the built frontend, so the whole app runs in one container.
# Build from the repo root with `docker build -t social-lite-app .`
# For local development, use docker compose instead (it uses backend/Dockerfile and frontend/Dockerfile).

# Stage 1: Build the React frontend into static files
FROM node:24-slim AS frontend

WORKDIR /frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend ./
RUN npm run build

# Stage 2: The backend API, which also serves the frontend from ./public
FROM node:24-slim

# Prisma needs OpenSSL to run
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies first. Prisma runs during install and needs a DATABASE_URL,
# so we give it a placeholder (no database is actually used here).
COPY backend/package.json backend/package-lock.json backend/prisma.config.js ./
COPY backend/prisma ./prisma
COPY backend/src/env.js ./src/env.js
RUN DATABASE_URL=mysql://build:build@localhost:3306/build npm ci

COPY backend ./
COPY --from=frontend /frontend/dist ./public

EXPOSE 3000

# Update the database tables, then start the server
CMD ["sh", "-c", "npx prisma migrate deploy && node src/server.js"]
