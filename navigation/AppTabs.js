// AppTabs.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Context
import { useAuth } from "../context/AuthContext";

// Écrans
import Dashboard from "../vues/Dashboard";
import Pomodoro from "../vues/Pomodoro";
import ProfileStack from "../navigation/ProfileStack"; // ← change ici
import Reglages from "../vues/Reglages";

const Tab = createBottomTabNavigator();

const AppTabs = () => {
  const { logout } = useAuth();

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
            default: iconName = "ellipse";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#aaa",
        tabBarStyle: { backgroundColor: "#000" },
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Pomodoro" component={Pomodoro} />
      {/* Le stack interne pour le profil */}
      <Tab.Screen name="Profil" component={ProfileStack} />
      <Tab.Screen name="Réglages" component={Reglages} />
    </Tab.Navigator>
  );
};

export default AppTabs;
