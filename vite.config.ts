import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'resources/index.ts'),
            name: 'Wired',
            formats: ['es'],
            fileName: () => 'index.js',
        },
        sourcemap: true,
    },
})
