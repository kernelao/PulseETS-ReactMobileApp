import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform, Dimensions, KeyboardAvoidingView, SafeAreaView } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import DropDownPicker from 'react-native-dropdown-picker';

const Reglages = () => {
  const { theme, changeTheme } = useTheme();
  const { token } = useAuth();

  const [pomodoro, setPomodoro] = useState(25);
  const [pauseCourte, setPauseCourte] = useState(5);
  const [pauseLongue, setPauseLongue] = useState(15);
  const [themeChoisi, setThemeChoisi] = useState(theme);
  const [themeTemp, setThemeTemp] = useState(theme);

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Mode zen', value: 'Mode zen' },
    { label: 'Mode nuit', value: 'Mode nuit' },
    { label: 'Mode jour', value: 'Mode jour' },
    { label: 'Cyberpunk', value: 'Cyberpunk' },
    { label: 'Steampunk', value: 'Steampunk' },
    { label: 'Space', value: 'Space' },
    { label: 'Neon Lights', value: 'Neon Lights' },
    { label: 'Vintage', value: 'Vintage' },
    { label: 'Minimalist', value: 'Minimalist' },
  ]);

  const themeColors = {
    "mode_zen": { backgroundColor: "#9cccb5", textColor: "#0b0626", cardBg: "#e6f5e1" },
    "mode_nuit": { backgroundColor: "#0b0626", textColor: "#eaeaea", cardBg: "#171a38" },
    "mode_jour": { backgroundColor: "#eef5f8", textColor: "#24332a", cardBg: "#ffffff" },
    "cyberpunk": { backgroundColor: "#0f0f2d", textColor: "#00ffff", cardBg: "#1a1a40" },
    "steampunk": { backgroundColor: "#3e2f1c", textColor: "#ffd699", cardBg: "#5b4636" },
    "space": { backgroundColor: "#0c1c36", textColor: "#e0e6f7", cardBg: "#1b2d4f" },
    "neon_lights": { backgroundColor: "#1f0036", textColor: "#ff00ff", cardBg: "#3b0066" },
    "vintage": { backgroundColor: "#f4e2d8", textColor: "#4e342e", cardBg: "#dfc3b4" },
    "minimalist": { backgroundColor: "#ffffff", textColor: "#333", cardBg: "#f9f9f9" },
  };

  const screenHeight = Dimensions.get('window').height;
  const dynamicPaddingTop = screenHeight * 0.05;

  const currentThemeKey = themeChoisi.replace(/\s+/g, "_").toLowerCase();
  const currentColors = themeColors[currentThemeKey] || themeColors["mode_jour"];

  const handleSubmit = async () => {
    setThemeChoisi(themeTemp);
    changeTheme(themeTemp);
    try {
      await fetch(`http://192.168.0.143:8000/api/reglages`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pomodoro: parseInt(pomodoro),
          courte_pause: parseInt(pauseCourte),
          longue_pause: parseInt(pauseLongue),
          theme: themeTemp,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentColors.backgroundColor, paddingTop: dynamicPaddingTop, paddingHorizontal: 20, paddingBottom: 20 }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, width: '100%', alignItems: "center" }}
      >
        <Text style={[styles.title, { color: currentColors.textColor }]}>Réglages</Text>

        <View style={[styles.section, styles.viewMargin, styles.maxWidthContainer]}>
          <Text style={[styles.subtitle, { color: currentColors.textColor }]}>Minuteur</Text>

          {[{ label: "Pomodoro", value: pomodoro, setter: setPomodoro },
            { label: "Pause Courte", value: pauseCourte, setter: setPauseCourte },
            { label: "Pause Longue", value: pauseLongue, setter: setPauseLongue },
          ].map((item, index) => (
            <View key={index} style={styles.inputGroup}>
              <Text style={[styles.label, { color: currentColors.textColor }]}>{item.label}</Text>
              <TextInput
                style={[styles.input, { backgroundColor: currentColors.cardBg, color: currentColors.textColor, borderColor: currentColors.textColor }]}
                keyboardType="numeric"
                value={String(item.value)}
                onChangeText={(text) => item.setter(text)}
              />
            </View>
          ))}
        </View>

        <View style={[{ marginBottom: 20 }, styles.viewMargin, styles.maxWidthContainer]}>
          <Text style={[styles.subtitle, { color: currentColors.textColor }]}>Changer le thème</Text>

          <DropDownPicker
            open={open}
            value={themeTemp}
            items={items}
            setOpen={setOpen}
            setValue={setThemeTemp}
            setItems={setItems}
            style={[styles.dropdown, { backgroundColor: currentColors.cardBg, borderColor: currentColors.textColor }]}
            dropDownContainerStyle={[styles.dropdownContainer, { backgroundColor: currentColors.cardBg, borderColor: currentColors.textColor }]}
            zIndex={1000}
            zIndexInverse={3000}
            textStyle={{ color: currentColors.textColor }}
          />
        </View>

        <TouchableOpacity style={[styles.button, { backgroundColor: currentColors.cardBg }, styles.maxWidthContainer]} onPress={handleSubmit}>
          <Text style={[styles.buttonText, { color: currentColors.textColor }]}>Enregistrer</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Reglages;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
  viewMargin: {
    margin: 20,
  },
  maxWidthContainer: {
    width: '100%',
    maxWidth: 350,
    alignSelf: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 20,
  },
  section: {
    width: "100%",
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    height: 50,
  },
  dropdown: {
    borderRadius: 8,
  },
  dropdownContainer: {
    borderRadius: 8,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
