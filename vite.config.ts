import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { yamlData } from './build-plugins/yaml-data.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), yamlData()],
})
