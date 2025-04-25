import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import base64 from "base-64";

const generateFakeToken = (role = "ROLE_USER") => {
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    role,
    exp: Math.floor(Date.now() / 1000) + 3600,
  };

  const encode = (obj) => base64.encode(JSON.stringify(obj));
  return `${encode(header)}.${encode(payload)}.signature`;
};

export default function Connexion() {
  const navigation = useNavigation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  // // Test GET à l'API pour voir si l'app y accède bien
  // useEffect(() => {
  //   axios
  //     .get("http://10.192.183.90:8000")
  //     .then((res) => {
  //       console.log("Test GET API OK :", res.status);
  //     })
  //     .catch((err) => {
  //       console.log("Test GET API échoué :", JSON.stringify(err, null, 2));
  //     });
  // }, []);

  const handleConnexion = async () => {
    try {
      const response = await axios.post(
        // "http://10.192.183.90:8000/api/connexion",
        //"http://172.20.10.3:8000/api/connexion",
        // "http://192.168.0.143:8000/api/connexion",
         "http://10.0.0.11:8000/api/connexion",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { token, role } = response.data;

      if (token) {
        console.log("Token reçu :", token);
        await login(token);
      } else {
        setErrMsg("Aucun token reçu.");
      }
    } catch (error) {
      console.log("Erreur Axios complète :", error);
      if (!error?.response) {
        setErrMsg("Aucune réponse du serveur");
      } else if (error.response?.status === 401) {
        setErrMsg("Identifiants invalides");
      } else {
        setErrMsg("Connexion échouée");
      }
    }
  };

  // const handleConnexion = async () => {
  //   // Token factice pour test (1h d'expiration)
  //   const fakeToken = generateFakeToken("ROLE_USER");

  //   login(fakeToken, "ROLE_USER");
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>

      {errMsg ? <Text style={styles.error}>{errMsg}</Text> : null}

      <TextInput
        placeholder="Email"
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Mot de passe"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Se connecter" onPress={handleConnexion} />

      <TouchableOpacity onPress={() => navigation.navigate("Inscription")}>
        <Text style={styles.link}>Pas encore inscrit ? Crée un compte</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  link: {
    color: "#1e90ff",
    textAlign: "center",
    marginTop: 20,
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
});
