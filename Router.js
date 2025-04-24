import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";

import { TouchableOpacity, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Vues publiques
import Connexion from "./vues/Connexion";
import Inscription from "./vues/Inscription";

// Vues privées
import Dashboard from "./vues/Dashboard";
import Pomodoro from "./vues/Pomodoro";
import Profil from "./vues/Profil";
import Reglages from "./vues/Reglages";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AppTabs = () => {
  const { logout } = useAuth();
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

  const DummyScreen = () => <View />;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case "Dashboard": iconName = "home"; break;
            case "Pomodoro": iconName = "timer"; break;
            case "Profil": iconName = "person"; break;
            case "Réglages": iconName = "settings"; break;
            case "Déconnexion": iconName = "log-out-outline"; break;
            default: iconName = "ellipse";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: currentColors.textColor,
        tabBarInactiveTintColor: "#aaa",
        tabBarStyle: {
          backgroundColor: currentColors.backgroundColor, // Fond identique à la page
          borderTopWidth: 0,    // ❌ Supprime la ligne grise
          elevation: 0,         // ❌ Supprime l'ombre Android
          shadowOpacity: 0,     // ❌ Supprime l'ombre iOS
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Pomodoro" component={Pomodoro} />
      <Tab.Screen name="Profil" component={Profil} />
      <Tab.Screen name="Réglages" component={Reglages} />
      <Tab.Screen
        name="Déconnexion"
        component={DummyScreen}
        options={{
          tabBarButton: () => (
            <TouchableOpacity
              onPress={logout}
              style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            >
              <Ionicons name="log-out-outline" size={24} color="red" />
              <Text style={{ color: "red", fontSize: 12 }}>Déco</Text>
            </TouchableOpacity>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default function Router() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <AppTabs />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Connexion" component={Connexion} />
          <Stack.Screen name="Inscription" component={Inscription} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
