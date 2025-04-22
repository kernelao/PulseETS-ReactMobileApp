import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import api from '../api/api';

const ChangePassword = ({ navigation }) => {
  const [password, setPassword] = useState('');

  const handleChangePassword = async () => {
    try {
      await api.put('/user/password', { password });
      Alert.alert('Succès', 'Mot de passe modifié');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de modifier le mot de passe');
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nouveau mot de passe :</Text>
      <TextInput
        secureTextEntry
        style={styles.input}
        placeholder="••••••••"
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Valider</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Annuler</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontSize: 16, marginBottom: 8 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 10, marginBottom: 20,
  },
  button: {
    backgroundColor: '#2a75f3', padding: 12, borderRadius: 8, alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  cancelButton: { marginTop: 15, alignItems: 'center' },
  cancelText: { color: '#888' },
});

export default ChangePassword;
