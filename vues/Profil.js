import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import api from '../api/api';
import { avatarMap } from '../assets/image_avatar';
import { badgeMap } from '../assets/badges_recompenses';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { themes } from '../styles/themes';

const Profile = ({ navigation }) => {
  const { logout } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const { applyTheme } = useTheme();
  const { theme } = useTheme();
  const currentTheme = themes[theme] || themes['mode-jour'];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/user/profile');
        setUserData(response.data);
        applyTheme(response.data.theme); 
      } catch (error) {
        console.error('Erreur lors du chargement du profil', error);
      }
    };

    fetchProfile();
  }, []);

  if (!userData) return <Text>Chargement...</Text>;

  const {
    avatarPrincipal,
    pulsePoints,
    unlockedAvatars,
    recompenses,
  } = userData;

  return (
    <View style={{ backgroundColor: currentTheme.backgroundColor, flex: 1 }}>
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={avatarMap[avatarPrincipal]} style={styles.avatar} />

      <Text style={styles.pointsText}>Points Pulse : {pulsePoints}</Text>

      <Text style={styles.sectionTitle}>Avatars débloqués</Text>
      <ScrollView horizontal>
        {unlockedAvatars.map((name, index) => (
          <Image key={index} source={avatarMap[name]} style={styles.smallAvatar} />
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Récompenses</Text>
      <View style={styles.badgeContainer}>
        {Object.keys(badgeMap).map((badge, index) => {
          const isUnlocked = recompenses.includes(badge);
          return (
            <Image
              key={index}
              source={badgeMap[badge]}
              style={[styles.badge, !isUnlocked && styles.badgeLocked]}
            />
          );
        })}
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ChangePassword')}>
        <Text>Modifier mot de passe</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ChangeEmail')}>
        <Text>Modifier courriel</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={{ color: 'white' }}>Déconnexion</Text>
      </TouchableOpacity>
    </ScrollView>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  smallAvatar: {
    width: 70,
    height: 70,
    margin: 5,
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
  },
  logoutButton: {
    marginTop: 30,
    padding: 12,
    borderRadius: 8,
  },
});

export default Profile;
