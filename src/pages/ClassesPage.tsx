import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import AppHeader from "@/components/AppHeader";
import ClassCard from "@/components/ClassCard";
import { Calendar, List } from "lucide-react";
import { getClasses, Class } from "@/services/attendanceService";

const ClassesPage: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const data = await getClasses();
        setClasses(data);
      } catch (error) {
        console.error("Failed to load classes:", error);
        toast({
          title: "Error",
          description: "Failed to load classes",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadClasses();
  }, [toast]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Classes</h2>
          <Button variant="outline" onClick={() => navigate("/attendance-reports")}>
            <Calendar className="mr-2 h-4 w-4" />
            Attendance Reports
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading classes...</p>
            </div>
          </div>
        ) : (
          <>
            {classes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classes.map((cls) => (
                  <ClassCard
                    key={cls.id}
                    id={cls.id}
                    name={cls.name}
                    grade={cls.grade}
                    studentCount={cls.studentCount}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <List className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No Classes Found</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  There are no classes available at the moment.
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ClassesPage;
