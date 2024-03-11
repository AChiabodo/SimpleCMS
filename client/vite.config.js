import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import http from "https";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build : {
    outDir : '../server/dist'
  }
})