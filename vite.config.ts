import { defineConfig } from 'vite'
import { resolve } from 'path'

console.log(
  '[BUILDME]',
  // fileURLToPath(new URL('./service-worker.ts', import.meta.url)),
  resolve(__dirname, 'service-worker.ts'),
)

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'mocks', 'service-worker.ts'),
      name: 'Service Worker',
      fileName: 'service-worker',
      formats: ['es'],
    },
    outDir: '.',
  },
})
