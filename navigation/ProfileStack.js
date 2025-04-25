import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profil from "../vues/Profil";
import ChangePassword from "../vues/ChangePassword";
import ChangeEmail from "../vues/ChangeEmail";

const Stack = createNativeStackNavigator();

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileMain" component={Profil} />
    <Stack.Screen name="ChangePassword" component={ChangePassword} />
    <Stack.Screen name="ChangeEmail" component={ChangeEmail} />
  </Stack.Navigator>
);

export default ProfileStack;
