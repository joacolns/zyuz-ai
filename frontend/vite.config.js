import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  //Proxy del backend -
  server:{
    proxy:{
      '/api':{
        target: 'http://localhost:5169',
        changeOrigin: true,
      }
    }
  }
})
