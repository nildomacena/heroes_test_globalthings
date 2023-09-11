import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.globalthings.heroes_app',
  appName: 'Heroes App',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
