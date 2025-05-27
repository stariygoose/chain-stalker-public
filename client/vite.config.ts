import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
	server: {
		allowedHosts: ["awake-goblin-lasting.ngrok-free.app"]
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, './src')
		}
	}
})
