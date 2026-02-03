/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
    plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      devOptions: {
        enabled: true, // permite testar SW no npm run dev
        type: 'module'
      },

      workbox: {
        navigateFallback: "/index.html",

        runtimeCaching: [
          {
            // Cache para API (ex: visitas)
            urlPattern: ({ url }) =>
              url.origin === "https://criancafeliz-pw1-production.up.railway.app/",
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 1 dia
              },
            },
          },
          {
            // Cache de páginas (SPA)
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "CacheFirst",
            options: {
              cacheName: "pages-cache",
            },
          },
          {
            // Cache de imagens
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24,
              },
            },
          },
        ],
      },
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./setupTests.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    css: false
  }
});
