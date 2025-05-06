
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import AppHeader from "@/components/AppHeader";
import { ScanQrCode, ArrowLeft, Check } from "lucide-react";
import {
  getClassById,
  getStudentByQR,
  markAttendance,
  Class,
  Student,
} from "@/services/mockData";

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
    simulateScan();
  };

  // Simulate QR code scanning for demo purposes
  const simulateScan = () => {
    // In a real app, this would activate the device camera and scan a QR code
    setTimeout(async () => {
      try {
        // Simulate scanning a random student QR code
        const qrCodes = ["REG001", "REG002", "REG003", "REG004", "REG005"];
        const randomQR = qrCodes[Math.floor(Math.random() * qrCodes.length)];
        
        const student = await getStudentByQR(randomQR);
        
        if (student && student.classId === classId) {
          setScannedStudent(student);
          setScanResult("success");
          
          // Mark attendance
          const today = new Date().toISOString().split("T")[0];
          const currentWeek = Math.ceil(new Date().getDate() / 7) as 1 | 2 | 3 | 4;
          
          await markAttendance(student.id, classId!, today, currentWeek);
          
          toast({
            title: "Attendance Marked",
            description: `${student.name} is now marked present`,
            variant: "default",
          });
        } else {
          setScanResult("error");
          toast({
            title: "Invalid QR Code",
            description: "Student not found in this class",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Scan error:", error);
        setScanResult("error");
        toast({
          title: "Scan Failed",
          description: "Failed to process QR code",
          variant: "destructive",
        });
      } finally {
        setIsScanning(false);
      }
    }, 2000);
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
          {scanResult === "success" && scannedStudent ? (
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
                Position the QR code within the camera frame to mark attendance
              </p>
              
              {isScanning ? (
                <div className="relative w-64 h-64 mx-auto border-2 border-primary rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-primary opacity-75"></div>
                    <div className="relative rounded-full h-2 w-2 bg-primary"></div>
                  </div>
                  <div className="animate-scan absolute h-1 w-full bg-primary/50"></div>
                </div>
              ) : (
                <Button onClick={handleStartScan} className="mx-auto">
                  <ScanQrCode className="mr-2 h-4 w-4" />
                  Start Scanning
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default QRScanPage;
