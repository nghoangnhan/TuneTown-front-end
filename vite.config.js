import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      "x-frame-options": "deny",
      "content-security-policy": JSON.stringify({
        "default-src": ["'self'"],
        "frame-ancestors": ["'self'"],
        "form-action": ["http://localhost:4173", "http://localhost:5173", "https://tunetown-ute.vercel.app", "https://tunetown.netlify.app"],
      }),
    },
    cors: {
      origin: ["http://localhost:8080", "http://localhost:3000"
        , "http://localhost:4173", "http://localhost:5173", "https://tunetown-ute.vercel.app", "https://tunetown.netlify.app"],
    },
  },
});
