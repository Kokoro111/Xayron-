import { rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Cloudflare Pages rejects output files over 25 MiB. Video originals remain in
// the repository for GitHub-hosted playback, but are excluded from the Pages build.
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'exclude-local-videos-from-pages-output',
      closeBundle() {
        rmSync(resolve(process.cwd(), 'dist/videos'), { recursive: true, force: true })
      },
    },
  ],
})
