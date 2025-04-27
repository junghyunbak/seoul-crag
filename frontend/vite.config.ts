import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr(), visualizer({ open: true })],
  resolve: {
    alias: [{ find: '@', replacement: '/src' }],
  },
  server: {
    allowedHosts: ['xn--2i4b60fr4ae1a.kr'], // 허용할 도메인 추가
    host: true, // 외부 접속 허용 (혹은 host: '0.0.0.0')
    port: 5173,
  },
});
