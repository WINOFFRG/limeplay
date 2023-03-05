import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [
		react({
			include: /\.tsx?$/,
		}),
		splitVendorChunkPlugin(),
	],
	resolve: {
		alias: {
			'shaka-player': 'shaka-player/dist/shaka-player.compiled.js',
		},
	},
	server: {
		host: '0.0.0.0',
	},
});
