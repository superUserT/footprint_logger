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

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("authToken"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const storedToken = localStorage.getItem("authToken");
    const storedUserName = localStorage.getItem("userName");
    const storedUserEmail = localStorage.getItem("userEmail");

    if (storedToken) {
      try {
        const tokenData = jwtDecode(storedToken);
        const currentTime = Date.now() / 1000;

        if (tokenData.exp > currentTime) {
          setIsAuthenticated(true);
          setToken(storedToken);
          setUser({
            name: storedUserName,
            email: storedUserEmail,
            id: tokenData.user?.id,
            weeklyGoal: 50,
          });
        } else {
          logout();
        }
      } catch (error) {
        console.error("Token validation error:", error);
        logout();
      }
    }
    setLoading(false);
  };

  const login = (authToken, userName, userEmail) => {
    localStorage.setItem("authToken", authToken);
    localStorage.setItem("userName", userName);
    localStorage.setItem("userEmail", userEmail);

    const tokenData = jwtDecode(authToken);

    setIsAuthenticated(true);
    setToken(authToken);
    setUser({
      name: userName,
      email: userEmail,
      id: tokenData.user?.id,
      weeklyGoal: 50,
    });
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
  };

  const value = {
    isAuthenticated,
    user,
    token,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
