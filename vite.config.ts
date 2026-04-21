import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [svgr(), react(), tailwindcss(), dts({ include: ['src'], insertTypesEntry: true })],
  optimizeDeps: {
    include: ['jwt-decode']
  },
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'thecore-auth-ts',
      fileName: (format) => `thecore-auth-ts.${format === 'es' ? 'esm' : format}.js`,
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'axios', 'react-router-dom', 'react-icons', 'jwt-decode'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          axios: 'axios',
          'react-router-dom': 'ReactRouterDOM',
        }
      }
    },
  }
});
