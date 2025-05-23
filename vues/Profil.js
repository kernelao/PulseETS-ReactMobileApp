import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import api from '../api/api';
import avatarMap from '../assets/images_avatar';
import { badgeMap, badgeDescriptions } from '../assets/badges_recompenses';
import { useAuth } from '../context/AuthContext';
import { themes } from '../styles/themes';
import { useTheme } from '../context/ThemeContext';

const Profile = () => {
  const navigation = useNavigation();
  const { logout } = useAuth();
  const { theme, applyTheme } = useTheme();

  const [userData, setUserData] = useState(null);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/user/profile');
        if (response.data) {
          setUserData(response.data);
          if (response.data.theme) {
            const normalized = response.data.theme.toLowerCase().replace(/\s+/g, "-");
            applyTheme(normalized);
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du profil :", error);
      }
    };
    fetchProfile();
  }, []);

  const normalizeType = (type) => {
    switch (type) {
      case 'notesAjoutees': return 'notesAdd';
      case 'sessionsCompletees': return 'sessionsComplete';
      case 'tachesCompletees': return 'tachesComplete';
      default: return type;
    }
  };

  if (!userData) {
    return <Text>Chargement...</Text>;
  }

const resolvedTheme = userData.theme || theme;
const normalizedThemeKey = resolvedTheme.toLowerCase().replace(/\s+/g, "-");
const currentTheme = themes[normalizedThemeKey] || themes["mode-jour"];


  const { avatarPrincipal, pulsePoints, unlockedAvatars = [], recompenses = [] } = userData;
  const recompensesConverties = recompenses.map((r) => `i${r.valeur}${normalizeType(r.type)}`);

  let mainAvatar = avatarMap['Jon Doe']; // fallback par défaut
  if (avatarPrincipal && typeof avatarPrincipal === 'string' && avatarMap[avatarPrincipal]) {
    mainAvatar = avatarMap[avatarPrincipal];
  }
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: currentTheme.backgroundColor }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.avatarWrapper}>
          <Image source={mainAvatar} style={{ width: 120, height: 120, borderRadius: 60 }} />
        </View>

        <Text style={[styles.pointsText, { color: currentTheme.textColor }]}>
          Points Pulse : {pulsePoints}
        </Text>

        <Text style={[styles.sectionTitle, { color: currentTheme.textColor }]}>Avatars débloqués</Text>
        <ScrollView horizontal>
          {unlockedAvatars.map((name, index) => {
            const img = avatarMap[name] || avatarMap['Jon Doe'];
            return (
              <View key={index} style={styles.smallAvatarWrapper}>
                <Image source={img} style={{ width: 70, height: 70, borderRadius: 35 }} />
              </View>
            );
          })}
        </ScrollView>

        <Text style={[styles.sectionTitle, { color: currentTheme.textColor }]}>Récompenses</Text>
        <View style={styles.badgeContainer}>
          {Object.keys(badgeMap).map((badge, index) => {
            const isUnlocked = recompensesConverties.includes(badge);
            const BadgeComponent = badgeMap[badge];
            return (
              <TouchableOpacity key={index} onPress={() => {
                setSelectedBadge(badge);
                setModalVisible(true);
              }}>
                <View style={[styles.badge, !isUnlocked && styles.badgeLocked]}>
                  {BadgeComponent ? (
                    React.createElement(BadgeComponent, { width: 60, height: 60 })
                  ) : (
                    <Text style={{ fontSize: 10 }}>⛔</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: currentTheme.cardBackground }]}>
              <Text style={[styles.modalTitle, { color: currentTheme.textColor }]}>
                {recompensesConverties.includes(selectedBadge) ? 'Récompense débloquée !' : 'À débloquer'}
              </Text>
              <Text style={[styles.modalText, { color: currentTheme.textColor }]}>
                {badgeDescriptions[selectedBadge] || 'Récompense spéciale débloquée !'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalClose}>
                <Text style={{ color: 'white' }}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity style={[styles.button, { backgroundColor: currentTheme.primary }]} onPress={() => navigation.navigate('ChangePassword')}>
          <Text style={{ color: currentTheme.buttonText }}>Modifier mot de passe</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: currentTheme.primary }]} onPress={() => navigation.navigate('ChangeEmail')}>
          <Text style={{ color: currentTheme.buttonText }}>Modifier courriel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: 'red' }]} onPress={logout}>
          <Text style={{ color: 'white' }}>Déconnexion</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  avatarWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallAvatarWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointsText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  badge: {
    width: 60,
    height: 60,
    margin: 8,
  },
  badgeLocked: {
    opacity: 0.3,
  },
  button: {
    marginTop: 20,
    padding: 10,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  logoutButton: {
    marginTop: 30,
    padding: 12,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 9999,
    elevation: 9999,
  },
  modalContent: {
    padding: 20,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalClose: {
    backgroundColor: '#2a75f3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
});

export default Profile;
