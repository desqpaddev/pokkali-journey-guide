import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'in.pokkali.paadi',
  appName: 'PAADI',
  // For a fully packaged offline-capable app, point this at the built web assets
  // (run `bun run build` then set `webDir: 'dist'` and remove `server.url`).
  webDir: 'dist',
  server: {
    // Load the live published site inside the Android shell. This is the easiest
    // path: every update you publish from Lovable instantly reaches the app.
    // Replace with your custom domain once it is live.
    url: 'https://pokkali.in',
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;