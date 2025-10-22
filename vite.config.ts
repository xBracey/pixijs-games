import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import { readFileSync } from "fs";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite(),
    {
      name: 'serve-src-assets',
      configureServer(server) {
        server.middlewares.use('/assets', (req, res, next) => {
          const url = req.url!;
          const filePath = resolve(__dirname, 'src/assets', url.slice(1));
          
          try {
            const data = readFileSync(filePath);
            const ext = filePath.split('.').pop()?.toLowerCase();
            
            const mimeTypes: Record<string, string> = {
              'png': 'image/png',
              'jpg': 'image/jpeg',
              'jpeg': 'image/jpeg',
              'gif': 'image/gif',
              'svg': 'image/svg+xml',
              'webp': 'image/webp'
            };
            
            res.setHeader('Content-Type', mimeTypes[ext!] || 'application/octet-stream');
            res.end(data);
          } catch (err) {
            next();
          }
        });
      }
    },
    VitePWA({
      devOptions: {
        enabled: false,
      },
      // add this to cache all the imports
      workbox: {
        globPatterns: ["**/*"],
      },
      // add this to cache all the
      // static assets in the public folder
      includeAssets: ["**/*"],
      manifest: {
        theme_color: "#f69435",
        background_color: "#f69435",
        display: "standalone",
        scope: "/",
        start_url: "/",
        short_name: "Vite PWA",
        description: "Vite PWA Demo",
        name: "Vite PWA",
      },
    }),
  ],
  server: {
    host: "0.0.0.0",
    port: 7232,
  },
  preview: {
    host: "0.0.0.0",
    port: 7232,
  },
});
