// /screens/ProfileScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { useAuth } from '@/hooks/useAuth';  // ton hook d'auth
import { supabase } from '@/lib/supabase';  // si tu utilises Supabase
import { useTheme } from '@/context/ThemeContext'; // si tu as un ThemeContext
import { fetchProfileData, updateAvatar, changeEmail, changePassword } from '@/lib/api'; // créer ces fonctions
import styles from './ProfileScreen.styles'; // style séparé pour lisibilité

export default function Profile() {
  const { session } = useAuth();
  const { theme } = useTheme(); // si tu veux appliquer des couleurs dynamiques
  const [profile, setProfile] = useState<any>(null);
  const [avatars, setAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [points, setPoints] = useState(0);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [form, setForm] = useState({ oldEmail: '', newEmail: '', oldPsw: '', newPsw: '' });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchProfileData(); // à implémenter
        setProfile(data);
        setAvatars(data.unlockedAvatars || []);
        setSelectedAvatar(data.avatarPrincipal);
        setPoints(data.pulsePoints || 0);
        setRewards(data.recompenses || []);
      } catch (err) {
        Alert.alert("Erreur", err.message || "Échec du chargement du profil.");
      }
    };
    loadProfile();
  }, []);

  const handleChangeAvatar = async (avatarName: string) => {
    try {
      await updateAvatar(avatarName);
      setSelectedAvatar(avatarName);
      Alert.alert("Succès", "Avatar mis à jour !");
    } catch (err) {
      Alert.alert("Erreur", err.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Profil</Text>

      <View style={styles.avatarSection}>
        <Image source={{ uri: selectedAvatar?.url }} style={styles.avatarImage} />
        <Text style={styles.pointsText}>Points PULSE : {points}</Text>
      </View>

      <TouchableOpacity onPress={() => setPasswordModalVisible(true)} style={styles.button}>
        <Text>Modifier le mot de passe</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setEmailModalVisible(true)} style={styles.button}>
        <Text>Modifier le courriel</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Récompenses :</Text>
      {rewards.map((r, i) => (
        <Text key={i} style={styles.rewardItem}>{r}</Text>
      ))}

      <Modal visible={passwordModalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <TextInput placeholder="Ancien mot de passe" secureTextEntry onChangeText={(t) => setForm({ ...form, oldPsw: t })} />
          <TextInput placeholder="Nouveau mot de passe" secureTextEntry onChangeText={(t) => setForm({ ...form, newPsw: t })} />
          <TouchableOpacity onPress={async () => {
            try {
              await changePassword(form.oldPsw, form.newPsw);
              Alert.alert("Succès", "Mot de passe changé");
              setPasswordModalVisible(false);
            } catch (e) {
              Alert.alert("Erreur", e.message);
            }
          }}>
            <Text>Enregistrer</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={emailModalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <TextInput placeholder="Ancien email" onChangeText={(t) => setForm({ ...form, oldEmail: t })} />
          <TextInput placeholder="Nouvel email" onChangeText={(t) => setForm({ ...form, newEmail: t })} />
          <TouchableOpacity onPress={async () => {
            try {
              await changeEmail(form.oldEmail, form.newEmail);
              Alert.alert("Succès", "Courriel changé");
              setEmailModalVisible(false);
            } catch (e) {
              Alert.alert("Erreur", e.message);
            }
          }}>
            <Text>Enregistrer</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}
