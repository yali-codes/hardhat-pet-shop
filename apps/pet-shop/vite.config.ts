import { resolve } from 'path';
import { defineConfig } from 'vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue({ reactivityTransform: true }),
    Components({
      resolvers: [NaiveUiResolver()],
    }),
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@utils': resolve(__dirname, './src/utils'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@assets': resolve(__dirname, './src/assets'),
      '@styles': resolve(__dirname, './src/styles'),
      '@stores': resolve(__dirname, './src/stores'),
      '@router': resolve(__dirname, './src/router'),
      '@components': resolve(__dirname, './src/components'),
      '@directives': resolve(__dirname, './src/directives'),
      '@contracts': resolve(__dirname, './src/contracts'),
      '@libs': resolve(__dirname, './src/libs'),
      '@interfaces': resolve(__dirname, './src/interfaces'),
    },
  },
  build: {
    sourcemap: true,
    emptyOutDir: true,
  },
});
