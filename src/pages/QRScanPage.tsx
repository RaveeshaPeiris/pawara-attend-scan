import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import AppHeader from "@/components/AppHeader";
import { ScanQrCode, ArrowLeft, Check } from "lucide-react";
//import { Html5QrcodeScanner } from "html5-qrcode";
import QRScanner from "@/components/QRScanner";
import {
  getClassById,
  getStudentByQR,
  markAttendance,
  Class,
  Student,
} from "@/services/attendanceService";

const QRScanPage: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const [classData, setClassData] = useState<Class | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedStudent, setScannedStudent] = useState<Student | null>(null);
  const [scanResult, setScanResult] = useState<"success" | "error" | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!classId) return;

    const loadClassData = async () => {
      try {
        const data = await getClassById(classId);
        if (data) {
          setClassData(data);
        } else {
          toast({
            title: "Error",
            description: "Class not found",
            variant: "destructive",
          });
          navigate("/classes");
        }
      } catch (error) {
        console.error("Failed to load class data:", error);
        toast({
          title: "Error",
          description: "Failed to load class data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadClassData();
  }, [classId, toast, navigate]);

  const handleStartScan = () => {
    setIsScanning(true);
  };
  
  const handleCancelScan = () => {
    setIsScanning(false);
  };

  const handleQRScanned = async (qrCode: string) => {
  console.log("📦 Scanned QR code:", qrCode);

  try {
    const student = await getStudentByQR(qrCode);
    console.log("✅ Student fetched from DB:", student);

    if (student && student.classIds?.includes(classId)) {
      // Success
      console.log("🎯 Student belongs to this class");

      const today = new Date().toISOString().split("T")[0];
      const currentWeek = Math.ceil(new Date().getDate() / 7) as 1 | 2 | 3 | 4;

      await markAttendance(student.id, classId!, today, currentWeek,true);
      setScannedStudent(student);
      setScanResult("success");

      toast({
        title: "Attendance Marked",
        description: `${student.name} marked present`,
        variant: "default",
      });
    } else {
      console.warn(" Student not found in this class");
      setScanResult("error");
      toast({
        title: "Invalid QR Code",
        description: "Student not found in this class",
        variant: "destructive",
      });
    }
  } catch (error) {
    console.error("💥 Error processing QR code:", error);
    setScanResult("error");
    toast({
      title: "Scan Failed",
      description: "Failed to process QR code",
      variant: "destructive",
    });
  } finally {
    setIsScanning(false);
  }
};


  const resetScan = () => {
    setScannedStudent(null);
    setScanResult(null);
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <AppHeader />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto p-4 md:p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate("/classes")} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h2 className="text-2xl font-bold">{classData?.name} Attendance</h2>
        </div>
        
        <div className="card-container max-w-md mx-auto text-center">
          {isScanning ? (
            <QRScanner 
              onCodeScanned={handleQRScanned}
              onCancel={handleCancelScan}
            />
          ) : scanResult === "success" && scannedStudent ? (
            <div className="py-6">
              <div className="bg-success/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Check className="h-10 w-10 text-success" />
              </div>
              <h3 className="text-xl font-bold mb-2">Attendance Marked</h3>
              <p className="mb-1">Name: {scannedStudent.name}</p>
              <p className="mb-4">Reg No: {scannedStudent.regNumber}</p>
              <Button onClick={resetScan} className="mt-4">
                Scan Another
              </Button>
            </div>
          ) : scanResult === "error" ? (
            <div className="py-6">
              <div className="bg-destructive/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <ScanQrCode className="h-10 w-10 text-destructive" />
              </div>
              <h3 className="text-xl font-bold mb-2">Invalid QR Code</h3>
              <p className="mb-4">The scanned QR code is not valid for this class</p>
              <Button onClick={resetScan} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : (
            <div className="py-6">
              <div className="bg-primary/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <ScanQrCode className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Scan Student QR Code</h3>
              <p className="text-muted-foreground mb-6">
                Tap the button below to start scanning a student QR code
              </p>
              
              <Button onClick={handleStartScan} className="mx-auto">
                <ScanQrCode className="mr-2 h-4 w-4" />
                Start Scanning
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default QRScanPage;
