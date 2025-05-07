import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import AppHeader from "@/components/AppHeader";
import { Check, ArrowLeft } from "lucide-react";
import {
  getClasses,
  getStudentsInClass,
  getAttendanceForClass,
  Class,
  Student,
  AttendanceRecord,
} from "@/services/attendanceService";

interface StudentAttendance {
  student: Student;
  weeks: {
    1: boolean;
    2: boolean;
    3: boolean;
    4: boolean;
  };
}

const AttendanceReportPage: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [attendanceData, setAttendanceData] = useState<StudentAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const data = await getClasses();
        setClasses(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load classes:", error);
        toast({
          title: "Error",
          description: "Failed to load classes",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    loadClasses();
  }, [toast]);

  useEffect(() => {
    if (!selectedClassId) return;

    const loadAttendanceData = async () => {
      setLoading(true);
      try {
        const students = await getStudentsInClass(selectedClassId);
        const attendanceRecords = await getAttendanceForClass(selectedClassId);
        
        const studentAttendance: StudentAttendance[] = students.map((student) => {
          const studentRecords = attendanceRecords.filter(
            (record) => record.studentId === student.id
          );
          
          return {
            student,
            weeks: {
              1: studentRecords.some((r) => r.week === 1 && r.present),
              2: studentRecords.some((r) => r.week === 2 && r.present),
              3: studentRecords.some((r) => r.week === 3 && r.present),
              4: studentRecords.some((r) => r.week === 4 && r.present),
            },
          };
        });
        
        setAttendanceData(studentAttendance);
      } catch (error) {
        console.error("Failed to load attendance data:", error);
        toast({
          title: "Error",
          description: "Failed to load attendance data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadAttendanceData();
  }, [selectedClassId, toast]);

  if (!user) {
    return null;
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
          <h2 className="text-2xl font-bold">Monthly Attendance Report</h2>
        </div>

        <div className="card-container mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Select Class</label>
            <Select
              value={selectedClassId}
              onValueChange={setSelectedClassId}
              disabled={loading || classes.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name} - {cls.grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading attendance data...</p>
            </div>
          </div>
        ) : (
          <>
            {selectedClassId && attendanceData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Reg Number</th>
                      <th className="px-4 py-3 text-center">Week 1</th>
                      <th className="px-4 py-3 text-center">Week 2</th>
                      <th className="px-4 py-3 text-center">Week 3</th>
                      <th className="px-4 py-3 text-center">Week 4</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData.map((item) => (
                      <tr key={item.student.id} className="border-b">
                        <td className="px-4 py-3">{item.student.name}</td>
                        <td className="px-4 py-3">{item.student.regNumber}</td>
                        <td className="px-4 py-3 text-center">
                          {item.weeks[1] ? (
                            <Check className="mx-auto h-4 w-4 text-success" />
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {item.weeks[2] ? (
                            <Check className="mx-auto h-4 w-4 text-success" />
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {item.weeks[3] ? (
                            <Check className="mx-auto h-4 w-4 text-success" />
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {item.weeks[4] ? (
                            <Check className="mx-auto h-4 w-4 text-success" />
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : selectedClassId ? (
              <div className="text-center py-12">
                <h3 className="mt-4 text-lg font-medium">No Attendance Data</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  There is no attendance data for this class yet.
                </p>
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="mt-4 text-lg font-medium">Select a Class</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Please select a class to view attendance reports.
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AttendanceReportPage;
