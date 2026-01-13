import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Entrance PiCo',
        short_name: 'PiCo',
        description: 'Web3 Social Mining App for Pi Network',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone', // Ovo miče browser trake (fullscreen na mobitelu)
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png', // Ovi fajlovi moraju biti u 'public' folderu
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
    },
  },
})