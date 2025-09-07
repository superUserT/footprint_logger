// AuthContext.js
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

// Keep the old hook for backward compatibility
export const useAppContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Keep for backward compatibility
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState(""); // Keep for backward compatibility
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Sync the old state with new state for backward compatibility
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
        // Decode and validate token
        const tokenData = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (tokenData.exp > currentTime) {
          setIsAuthenticated(true);
          setUser({
            name: storedUserName,
            email: userEmail,
            id: tokenData.user.id,
            // Add default weekly goal for existing functionality
            weeklyGoal: 50,
          });
        } else {
          // Token expired
          logout();
        }
      } catch (error) {
        // Invalid token
        logout();
      }
    }
    setLoading(false);
  };

  const login = (token, userName, userEmail) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("userName", userName);
    localStorage.setItem("userEmail", userEmail);

    // Decode token to get user ID
    const tokenData = jwtDecode(token);

    setIsAuthenticated(true);
    setUser({
      name: userName,
      email: userEmail,
      id: tokenData.user.id,
      weeklyGoal: 50, // Default weekly goal
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
    // New authentication methods
    isAuthenticated,
    user,
    login,
    logout,
    loading,

    // Keep old methods for backward compatibility
    isLoggedIn,
    setIsLoggedIn: setIsAuthenticated,
    userName,
    setUserName: (name) => {
      setUser((prev) => (prev ? { ...prev, name } : { name, weeklyGoal: 50 }));
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
