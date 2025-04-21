// ProfileScreen.styles.ts
import { StyleSheet } from 'react-native';
import { ThemeType, themes } from '@/lib/themes';

export const createProfileStyles = (themeName: ThemeType) => {
  const theme = themes[themeName];

  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.backgroundColor,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 20,
      color: theme.textColor,
      textAlign: 'center'
    },
    avatarSection: {
      alignItems: 'center',
      marginBottom: 20,
    },
    avatarImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 3,
      borderColor: theme.borderColor,
      marginBottom: 10,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    },
    pointsText: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.textColor,
    },
    subtitle: {
      fontSize: 20,
      fontWeight: '600',
      marginTop: 20,
      marginBottom: 10,
      color: theme.textColor,
      textAlign: 'center'
    },
    button: {
      backgroundColor: theme.buttonBackground,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: 'center',
      marginVertical: 8,
    },
    buttonText: {
      color: theme.buttonText,
      fontWeight: '600',
    },
    recompenseGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 12,
      paddingVertical: 10,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    popupBox: {
      backgroundColor: theme.popupBackground,
      marginHorizontal: 30,
      padding: 20,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      width: '80%',
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 12,
      textAlign: 'center',
      color: theme.textColor,
    },
    modalDesc: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 16,
      color: theme.textColor,
    },

    avatarList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 10,
      marginBottom: 20,
    },
    
    modalContent: {
      backgroundColor: theme.popupBackground,
      padding: 20,
      borderRadius: 12,
      marginHorizontal: 20,
      alignItems: 'center',
    },
    
    input: {
      width: '100%',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding: 10,
      marginBottom: 10,
      backgroundColor: '#fff',
      color: '#000',
    },
    
  });
};
