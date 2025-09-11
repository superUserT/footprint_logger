import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useAppContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated);
    setUserName(user?.name || "");
  }, [isAuthenticated, user]);

  const checkAuthStatus = () => {
    const token = localStorage.getItem("authToken");
    const storedUserName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");

    if (token) {
      try {
        const tokenData = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (tokenData.exp > currentTime) {
          setIsAuthenticated(true);
          setUser({
            name: storedUserName,
            email: userEmail,
            id: tokenData.user.id,

            weeklyGoal: 50,
          });
        } else {
          logout();
        }
      } catch (error) {
        logout();
      }
    }
    setLoading(false);
  };

  const login = (token, userName, userEmail) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("userName", userName);
    localStorage.setItem("userEmail", userEmail);

    const tokenData = jwtDecode(token);

    setIsAuthenticated(true);
    setUser({
      name: userName,
      email: userEmail,
      id: tokenData.user.id,
      weeklyGoal: 50, // Default weekly goal, change this soon
    });
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading,

    isLoggedIn,
    setIsLoggedIn: setIsAuthenticated,
    userName,
    setUserName: (name) => {
      setUser((prev) => (prev ? { ...prev, name } : { name, weeklyGoal: 50 }));
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
