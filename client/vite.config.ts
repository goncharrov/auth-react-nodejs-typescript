import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
   plugins: [react()],
   server: {
      port: 5177,
   },
   preview: {
      port: 5177,
   },
   resolve: {
      alias: {
         '@account': path.resolve(__dirname, './src/account'),
         '@auth': path.resolve(__dirname, './src/auth'),
         '@data-management': path.resolve(__dirname, './src/data-management'),
         '@home': path.resolve(__dirname, './src/home'),
         '@shared': path.resolve(__dirname, './src/shared'),
      },
   },
});
