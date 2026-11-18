import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { buildSettings } from './build-plugins/settings.ts'
import { pageMeta } from './build-plugins/page-meta.ts'
import { yamlData } from './build-plugins/yaml-data.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), buildSettings(), yamlData(), pageMeta()],
  define: {
    BUILD_TIMESTAMP: JSON.stringify(new Date().toISOString()),
  },
})
