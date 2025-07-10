import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

const host = process.env.TAURI_DEV_HOST

export default defineConfig(async () => ({
	plugins: [
		react(),
		svgr()
	],

	resolve: {
		alias: [
			{ find: '@', replacement: '/src' }
		]
	},

	clearScreen: false,
	server: {
		port: 1420,
		strictPort: true,
		host: host || false,
		hmr: host
			? {
				protocol: 'ws',
				host,
				port: 1421,
			}
			: undefined,
		watch: {
			ignored: ['**/src-tauri/**'],
		},
	},
}))
