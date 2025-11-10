import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@src': resolve(__dirname, './src'),
            '@hooks': resolve(__dirname, './src/hooks'),
            '@utils': resolve(__dirname, './src/utils'),
            '@dom': resolve(__dirname, './src/components/dom'),
            '@game': resolve(__dirname, './src/components/game'),
            '@physics': resolve(__dirname, './src/components/physics')
        }
    },
    plugins: [
        react(),
        TanStackRouterVite(),
        VitePWA({
            devOptions: {
                enabled: false
            },
            // add this to cache all the imports
            workbox: {
                globPatterns: ['**/*']
            },
            // add this to cache all the
            // static assets in the public folder
            includeAssets: ['**/*'],
            manifest: {
                theme_color: '#f69435',
                background_color: '#f69435',
                display: 'standalone',
                scope: '/',
                start_url: '/',
                short_name: 'Vite PWA',
                description: 'Vite PWA Demo',
                name: 'Vite PWA'
            }
        })
    ],
    server: {
        host: '0.0.0.0',
        port: 7232
    },
    preview: {
        host: '0.0.0.0',
        port: 7232
    }
});
