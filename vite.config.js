import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/Plant-Papi/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'icons/*.png'],
      manifest: {
        name: 'PlantPal',
        short_name: 'PlantPal',
        description: 'Personal plant care companion',
        theme_color: '#1a2e1e',
        background_color: '#0f1f14',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/Plant-Papi/',
        start_url: '/Plant-Papi/',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.pl@ntnet\.org\/.*/i,
            handler: 'NetworkFirst',
            options: { cacheName: 'plantnet-api' },
          },
          {
            urlPattern: /^https:\/\/api\.plant\.id\/.*/i,
            handler: 'NetworkFirst',
            options: { cacheName: 'plantid-api' },
          },
          {
            urlPattern: /^https:\/\/perenual\.com\/api\/.*/i,
            handler: 'NetworkFirst',
            options: { cacheName: 'perenual-api' },
          },
        ],
      },
    }),
  ],
})
