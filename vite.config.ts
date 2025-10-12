import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
        server: {
            port: 3000,
            host: '0.0.0.0',
        },
        plugins: [react()],
        define: {
            'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
            'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, '.'),
            }
        },
        // --- INÍCIO DAS MUDANÇAS DE OTIMIZAÇÃO ---
        build: {
            // 1. Aumenta o limite de aviso para 1000 kB (1 MB)
            chunkSizeWarningLimit: 1000, 
            rollupOptions: {
                output: {
                    // 2. Separa bibliotecas de terceiros em um chunk 'vendor'
                    manualChunks(id) {
                        // Se o módulo vem de 'node_modules', ele é agrupado como 'vendor'
                        if (id.includes('node_modules')) {
                            return 'vendor';
                        }
                    },
                },
            },
        }
        // --- FIM DAS MUDANÇAS DE OTIMIZAÇÃO ---
    };
});