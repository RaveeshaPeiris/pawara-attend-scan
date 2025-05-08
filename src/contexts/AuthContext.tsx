/*import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

// Define the user interface
interface User {
  id: string;
  email: string;
  name: string;
  role: "TEACHER" | "INSTITUTE";
}

// Define the context shape
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load user from local storage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse saved user", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  // Login function with admin + teacher logic
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      let url = "";
      let actualEmail = email;
      let actualPassword = password;

      // Handle hardcoded admin login
      if (email === "admin@gmail.com" && password === "admin") {
        actualEmail = "institute.pawara@gmail.com";
        actualPassword = "pawara12";
        url = "http://192.168.8.101:5001/api/institute/login";
      } else {
        // Default: assume teacher login
        url = "http://192.168.8.101:5001/api/teacher/login";
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: actualEmail, password: actualPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Login Failed",
          description: data.message || "Invalid credentials",
          variant: "destructive",
        });
        return false;
      }

      const userData: User = {
        id: data.user._id,
        email: actualEmail,
        name: data.user.name,
        role: actualEmail === "institute.pawara@gmail.com" ? "INSTITUTE" : "TEACHER",
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      toast({
        title: "Login Successful",
        description: `Welcome back, ${userData.name}!`,
      });
      


      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: "An error occurred during login",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};*/
import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

// Define the user interface
interface User {
  id: string;
  email: string;
  name: string;
  role: "TEACHER" | "INSTITUTE";
}

// Define the context shape
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load user and token from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse saved user", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      let url = "";
      let actualEmail = email;
      let actualPassword = password;

      // Handle hardcoded admin login
      if (email === "admin@gmail.com" && password === "admin") {
        actualEmail = "institute.pawara@gmail.com";
        actualPassword = "pawara12";
        url = "http://192.168.8.101:5001/api/institute/login";
      } else {
        url = "http://192.168.8.101:5001/api/teacher/login";
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: actualEmail, password: actualPassword }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast({
          title: "Login Failed",
          description: data.message || "Invalid credentials",
          variant: "destructive",
        });
        return false;
      }

      const token = data.token || response.headers.get("Authorization")?.replace("Bearer ", "");

      if (!token) {
        toast({
          title: "Login Failed",
          description: "Token not received from server",
          variant: "destructive",
        });
        return false;
      }

      const userData: User = {
        id: data.user._id,
        email: actualEmail,
        name: data.user.name,
        role: actualEmail === "institute.pawara@gmail.com" ? "INSTITUTE" : "TEACHER",
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token); // ✅ Save the token for secure API calls

      toast({
        title: "Login Successful",
        description: `Welcome back, ${userData.name}!`,
      });

      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: "An error occurred during login",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

