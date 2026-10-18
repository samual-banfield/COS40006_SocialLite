import react from "@vitejs/plugin-react";
import process from "node:process";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [react()],
    server: {
        // docker compose sets API_URL to the backend container, running locally falls back to localhost
        proxy: {
            "/api": process.env.API_URL ?? "http://localhost:3000",
        },
        // file change events don't reach the container through windows bind mounts, so poll instead
        watch: {
            usePolling: Boolean(process.env.API_URL),
        },
    },
});
