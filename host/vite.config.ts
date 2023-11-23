import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(async () => ({
    plugins: [react()],

    resolve: {
        alias: [
            { find: "@", replacement: path.resolve(__dirname, "src") },
            { find: "@assets", replacement: path.resolve(__dirname, "src/assets") },
            { find: "@utils", replacement: path.resolve(__dirname, "src/utils") },
            { find: "@type", replacement: path.resolve(__dirname, "src/type") },
            { find: "@hooks", replacement: path.resolve(__dirname, "src/hooks") },
            { find: "@components", replacement: path.resolve(__dirname, "src/components") },
            { find: "@routes", replacement: path.resolve(__dirname, "src/routes") },
            { find: "@atoms", replacement: path.resolve(__dirname, "src/atoms") },
            { find: "@shared", replacement: path.resolve(__dirname, "../shared") },
            {
                find: "tailwind-config",
                replacement: path.resolve(__dirname, "./tailwind.config.js"),
            },
        ],
    },

    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    //
    // 1. prevent vite from obscuring rust errors
    clearScreen: false,
    // 2. tauri expects a fixed port, fail if that port is not available
    server: {
        port: 1420,
        strictPort: true,
    },
}));
