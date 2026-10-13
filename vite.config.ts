import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import aclMarkdownSaverPlugin from './scripts/vite-markdown-api-plugin.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [aclMarkdownSaverPlugin(), react()],
})
