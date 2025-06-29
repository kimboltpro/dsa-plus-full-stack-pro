import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Ensure CORS headers are properly set for local development
    cors: true,
    // Force HTTP for local development to avoid mixed content issues
    https: false,
    // Add middleware to handle common development issues
    middlewareMode: false,
  },
  // Ensure proper base URL handling
  base: "/",
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Configure dependency optimization to handle TypeScript files
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.ts': 'ts',
        '.tsx': 'tsx',
      },
    },
  },
  // Add environment variable handling
  define: {
    // Ensure proper environment variable access
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
  // Improve build performance and error handling
  build: {
    sourcemap: mode === 'development',
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress certain warnings that don't affect functionality
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
        warn(warning);
      },
    },
  },
}));