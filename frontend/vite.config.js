import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [react()],
    server: {
        // TODO: Change out hardcoded localhost config
        proxy: {
            "/api": "http://localhost:3000",
        },
    },
});
