import React, { useRef } from 'react';
import {ScrollView, View, StyleSheet, Button, FlatList } from 'react-native';
import CircleTimer from './CircleTimer'; // Assure-toi que ce chemin est correct
import QuickPanneau from './Quickpanneau'; // Assure-toi que ce chemin est correct

export default function PomodoroQuickTasksScreen() {
  const scrollRef = useRef();

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollToEnd({ animated: true });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.listContent} ref={scrollRef}>
      <View style={styles.container}>
        <CircleTimer />
        <QuickPanneau />
        <View style={styles.scrollButtonContainer}>
          <Button title="Voir les tâches" onPress={scrollToBottom} color="#10217f" />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    paddingVertical: 20,
  },
  scrollButtonContainer: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
});