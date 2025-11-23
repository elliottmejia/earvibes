import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const _env = loadEnv(mode, process.cwd(), '');
  return {
    base: mode === 'production' ? '/earvibes/' : '/',
    plugins: [react({})],
  };
});
