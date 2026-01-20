
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import path from 'path';

  export default defineConfig({
    plugins: [react()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'build',
    },
    server: {
      host: '0.0.0.0', // Слушаем на всех интерфейсах (включая VPN)
      port: 3000,
      strictPort: false, // Позволяем использовать другой порт, если 3000 занят
      open: false, // Не открываем браузер автоматически
    },
  });