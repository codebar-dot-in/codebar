import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                'web-development': resolve(__dirname, 'web-development/index.html'),
                'mobile-apps': resolve(__dirname, 'mobile-apps/index.html'),
                'digital-marketing': resolve(__dirname, 'digital-marketing/index.html'),
                'seo-engineering': resolve(__dirname, 'seo-engineering/index.html'),
                enquiry: resolve(__dirname, 'enquiry/index.html'),
                404: resolve(__dirname, '404.html'),
            },
        },
    },
});
