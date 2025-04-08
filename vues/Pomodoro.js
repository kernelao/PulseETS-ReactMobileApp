import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Pomodoro() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Mode Pomodoro en cours</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 20,
  },
});
