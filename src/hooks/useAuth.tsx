import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'doctor' | 'admin';
  isDoctor?: boolean;
  doctorInfo?: {
    specialization: string;
    licenseNumber: string;
    yearsOfExperience: number;
    hospital?: string;
  };
}

// For backward compatibility with DashboardPage
interface Doctor {
  id: number;
  name: string;
  email: string;
  specialization: string;
  licenseNumber: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User | any, token?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isDoctor: boolean;
  isAdmin: boolean;
  updateUser: (user: User) => void;
  currentDoctor: Doctor | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    const savedDoctor = localStorage.getItem("currentDoctor");
    
    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Normalize user ID
        if (parsedUser.id && !parsedUser._id) {
          parsedUser._id = parsedUser.id;
        }
        setUser(parsedUser);
        setToken(savedToken);
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }

    if (savedDoctor) {
      try {
        setCurrentDoctor(JSON.parse(savedDoctor));
      } catch (error) {
        localStorage.removeItem("currentDoctor");
      }
    }

    setLoading(false);
  }, []);

  const login = (userData: User | Doctor, authToken?: string) => {
    if ('id' in userData && typeof userData.id === 'number') {
      // Doctor login from DashboardPage
      setCurrentDoctor(userData as Doctor);
      localStorage.setItem("currentDoctor", JSON.stringify(userData));
    } else {
      // Regular User login - normalize ID
      const normalizedUser = { ...userData } as User;
      if ((userData as any).id && !normalizedUser._id) {
        normalizedUser._id = (userData as any).id;
      }
      setUser(normalizedUser);
      if (authToken) {
        setToken(authToken);
        localStorage.setItem("token", authToken);
      }
      localStorage.setItem("user", JSON.stringify(normalizedUser));
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setCurrentDoctor(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("currentDoctor");
  };

  const updateUser = (userData: User) => {
    const normalizedUser = { ...userData };
    if ((userData as any).id && !normalizedUser._id) {
      normalizedUser._id = (userData as any).id;
    }
    setUser(normalizedUser);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user && !!token,
    isDoctor: user?.role === 'doctor' || user?.isDoctor === true,
    isAdmin: user?.role === 'admin',
    updateUser,
    currentDoctor,
  };

  if (loading) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
