
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.c9fcadfffcc64ee28fdd9412b79b66b5',
  appName: 'pawara-attend-scan',
  webDir: 'dist',
  server: {
    url: "https://c9fcadff-fcc6-4ee2-8fdd-9412b79b66b5.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    CapacitorMlkitBarcodeScanning: {
      cameraPermissionRequestTitle: "Camera Permission", 
      cameraPermissionRequestText: "This app needs camera access to scan QR codes"
    }
  }
};

export default config;
