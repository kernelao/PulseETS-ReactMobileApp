import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import VuePomTache from './components/TimerPom/VuePomTache'

export default function App() {
  return (
    <View style={styles.container}>
      <VuePomTache/>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingBottom: 40,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

