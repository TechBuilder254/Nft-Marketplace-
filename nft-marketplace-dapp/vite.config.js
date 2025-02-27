import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from the correct location
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env // Ensure process.env variables are accessible
  }
})
