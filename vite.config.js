/* global process */

import {fileURLToPath, URL} from "node:url"

import {defineConfig} from "vite"
import legacy from "@vitejs/plugin-legacy"
import vue2 from "@vitejs/plugin-vue2"

// https://vitejs.dev/config/
export default defineConfig({
    base: "",
    plugins: [
        vue2(),
        legacy({
            targets: ["ie >= 11"],
            additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
        }),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    server: {
        proxy: {
            "/checkout/api": {
                target: process.env.API_SERVER,
                changeOrigin: true,
            },
        },
    },
})
