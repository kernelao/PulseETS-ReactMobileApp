import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "./context/AuthContext";

import { TouchableOpacity, Text } from "react-native";

import { Ionicons } from "@expo/vector-icons";

// Vues publiques
import Connexion from "./vues/Connexion";
import Inscription from "./vues/Inscription";

// Vues privées
import Dashboard from "./vues/Dashboard";
import Pomodoro from "./vues/Pomodoro";
import Profil from "./vues/Profil";
import Reglages from "./vues/Reglages";
import ChangePassword from './vues/ChangePassword';
import ChangeEmail from './vues/ChangeEmail';

const Stack = createNativeStackNavigator();
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
            case "Dashboard":
              iconName = "home";
              break;
            case "Pomodoro":
              iconName = "timer";
              break;
            case "Profil":
              iconName = "person";
              break;
            case "Réglages":
              iconName = "settings";
              break;
            case "Déconnexion":
              iconName = "log-out-outline";
              break;
            default:
              iconName = "ellipse";
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
      <Tab.Screen name="Profil" component={Profil} />
      <Tab.Screen name="Réglages" component={Reglages} />

      <Tab.Screen
        name="Déconnexion"
        component={() => null}
        options={{
          tabBarButton: () => (
            <TouchableOpacity
              onPress={logout}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
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
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Connexion" component={Connexion} />
            <Stack.Screen name="Inscription" component={Inscription} />
          </>
        ) : (
          <>
            <Stack.Screen name="AppTabs" component={AppTabs} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen name="ChangeEmail" component={ChangeEmail} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

