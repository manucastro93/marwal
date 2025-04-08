import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    port: 5000,
  },
  build: {
    outDir: 'dist', // Esto es crucial
    emptyOutDir: true // Limpia el directorio en cada build
  },
});