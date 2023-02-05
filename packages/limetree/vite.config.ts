import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), splitVendorChunkPlugin()],
    resolve: {
        alias: {
            'shaka-player': 'shaka-player/dist/shaka-player.compiled',
        },
    },
    //   optimizeDeps: {
    //     include: ['shaka-player'],
    //   },
    //   build: {
    //     commonjsOptions: {
    //       include: [/shaka-player/, /node_modules/],
    //     },
    //   },
});
