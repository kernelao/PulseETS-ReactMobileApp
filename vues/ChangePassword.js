import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../api/api';
import { useTheme } from '../context/ThemeContext';
import { themes } from '../styles/themes';

const ChangePassword = ({ navigation }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { theme } = useTheme();

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      Alert.alert('Erreur', 'Veuillez remplir les deux champs');
      return;
    }

    try {
      await api.post('/user/change-password', {
        oldPsw: oldPassword,
        newPsw: newPassword,
      });
      Alert.alert('Succès', 'Mot de passe modifié');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erreur', 'Échec de modification. Vérifiez votre ancien mot de passe.');
      console.error(err);
    }
  };

  const resolvedTheme = theme;
  const normalizedThemeKey = resolvedTheme.toLowerCase().replace(/\s+/g, "-");
  const currentTheme = themes[normalizedThemeKey] || themes["mode-jour"];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
      <View style={styles.inner}>
        <Text style={[styles.label, { color: currentTheme.textColor }]}>Ancien mot de passe :</Text>
        <TextInput
          secureTextEntry
          style={styles.input}
          placeholder="••••••••"
          value={oldPassword}
          onChangeText={setOldPassword}
        />

        <Text style={[styles.label, { color: currentTheme.textColor }]}>Nouveau mot de passe :</Text>
        <TextInput
          secureTextEntry
          style={styles.input}
          placeholder="••••••••"
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <TouchableOpacity style={[styles.button, { backgroundColor: currentTheme.primary }]} onPress={handleChangePassword}>
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
    paddingTop: 40, // ↓ pour espacer du haut de l'écran
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

export default ChangePassword;
