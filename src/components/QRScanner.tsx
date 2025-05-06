
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScanQrCode, Camera, X } from "lucide-react";
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

interface QRScannerProps {
  onCodeScanned: (code: string) => void;
  onCancel: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onCodeScanned, onCancel }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const { camera } = await BarcodeScanner.checkPermissions();
        setHasPermission(camera === 'granted');
      } catch (error) {
        console.error('Error checking camera permissions:', error);
        setError('Error checking camera permissions');
      }
    };

    checkPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      const { camera } = await BarcodeScanner.requestPermissions();
      setHasPermission(camera === 'granted');
    } catch (error) {
      console.error('Error requesting permissions:', error);
      setError('Error requesting camera permissions');
    }
  };

  const startScan = async () => {
    if (!hasPermission) {
      return;
    }

    setScanning(true);
    setError(null);

    try {
      const { barcodes } = await BarcodeScanner.scan();
      if (barcodes.length > 0) {
        onCodeScanned(barcodes[0].rawValue);
      }
    } catch (error: any) {
      // If user closed the scanner
      if (error.message !== 'User cancelled the scan process.') {
        console.error('Scan error:', error);
        setError('Failed to scan QR code');
      }
    } finally {
      setScanning(false);
    }
  };

  if (hasPermission === null) {
    return (
      <div className="p-4 text-center">
        <p className="mb-4">Camera permission is required to scan QR codes</p>
        <Button onClick={requestPermissions}>
          Grant Camera Permission
        </Button>
      </div>
    );
  }

  if (hasPermission === false) {
    return (
      <div className="p-4 text-center">
        <p className="text-destructive mb-2">Camera permission denied</p>
        <p className="mb-4">Please enable camera permissions in your device settings to scan QR codes</p>
        <Button onClick={requestPermissions} variant="outline" className="mr-2">
          Request Again
        </Button>
        <Button onClick={onCancel}>
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 text-center">
      {error && (
        <div className="bg-destructive/10 p-3 rounded-md mb-4 text-destructive">
          {error}
        </div>
      )}

      {!scanning ? (
        <div className="space-y-4">
          <div className="bg-primary/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <Camera className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">Ready to Scan</h3>
          <p className="text-muted-foreground mb-6">
            Tap the button below to scan a student QR code
          </p>
          <Button onClick={startScan}>
            <ScanQrCode className="mr-2 h-4 w-4" />
            Start Camera Scan
          </Button>
          <Button variant="ghost" onClick={onCancel} className="mt-2">
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="animate-pulse bg-primary/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <ScanQrCode className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">Scanning...</h3>
          <p className="text-muted-foreground mb-6">
            Position the QR code within the camera view
          </p>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
