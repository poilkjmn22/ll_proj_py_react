import React, { createContext, useContext, useState } from "react";

interface User {
  username: string | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User;
  login: (userInfo: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User>({ username: null });

  const login = (userInfo: User) => {
    setIsAuthenticated(true);
    setUser(userInfo);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser({ username: null });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
