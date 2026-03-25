import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      allowedHosts: [
        "enterological-interlineally-jolene.ngrok-free.dev",
        "ProjectDsplay.pythonanywhere.com"
      ]
    },
    plugins: [react()],
    base: '/',
    build: {
      // 2. Point this to your Django "static" folder
      // Adjust the path to match your actual directory structure
      outDir: path.resolve(__dirname, './backend/staticfiles'),

      // 3. Clear the folder before building new files
      emptyOutDir: true,

      rollupOptions: {
        output: {
          // 4. Organize files within the static/dist folder
          entryFileNames: `assets/[name]-[hash].js`,
          chunkFileNames: `assets/[name]-[hash].js`,
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            const extType = info[info.length - 1];
            if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(assetInfo.name)) {
              return `images/[name]-[hash][extname]`;
            }
            if (/\.css$/.test(assetInfo.name)) {
              return `css/[name]-[hash][extname]`;
            }
            return `[name]-[hash][extname]`;
          },
        },
      },
    },
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      "process.env.VITE_API_URL": JSON.stringify(env.VITE_API_URL),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };

});
