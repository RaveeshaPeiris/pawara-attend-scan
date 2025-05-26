import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScanQrCode, Camera, X } from "lucide-react";
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Alert, AlertDescription } from "@/components/ui/alert";

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
        const isAvailable = await BarcodeScanner.isSupported();
        
        if (!isAvailable) {
          setError("Barcode scanner is not supported on this device");
          return;
        }
        
        const { camera } = await BarcodeScanner.checkPermissions();
        setHasPermission(camera === 'granted');
        console.log("Camera permission status:", camera);
      } catch (error) {
        console.error("Error checking permissions:", error);
        setError("Error checking camera permissions");
      }
    };

    checkPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      const { camera } = await BarcodeScanner.requestPermissions();
      setHasPermission(camera === 'granted');
      console.log("Camera permission after request:", camera);
    } catch (error) {
      console.error("Error requesting permissions:", error);
      setError("Camera permission denied");
    }
  };

  const startScan = async () => {
    if (hasPermission !== true) {
      await requestPermissions();
      return;
    }

    setScanning(true);
    setError(null);

    try {
      console.log("Checking for Google Barcode Scanner module...");
      
      
      if (!(await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable())) {
        console.log("Installing Google Barcode Scanner module...");
        await BarcodeScanner.installGoogleBarcodeScannerModule();
      }

      console.log("Starting barcode scan...");
      const result = await BarcodeScanner.scan();
      console.log("Scan result:", result);
      
      if (result && result.barcodes && result.barcodes.length > 0) {
        onCodeScanned(result.barcodes[0].rawValue);
      } else {
        setError("No QR code detected");
      }
    } catch (error: any) {
      console.error("Scan error:", error);
      setError("Failed to scan QR code: " + (error.message || "Unknown error"));
    } finally {
      setScanning(false);
    }
  };


  if (hasPermission === null) {
    return (
      <div className="p-4 text-center">
        <p className="mb-4">Camera permission is required to scan QR codes</p>
        <Button onClick={requestPermissions}>Grant Camera Permission</Button>
        <Button variant="ghost" onClick={onCancel} className="mt-2">
          <X className="mr-2 h-4 w-4" /> Cancel
        </Button>
      </div>
    );
  }

  if (hasPermission === false) {
    return (
      <div className="p-4 text-center">
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            Camera permission denied. Please enable camera access in your device settings to scan QR codes.
          </AlertDescription>
        </Alert>
        <Button onClick={requestPermissions} variant="outline" className="mr-2 mb-2">
          Request Permission Again
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
      </div>
    );
  }

  return (
    <div className="p-4 text-center">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
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