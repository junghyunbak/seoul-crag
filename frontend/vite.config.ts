import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import { visualizer } from 'rollup-plugin-visualizer';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    visualizer({ open: true }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon.ico', 'apple-touch-icon.png', 'masked-icon.png'],
      manifest: {
        name: '서울암장',
        short_name: '서울암장',
        start_url: '/',
        display: 'standalone',
        background_color: '#6D8C57',
        theme_color: '#6D8C57',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//, /^\/uploads\//],
      },
      devOptions: {
        enabled: true, // 개발 서버에서도 PWA 테스트 가능
      },
    }),
  ],
  resolve: {
    alias: [{ find: '@', replacement: '/src' }],
  },
  server: {
    allowedHosts: ['xn--2i4b60fr4ae1a.kr', 'dev.xn--2i4b60fr4ae1a.kr'], // 허용할 도메인 추가
    host: true, // 외부 접속 허용 (혹은 host: '0.0.0.0')
    port: 5173,
  },
});
