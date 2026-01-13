import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
5  |   |  
6  |  /* NOVI v4 način */
7  |  @import "tailwindcss";
   |  ^^^^^^^^^^^^^^^^^^^^^^  
export default defineConfig({
  plugins: [react()],
})