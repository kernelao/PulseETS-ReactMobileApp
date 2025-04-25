import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { token } = useAuth();
  const [theme, setTheme] = useState("Mode zen");
  const [pomodoro, setPomodoro] = useState(25);
  const [pauseCourte, setPauseCourte] = useState(5);
  const [pauseLongue, setPauseLongue] = useState(15);

  const API_BASE_URL = "http://192.168.0.143:8000/api";

  useEffect(() => {
    const loadSettingsFromAPI = async () => {
      if (!token) return;

      try {
        const response = await axios.get(`${API_BASE_URL}/reglages/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data) {
          if (response.data.theme) setTheme(response.data.theme);
          if (response.data.pomodoro) setPomodoro(response.data.pomodoro);
          if (response.data.courte_pause) setPauseCourte(response.data.courte_pause);
          if (response.data.longue_pause) setPauseLongue(response.data.longue_pause);
        }
      } catch (error) {
        console.error("Erreur chargement réglages API :", error);
      }
    };

    loadSettingsFromAPI();
  }, [token]);

  const changeTheme = async (newTheme) => {
    setTheme(newTheme);

    if (!token) {
      console.warn("Token manquant, sauvegarde impossible.");
      return;
    }

    try {
      const getRes = await axios.get(`${API_BASE_URL}/reglages/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const reglageId = getRes.data.id;

      console.log("Données envoyées à l'API :", {
        theme: newTheme,
        pomodoro,
        courte_pause: pauseCourte,
        longue_pause: pauseLongue,
      });

      await axios.put(`${API_BASE_URL}/reglages/${reglageId}`, {
        theme: newTheme,
        pomodoro: pomodoro,
        courte_pause: pauseCourte,
        longue_pause: pauseLongue,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Réglages sauvegardés avec succès.");
    } catch (error) {
      console.error("Erreur sauvegarde réglages API :", error);
    }
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      pomodoro,
      pauseCourte,
      pauseLongue,
      changeTheme,
      setPomodoro,
      setPauseCourte,
      setPauseLongue
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme doit être utilisé dans ThemeProvider");
  }
  return context;
};


