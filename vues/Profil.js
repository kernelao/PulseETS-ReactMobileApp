import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import api from '../api/api';
import { avatarMap } from '../assets/images_avatar';
import { badgeMap, badgeDescriptions } from '../assets/badges_recompenses';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { themes } from '../styles/themes';

const Profile = () => {
  const navigation = useNavigation(); // ✅
  const { logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const { theme, applyTheme } = useTheme();
  const currentTheme = themes[theme] || themes['mode-jour'];
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const normalizeType = (type) => {
    switch (type) {
      case 'notesAjoutees': return 'noteAdd';
      case 'sessionsCompletes': return 'sessionComplete';
      case 'tachesCompletes': return 'tacheComplete';
      default: return type;
    }
  };
    


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/user/profile');
        console.log("RESPONSE PROFIL:", response.data);
        if (response.data) {
          setUserData(response.data);
          console.log("avatarPrincipal depuis data:", response.data.avatarPrincipal); // ✅
          if (response.data.theme && themes[response.data.theme]) {
            applyTheme(response.data.theme);
          } else {
            console.warn("Thème invalide ou manquant:", response.data.theme);
          }        
        }
      } catch (error) {
        console.error("Erreur profil:", error?.response?.status || error.message);
      }
    };

    fetchProfile();
  }, []);

  if (!userData || typeof userData !== 'object') {
    return <Text>Chargement du profil...</Text>;
  }
  if (!navigation || typeof navigation.push !== 'function') {
    return <Text>Navigation corrompue dans Profil.jsx</Text>;
  }
  
  
  const { avatarPrincipal, pulsePoints, unlockedAvatars = [], recompenses = [] } = userData;
  console.log("🧩 RECOMPENSES BRUTES :", recompenses);
  const recompensesConverties = recompenses.map((r) => `i${r.valeur}${normalizeType(r.type)}`);

  const defaultSvg = '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#ccc" /></svg>';
  const rawAvatar = avatarMap[avatarPrincipal] ?? avatarMap["Jon Doe"] ?? defaultSvg;
  const avatarXml = typeof rawAvatar === 'string' && rawAvatar.includes('<svg') ? rawAvatar : defaultSvg;
  console.log("✅ avatarXml valid?", typeof avatarXml === 'string' && avatarXml.includes('<svg'));

  if (!avatarMap[avatarPrincipal]) {
    console.warn("⚠️ Avatar XML manquant pour :", avatarPrincipal);
  }
  

  console.log("userData.avatarPrincipal:", avatarPrincipal);
  console.log("avatarMap[avatarPrincipal]:", avatarMap[avatarPrincipal]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: currentTheme.backgroundColor }}>
      <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.avatarWrapper}>
      {avatarMap[avatarPrincipal] ? (
  React.createElement(avatarMap[avatarPrincipal], { width: 120, height: 120 })
) : (
  <Text>❌ Avatar invalide</Text>
)}

</View>

        <Text style={[styles.pointsText, { color: currentTheme.textColor }]}>
          Points Pulse : {pulsePoints}
        </Text>

        <Text style={[styles.sectionTitle, { color: currentTheme.textColor }]}>
          Avatars débloqués
        </Text>
        <ScrollView horizontal>
        {unlockedAvatars.map((name, index) => {
  const AvatarComponent = avatarMap[name] || avatarMap['Jon Doe'];
  return (
    <View key={index} style={styles.smallAvatarWrapper}>
      {AvatarComponent ? (
        React.createElement(AvatarComponent, { width: 70, height: 70 })
      ) : (
        <Text style={{ fontSize: 10, color: 'red' }}>❌</Text>
      )}
    </View>
  );
})}

</ScrollView>


        <Text style={[styles.sectionTitle, { color: currentTheme.textColor }]}>
          Récompenses
        </Text>
        <View style={styles.badgeContainer}>
        {Object.keys(badgeMap).map((badge, index) => {
  const isUnlocked = recompensesConverties.includes(badge);
  const BadgeComponent = badgeMap[badge];

  if (!BadgeComponent) {
    console.warn("⚠️ Badge SVG manquant pour :", badge);
  }

  return (
    <TouchableOpacity
      key={index}
      onPress={() => {
        console.log('Badge cliqué :', badge);
        setSelectedBadge(badge);
        setModalVisible(true);
      }}
    >
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
            <View style={[styles.modalContent, { backgroundColor: currentTheme.cardBackground || '#fff' }]}>
            <Text style={[styles.modalTitle, { color: currentTheme.textColor }]}>
  {recompensesConverties.includes(selectedBadge)
    ? "Récompense débloquée !"
    : "À débloquer"}
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

        <TouchableOpacity
          style={[styles.button, { backgroundColor: currentTheme.primary }]}
          onPress={() => navigation.navigate('ChangePassword')}
        >
          <Text style={{ color: currentTheme.buttonText }}>Modifier mot de passe</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: currentTheme.primary }]}
          onPress={() => navigation.navigate('ChangeEmail')}
        >
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
