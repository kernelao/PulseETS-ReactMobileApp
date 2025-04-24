import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function Profil() {
  const { theme } = useTheme();

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

  return (
    <View style={[styles.container, { backgroundColor: currentColors.backgroundColor }]}>
      <Text style={[styles.text, { color: currentColors.textColor }]}>Profil</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
  },
});
