import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Platform, Dimensions, KeyboardAvoidingView, SafeAreaView } from "react-native";
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

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Mode zen', value: 'Mode zen' },
    { label: 'Mode nuit', value: 'Mode nuit' },
    { label: 'Mode jour', value: 'Mode jour' }
  ]);

  const screenHeight = Dimensions.get('window').height;
  const dynamicPaddingTop = screenHeight * 0.05;

  useEffect(() => {
    // Charger les réglages si nécessaire
  }, []);

  const handleSubmit = async () => {
    changeTheme(themeChoisi);
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
          theme: themeChoisi,
        }),
      });
      Alert.alert("Succès", "Réglages enregistrés !");
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Impossible d'enregistrer");
    }
  };

  return (
    <SafeAreaView style={[
      styles.container,
      styles[`mode_${themeChoisi.replace(/\s+/g, "_").toLowerCase()}`],
      { paddingTop: dynamicPaddingTop }
    ]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, width: '100%', alignItems: "center" }}
      >
        <Text style={styles.title}>Réglages</Text>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Minuteur</Text>

          {[{ label: "Pomodoro", value: pomodoro, setter: setPomodoro },
            { label: "Pause Courte", value: pauseCourte, setter: setPauseCourte },
            { label: "Pause Longue", value: pauseLongue, setter: setPauseLongue },
          ].map((item, index) => (
            <View key={index} style={styles.inputGroup}>
              <Text style={styles.label}>{item.label}</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(item.value)}
                onChangeText={(text) => item.setter(text)}
              />
            </View>
          ))}
        </View>

        <View style={{ width: '100%', marginBottom: 20 }}>
          <Text style={styles.subtitle}>Changer le thème</Text>

          <DropDownPicker
            open={open}
            value={themeChoisi}
            items={items}
            setOpen={setOpen}
            setValue={setThemeChoisi}
            setItems={setItems}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            zIndex={1000}
            zIndexInverse={3000}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Enregistrer</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Reglages;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    margin: 20,
    padding: 20, 
    justifyContent: "flex-start",
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
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    height: 50,
  },
  dropdown: {
    borderRadius: 8,
    borderColor: '#ccc',
  },
  dropdownContainer: {
    borderRadius: 8,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: "#2e7d32",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  mode_zen: {
    backgroundColor: "#9cccb5",
  },
  mode_nuit: {
    backgroundColor: "#0b0626",
  },
  mode_jour: {
    backgroundColor: "#eef5f8",
  },
});
