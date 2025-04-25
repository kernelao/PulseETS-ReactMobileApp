import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../api/api';
import { useTheme } from '../context/ThemeContext';
import { themes } from '../styles/themes';

const ChangeEmail = ({ navigation }) => {
  const [oldEmail, setOldEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const { theme } = useTheme();
  const handleChangeEmail = async () => {
    if (!oldEmail || !newEmail) {
      Alert.alert('Erreur', 'Veuillez remplir les deux champs');
      return;
    }

    try {
      await api.post('/user/change-email', {
        oldEmail,
        newEmail
      });
      Alert.alert('Succès', 'Courriel modifié');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erreur', 'Échec de modification. Vérifiez votre ancien courriel.');
      console.error(err);
    }
  };

    const resolvedTheme = theme;
    const normalizedThemeKey = resolvedTheme.toLowerCase().replace(/\s+/g, "-");
    const currentTheme = themes[normalizedThemeKey] || themes["mode-jour"];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
      <View style={styles.inner}>
        <Text style={[styles.label, { color: currentTheme.textColor }]}>Ancien courriel :</Text>
        <TextInput
          keyboardType="email-address"
          style={styles.input}
          placeholder="ancien@email.com"
          value={oldEmail}
          onChangeText={setOldEmail}
        />

        <Text style={[styles.label, { color: currentTheme.textColor }]}>Nouveau courriel :</Text>
        <TextInput
          keyboardType="email-address"
          style={styles.input}
          placeholder="nouveau@email.com"
          value={newEmail}
          onChangeText={setNewEmail}
        />

        <TouchableOpacity style={[styles.button, { backgroundColor: currentTheme.primary }]} onPress={handleChangeEmail}>
          <Text style={styles.buttonText}>Valider</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Annuler</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    padding: 20,
    paddingTop: 40, // ← ajuste ici pour abaisser un peu
  },
  label: {
    fontSize: 16,
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  cancelButton: {
    marginTop: 15,
    alignItems: 'center'
  },
  cancelText: {
    color: '#888'
  }
});

export default ChangeEmail;
