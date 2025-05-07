
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.c9fcadfffcc64ee28fdd9412b79b66b5',
  appName: 'pawara-attend-scan',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
    allowNavigation: ['*'],
    errorPath: 'error.html'
  },
  plugins: {
    CapacitorMlkitBarcodeScanning: {
      cameraPermissionRequestTitle: "Camera Permission", 
      cameraPermissionRequestText: "This app needs camera access to scan QR codes"
    }
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
