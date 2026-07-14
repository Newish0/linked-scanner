import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import tailwindcss from "@tailwindcss/vite";

import { tanstackRouter } from "@tanstack/router-plugin/vite";

import solidPlugin from "vite-plugin-solid";
import pkg from "./package.json";

export default defineConfig({
    define: {
        "import.meta.env.VITE_APP_VERSION": JSON.stringify(pkg.version),
    },
    resolve: { tsconfigPaths: true },
    plugins: [
        devtools(),
        tailwindcss(),
        tanstackRouter({ target: "solid", autoCodeSplitting: true }),
        solidPlugin(),
    ],
    server: {
        port: 9876,
    },
    optimizeDeps: {
        exclude: ["@zxing/library"],
    },
});
