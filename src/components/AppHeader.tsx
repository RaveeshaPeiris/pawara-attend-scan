
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";

const AppHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold">Pawara Attendance</h1>
        </div>
        {user && (
          <div className="flex items-center space-x-2">
            <div className="hidden md:flex items-center mr-2">
              <User size={20} className="mr-1" />
              <span>{user.name}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent border-primary-foreground hover:bg-primary-foreground hover:text-primary"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-1" />
              <span>Logout</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
