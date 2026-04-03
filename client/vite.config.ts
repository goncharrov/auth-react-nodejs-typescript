import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
   plugins: [react()],
   server: {
      port: 5177,
      proxy: {
         '/api': {
            target: 'http://localhost:5007',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
         },
      },
   },
   preview: {
      port: 5177,
   },
   resolve: {
      alias: {
         '@assets': path.resolve(__dirname, './src/assets'),
         '@components': path.resolve(__dirname, './src/components'),
         '@data': path.resolve(__dirname, './src/data'),
         '@hooks': path.resolve(__dirname, './src/hooks'),
         '@http': path.resolve(__dirname, './src/http'),
         '@pages': path.resolve(__dirname, './src/pages'),
         '@type': path.resolve(__dirname, './src/types'),
         '@utils': path.resolve(__dirname, './src/utils'),
      },
   },
});
