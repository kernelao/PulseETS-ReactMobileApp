import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from "react-native";
import { BarChart } from "react-native-chart-kit";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { theme } = useTheme();
  const { token } = useAuth();
  const [username, setUsername] = useState("User");
  const [mode, setMode] = useState("pomodoro");
  const [stats, setStats] = useState(null);

  const themeColors = {
    "mode_zen": { backgroundColor: "#9cccb5", textColor: "#0b0626" },
    "mode_nuit": { backgroundColor: "#0b0626", textColor: "#eaeaea" },
    "mode_jour": { backgroundColor: "#eef5f8", textColor: "#24332a" },
    "cyberpunk": { backgroundColor: "#0f0f2d", textColor: "#00ffff" },
    "steampunk": { backgroundColor: "#3e2f1c", textColor: "#ffd699" },
    "space": { backgroundColor: "#0c1c36", textColor: "#e0e6f7" },
    "neon_lights": { backgroundColor: "#1f0036", textColor: "#ff00ff" },
    "vintage": { backgroundColor: "#f4e2d8", textColor: "#4e342e" },
    "minimalist": { backgroundColor: "#ffffff", textColor: "#333" },
  };

  const currentThemeKey = theme.replace(/\s+/g, "_").toLowerCase();
  const currentColors = themeColors[currentThemeKey] || themeColors["mode_jour"];

  const screenWidth = Dimensions.get("window").width - 32;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://10.0.0.11:8000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setStats(res.data);
        setUsername(res.data.user?.username || "User");
      } catch (error) {
        console.error("Erreur Axios stats:", error);
      }
    };

    if (token) fetchStats();
  }, [token]);

  if (!stats) {
    return (
      <View style={[styles.container, { backgroundColor: currentColors.backgroundColor }]}>
        <Text style={{ color: currentColors.textColor }}>Chargement des données...</Text>
      </View>
    );
  }

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  const weekData = mode === "pomodoro" ? stats.pomodorosWeek : stats.tachesWeek;
  const today = mode === "pomodoro" ? stats.pomodorosToday : stats.tachesToday;
  const total = weekData.reduce((a, b) => a + b, 0);
  const average = (total / weekData.length).toFixed(1);

  return (
<ScrollView
  style={[styles.container, { backgroundColor: currentColors.backgroundColor }]}
  contentContainerStyle={styles.scrollContent}
>
      <Text style={[styles.greeting, { color: currentColors.textColor }]}>
        {greeting()}, {username} 👋
      </Text>

      <Text style={[styles.title, { color: currentColors.textColor }]}>
        Statistiques ({mode})
      </Text>

      <BarChart
        data={{
          labels: ["L", "M", "M", "J", "V", "S", "D"],
          datasets: [{ data: weekData }],
        }}
        width={screenWidth}
        height={220}
        chartConfig={{
          backgroundColor: currentColors.backgroundColor,
          backgroundGradientFrom: currentColors.backgroundColor,
          backgroundGradientTo: currentColors.backgroundColor,
          decimalPlaces: 0,
          color: () => currentColors.textColor,
          labelColor: () => currentColors.textColor,
        }}
        style={{ borderRadius: 12, marginVertical: 16 }}
      />

<View style={styles.summaryRow}>
  <View style={styles.summaryBox}>
    <Text style={[styles.summaryLabel, { color: currentColors.textColor }]}>Aujourd’hui</Text>
    <Text style={[styles.summaryValue, { color: currentColors.textColor }]}>{today}</Text>
  </View>
  <View style={styles.summaryBox}>
    <Text style={[styles.summaryLabel, { color: currentColors.textColor }]}>Total semaine</Text>
    <Text style={[styles.summaryValue, { color: currentColors.textColor }]}>{total}</Text>
  </View>
  <View style={styles.summaryBox}>
    <Text style={[styles.summaryLabel, { color: currentColors.textColor }]}>Moyenne/jour</Text>
    <Text style={[styles.summaryValue, { color: currentColors.textColor }]}>{average}</Text>
  </View>
</View>


      <TouchableOpacity onPress={() => setMode(mode === "pomodoro" ? "tasks" : "pomodoro")}>
        <Text style={[styles.toggleButton, { color: currentColors.textColor }]}>
           {mode === "pomodoro" ? "Tâches" : "Pomodoro"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  greeting: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 100, 
    marginBottom: 100,
    textAlign: "center",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8, 
    marginBottom: 16,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: "#ffffff40", 
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryLabel: {
    fontSize: 14,
    marginBottom: 4,
    textAlign: "center",
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  
  text: {
    fontSize: 16,
    marginBottom: 4,
  },
  toggleButton: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
    textDecorationLine: "underline",

    scrollContent: {
      paddingBottom: 32,
    },
    
  },
});
