import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { createHtmlPlugin } from "vite-plugin-html";
import react from "@vitejs/plugin-react-swc";
import path from "path";



const GH_PAGE_BASE = "https://newish0.github.io/linked-scanner/client";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    console.log(command, mode);

    // console.log(path.resolve(__dirname, "../shared"))

    return {
        plugins: [
            react(),
            VitePWA({
                registerType: "autoUpdate",
                includeAssets: [
                    "favicon.ico",
                    "128x128.png",
                    "128x128@2x.png",
                    "apple-touch-icon.png",
                    "logo.svg",
                ],
                manifest: {
                    name: "Linked Scanner",
                    short_name: "LISC",
                    description: "Use your phone as a barcode scanner for your computer.",
                    theme_color: "#7582ff",
                    start_url: GH_PAGE_BASE,
                    icons: [
                        {
                            src: "32x32.png",
                            sizes: "32x32",
                            type: "image/png",
                        },
                        {
                            src: "128x128.png",
                            sizes: "128x128",
                            type: "image/png",
                        },
                        {
                            src: "128x128@2x.png",
                            sizes: "256x256",
                            type: "image/png",
                        },
                    ],
                },
            }),
            createHtmlPlugin({
                inject: {
                    data: {
                        base: GH_PAGE_BASE,
                    },
                },
            }),
        ],

        define: {
            __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
        },

        resolve: {
            alias: [
                { find: "@", replacement: path.resolve(__dirname, "src") },
                { find: "@assets", replacement: path.resolve(__dirname, "src/assets") },
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
        base: mode === "production" ? GH_PAGE_BASE : "",
    };
});
