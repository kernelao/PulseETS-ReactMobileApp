import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

// REGEX
const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export default function Inscription() {
  const navigation = useNavigation();

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [validMatch, setValidMatch] = useState(false);

  const [errMsg, setErrMsg] = useState("");

  // Validation dynamique
  useEffect(() => setValidUsername(USER_REGEX.test(username)), [username]);
  useEffect(() => setValidEmail(EMAIL_REGEX.test(email)), [email]);
  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
    setValidMatch(password === confirmPassword);
  }, [password, confirmPassword]);

  useEffect(() => setErrMsg(""), [username, email, password, confirmPassword]);

  const handleInscription = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/inscription",
        {
          username,
          email,
          password,
        }
      );

      const { token, role } = response.data;
      Alert.alert("Succès", "Inscription réussie !");
      console.log("Token reçu :", token, "Rôle :", role);
    } catch (err) {
      console.error(err);
      if (!err?.response) {
        setErrMsg("Aucune réponse du serveur");
      } else if (err.response?.status === 409) {
        const message = err.response.data?.message;
        if (message === "Email déjà utilisé") {
          setErrMsg("Ce courriel est déjà utilisé.");
        } else if (message === "Nom d'utilisateur déjà pris") {
          setErrMsg("Ce nom d'utilisateur est déjà pris.");
        } else {
          setErrMsg("Conflit (409)");
        }
      } else {
        setErrMsg("Erreur d'inscription");
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Inscription</Text>
      {errMsg ? <Text style={styles.error}>{errMsg}</Text> : null}

      <TextInput
        placeholder="Nom d'utilisateur"
        value={username}
        onChangeText={setUsername}
        style={[styles.input, username && !validUsername && styles.invalid]}
      />
      {username && !validUsername && (
        <Text style={styles.helper}>
          4 à 24 caractères, commence par une lettre.
        </Text>
      )}

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={[styles.input, email && !validEmail && styles.invalid]}
      />
      {email && !validEmail && (
        <Text style={styles.helper}>Veuillez entrer un courriel valide.</Text>
      )}

      <TextInput
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={[styles.input, password && !validPassword && styles.invalid]}
      />
      {password && !validPassword && (
        <Text style={styles.helper}>
          8 à 24 caractères, incluant majuscule, minuscule, chiffre et caractère
          spécial.
        </Text>
      )}

      <TextInput
        placeholder="Confirmer le mot de passe"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={[styles.input, confirmPassword && !validMatch && styles.invalid]}
      />
      {confirmPassword && !validMatch && (
        <Text style={styles.helper}>Doit correspondre au mot de passe.</Text>
      )}

      <Button
        title="S'inscrire"
        onPress={handleInscription}
        disabled={
          !validUsername || !validEmail || !validPassword || !validMatch
        }
      />

      <TouchableOpacity onPress={() => navigation.navigate("Connexion")}>
        <Text style={styles.link}>Déjà un compte ? Se connecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#000",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontSize: 26,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  invalid: {
    borderColor: "red",
    borderWidth: 1,
  },
  helper: {
    color: "#aaa",
    fontSize: 12,
    marginBottom: 10,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 15,
  },
  link: {
    color: "#1e90ff",
    textAlign: "center",
    marginTop: 20,
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
});
