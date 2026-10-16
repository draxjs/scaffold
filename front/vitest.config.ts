import {defineConfig} from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // Tests must not load application secrets or the remote-font Vite plugins.
  envDir: false,
  plugins: [vue()],
  test: {
    environment: 'node',
    server: {deps: {inline: [/@drax\//, /vuetify/]}},
    include: ['test/**/*.test.ts'],
    setupFiles: ['test/setup.ts'],
    clearMocks: true,
    restoreMocks: true,
    unstubGlobals: true,
    unstubEnvs: true,
    cache: false,
    testTimeout: 3000,
  },
})
