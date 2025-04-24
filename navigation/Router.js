import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import Connexion from "../vues/Connexion";
import Inscription from "../vues/Inscription";
import MainStack from "./MainStack";
import { navigationRef } from './RootNavigation';

const Stack = createNativeStackNavigator();

export default function Router() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Connexion" component={Connexion} />
            <Stack.Screen name="Inscription" component={Inscription} />
          </>
        ) : (
          <Stack.Screen name="MainStack" component={MainStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
