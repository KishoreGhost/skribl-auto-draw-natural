import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import { defineManifest } from '@crxjs/vite-plugin';

const manifest = defineManifest({
  manifest_version: 3,
  name: 'Skribbl AutoDraw - Natural Drawing',
  version: '1.0.0',
  description: 'Automatically draws on Skribbl.io using natural, human-like strokes powered by Google QuickDraw.',
  permissions: ['storage'],
  host_permissions: ['https://skribbl.io/*'],
  background: {
    service_worker: 'src/background/service-worker.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['https://skribbl.io/*'],
      js: ['src/content/content.ts'],
      run_at: 'document_idle',
    },
  ],
  action: {
    default_popup: 'src/popup/popup.html',
    default_icon: {
      '16': 'icons/icon16.png',
      '48': 'icons/icon48.png',
      '128': 'icons/icon128.png',
    },
  },
  web_accessible_resources: [
    {
      resources: ['injected/injected.js'],
      matches: ['https://skribbl.io/*'],
    },
  ],
  icons: {
    '16': 'icons/icon16.png',
    '48': 'icons/icon48.png',
    '128': 'icons/icon128.png',
  },
});

export default defineConfig({
  plugins: [crx({ manifest })],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: 'src/popup/popup.html',
        injected: 'src/injected/injected.ts',
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === 'injected') return 'injected/injected.js';
          if (chunk.name === 'content') return 'assets/content.js';
          return 'assets/[name].js';
        },
        chunkFileNames: 'assets/[name].js',
      },
    },
  },
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
