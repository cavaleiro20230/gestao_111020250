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
        // --- ADIÇÃO DE OTIMIZAÇÃO DE CHUNKS ---
        build: {
            // Aumenta o limite de aviso de tamanho do chunk para 1000 kB (1 MB)
            // Isso irá suprimir o aviso para chunks entre 500kB e 1MB.
            chunkSizeWarningLimit: 1000, 
            rollupOptions: {
                output: {
                    // Separa todas as dependências de node_modules em um único 'vendor.js'
                    manualChunks(id) {
                        if (id.includes('node_modules')) {
                            return 'vendor';
                        }
                    },
                },
            },
        }
        // ------------------------------------------
    };
});