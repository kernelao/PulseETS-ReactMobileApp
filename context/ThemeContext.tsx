// context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes, ThemeType } from '@/lib/themes';

interface ThemeContextType {
  theme: ThemeType;
  themeValues: typeof themes[ThemeType];
  changeTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'mode-jour',
  themeValues: themes['mode-jour'],
  changeTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>('mode-jour');

  useEffect(() => {
    (async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme && savedTheme in themes) {
        setTheme(savedTheme as ThemeType);
      }
    })();
  }, []);

  const changeTheme = (newTheme: ThemeType) => {
    setTheme(newTheme);
    AsyncStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, themeValues: themes[theme], changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
