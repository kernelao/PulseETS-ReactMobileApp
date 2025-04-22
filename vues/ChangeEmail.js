import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import api from '../api/api';

const ChangeEmail = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleChangeEmail = async () => {
    try {
      await api.put('/user/email', { email });
      Alert.alert('Succès', 'Courriel modifié');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de modifier le courriel');
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nouveau courriel :</Text>
      <TextInput
        keyboardType="email-address"
        style={styles.input}
        placeholder="exemple@email.com"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity style={styles.button} onPress={handleChangeEmail}>
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

export default ChangeEmail;
