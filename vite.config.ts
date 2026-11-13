import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig(({ command }) => {
  const isBuild = command === 'build'

  return {
    plugins: [
      vue(),
      isBuild &&
        dts({
          outDir: 'dist/types',
          entryRoot: 'src',
          tsconfigPath: './tsconfig.build.json',
          insertTypesEntry: true,
        }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 5180,
      open: true,
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      lib: {
        entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
        name: 'MomoUI',
        formats: ['es', 'umd'],
        fileName: (format) => (format === 'es' ? 'momo-ui.js' : 'momo-ui.umd.cjs'),
        cssFileName: 'momo-ui',
      },
      rollupOptions: {
        external: ['vue'],
        output: {
          exports: 'named',
          globals: { vue: 'Vue' },
        },
      },
      sourcemap: false,
      minify: 'esbuild',
    },
  }
})
