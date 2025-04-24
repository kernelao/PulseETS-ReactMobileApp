import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifie s'il y a un token au démarrage (asyncStorage pour quon stock info user)
  useEffect(() => {
    const checkToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        try {
          const decoded = jwtDecode(storedToken);
          const isExpired = decoded.exp * 1000 < Date.now();

          if (!isExpired) {
            setToken(storedToken);
            setIsAuthenticated(true);
          } else {
            await AsyncStorage.removeItem("token");
          }
        } catch (error) {
          console.error("Token invalide :", error);
          await AsyncStorage.removeItem("token");
        }
      }
    };

    checkToken();
  }, []);

  const login = async (newToken) => {
    await AsyncStorage.setItem("token", newToken);
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
