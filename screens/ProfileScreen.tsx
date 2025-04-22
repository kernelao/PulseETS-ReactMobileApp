// ProfileScreen.tsx corrigé avec avatars, récompenses et sécurité
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { fetchProfileData, updateAvatar, changeEmail, changePassword } from '@/lib/api/profile';
import { createProfileStyles } from './ProfileScreen.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation';
import { useTheme } from '@/context/ThemeContext';
import AVATAR, { avatarMap } from '@/assets/images_avatar';
import IMAGES from '@/assets/badges_recompenses';

export default function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { theme, changeTheme } = useTheme();
  const styles = createProfileStyles(theme);

  const [avatars, setAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState<string>('Jon Doe');
  const [rewards, setRewards] = useState([]);
  const [points, setPoints] = useState(0);
  const [form, setForm] = useState({ oldEmail: '', newEmail: '', oldPsw: '', newPsw: '' });
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchProfileData();
        setAvatars(data.unlockedAvatars || []);
        setSelectedAvatar(data.avatarPrincipal || 'Jon Doe');
        setPoints(data.pulsePoints || 0);
        setRewards(data.recompenses || []);
        changeTheme(data.theme);
      } catch (err: any) {
        Alert.alert('Erreur', err.message || 'Erreur de chargement.');
      }
    };
    loadProfile();
  }, []);

  const avatarKey = avatarMap[selectedAvatar as keyof typeof avatarMap] as keyof typeof AVATAR;
  const AvatarComponent = AVATAR[avatarKey] || AVATAR.defaultavatar;

  const allBadges = [
    'i1noteAdd', 'i1sessionComplete', 'i1tacheComplete',
    'i5notesAdd', 'i5sessionsComplete', 'i5tachesComplete',
    'i10sessionsComplete', 'i15notesAdd', 'i20tachesComplete',
    'i25sessionsComplete', 'i30notesAdd', 'i50sessionsComplete',
    'i50tachesComplete', 'i100notesAdd', 'i100sessionsComplete', 'i100tachesComplete'
  ];

  const badgeLabelMap: Record<string, string> = {
    i1noteAdd: '1 note ajoutée',
    i1sessionComplete: '1 session complétée',
    i1tacheComplete: '1 tâche complétée',
    i5notesAdd: '5 notes ajoutées',
    i5sessionsComplete: '5 sessions complétées',
    i5tachesComplete: '5 tâches complétées',
    i10sessionsComplete: '10 sessions complétées',
    i15notesAdd: '15 notes ajoutées',
    i20tachesComplete: '20 tâches complétées',
    i25sessionsComplete: '25 sessions complétées',
    i30notesAdd: '30 notes ajoutées',
    i50sessionsComplete: '50 sessions complétées',
    i50tachesComplete: '50 tâches complétées',
    i100notesAdd: '100 notes ajoutées',
    i100sessionsComplete: '100 sessions complétées',
    i100tachesComplete: '100 tâches complétées',
  };

  const unlockedSet = new Set(rewards.map((r: { type: string; valeur: number }) => `i${r.valeur}${r.type}`));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Profil</Text>

      <View style={styles.avatarSection}>
        <View style={styles.avatarImage}>
          <AvatarComponent width={100} height={100} />
        </View>
        <Text style={styles.pointsText}>Points PULSE : {points}</Text>
      </View>

      <Text style={styles.subtitle}>Sécurité :</Text>
      <TouchableOpacity onPress={() => setPasswordModalVisible(true)} style={styles.button}>
        <Text style={styles.buttonText}>Modifier le mot de passe</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setEmailModalVisible(true)} style={styles.button}>
        <Text style={styles.buttonText}>Modifier le courriel</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Avatars débloqués :</Text>
      <View style={styles.avatarList}>
        {avatars.map((name, index) => {
          const key = avatarMap[name as keyof typeof avatarMap] as keyof typeof AVATAR;
          const Comp = AVATAR[key] || AVATAR.defaultavatar;
          return (
            <TouchableOpacity key={index} onPress={() => updateAvatar(name)}>
              <Comp width={50} height={50} />
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.subtitle}>Récompenses :</Text>
      <View style={styles.recompenseGrid}>
        {allBadges.map((key) => {
          const Icon = IMAGES[key as keyof typeof IMAGES];
          const isUnlocked = unlockedSet.has(key);
          return (
            <TouchableOpacity key={key} onPress={() => setSelectedBadge(key)}>
              <Icon width={60} height={60} opacity={isUnlocked ? 1 : 0.2} />
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#FF4444' }]} onPress={async () => {
        await AsyncStorage.removeItem('token');
        Alert.alert("Déconnecté", "Tu as été déconnecté.");
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      }}>
        <Text style={styles.buttonText}>Se déconnecter</Text>
      </TouchableOpacity>

      <Modal visible={!!selectedBadge} animationType="fade" transparent>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setSelectedBadge(null)}>
          <View style={styles.popupBox}>
            <Text style={styles.modalTitle}>Récompense</Text>
            <Text style={styles.modalDesc}>{badgeLabelMap[selectedBadge || '']}</Text>
            <TouchableOpacity onPress={() => setSelectedBadge(null)} style={styles.button}>
              <Text style={styles.buttonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={passwordModalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Changer mot de passe</Text>
          <TextInput placeholder="Ancien mot de passe" secureTextEntry style={styles.input} onChangeText={(t) => setForm({ ...form, oldPsw: t })} />
          <TextInput placeholder="Nouveau mot de passe" secureTextEntry style={styles.input} onChangeText={(t) => setForm({ ...form, newPsw: t })} />
          <TouchableOpacity style={styles.button} onPress={async () => {
            try {
              await changePassword(form.oldPsw, form.newPsw);
              setPasswordModalVisible(false);
              Alert.alert("Succès", "Mot de passe modifié");
            } catch (e: any) {
              Alert.alert("Erreur", e.message);
            }
          }}><Text style={styles.buttonText}>Enregistrer</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#999' }]} onPress={() => setPasswordModalVisible(false)}>
            <Text style={styles.buttonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={emailModalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Changer courriel</Text>
          <TextInput placeholder="Ancien email" style={styles.input} onChangeText={(t) => setForm({ ...form, oldEmail: t })} />
          <TextInput placeholder="Nouvel email" style={styles.input} onChangeText={(t) => setForm({ ...form, newEmail: t })} />
          <TouchableOpacity style={styles.button} onPress={async () => {
            try {
              await changeEmail(form.oldEmail, form.newEmail);
              setEmailModalVisible(false);
              Alert.alert("Succès", "Courriel modifié");
            } catch (e: any) {
              Alert.alert("Erreur", e.message);
            }
          }}><Text style={styles.buttonText}>Enregistrer</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#999' }]} onPress={() => setEmailModalVisible(false)}>
            <Text style={styles.buttonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}
