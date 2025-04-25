import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform, Dimensions, KeyboardAvoidingView, SafeAreaView, Keyboard, TouchableWithoutFeedback } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import DropDownPicker from 'react-native-dropdown-picker';

const Reglages = () => {
  const { theme, pomodoro, pauseCourte, pauseLongue, changeTheme, setPomodoro, setPauseCourte, setPauseLongue } = useTheme();
  const { token } = useAuth();

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

  const currentThemeKey = themeTemp.replace(/\s+/g, "_").toLowerCase();
  const currentColors = themeColors[currentThemeKey] || themeColors["mode_jour"];

  const handleSubmit = async () => {
    await changeTheme(themeTemp);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentColors.backgroundColor, paddingTop: dynamicPaddingTop, paddingHorizontal: 20, paddingBottom: 20 }]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                  onChangeText={(text) => {
                    const numericValue = parseInt(text, 10);
                    if (!isNaN(numericValue)) {
                      item.setter(numericValue);
                    } else {
                      item.setter(0); // Valeur par défaut si vide
                    }
                  }}
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

          <TouchableOpacity style={[styles.button, { backgroundColor: currentColors.cardBg }]} onPress={handleSubmit}>
            <Text style={[styles.buttonText, { color: currentColors.textColor }]}>Enregistrer</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
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
