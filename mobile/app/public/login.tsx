import React, { useState } from "react";
import { router } from "expo-router";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  const getBorderColor = (focused: boolean, value: string) => {
    if (focused) return "#698A9A";
    if (value.trim() !== "") return "#698A9A";
    return "#C7D1D8"; // abu-abu soft sesuai desain
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E7F0F5" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* SIMANTIC */}
          <View style={styles.header}>
            <Text style={styles.logo}>SIMANTIC</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>Masukkan Email{"\n"}Anda</Text>

          {/* Form */}
          <View style={styles.form}>
            {/* EMAIL */}
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Email"
                placeholderTextColor="#9BA8B2"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                style={[
                  styles.input,
                  { borderColor: getBorderColor(emailFocused, email) },
                ]}
              />
            </View>

            {/* PASSWORD */}
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Password"
                placeholderTextColor="#9BA8B2"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                style={[
                  styles.input,
                  styles.passwordInput,
                  { borderColor: getBorderColor(passwordFocused, password) },
                ]}
              />

              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color="#8CA0AA"
                />
              </TouchableOpacity>
            </View>

            {/* Forgot */}
            <TouchableOpacity
            style={styles.forgotWrapper}
            onPress={() => router.push("/public/forgotpassword")}
            >
            <Text style={styles.forgot}>Lupa Password</Text>
            </TouchableOpacity>
          </View>

          {/* BUTTON */}
          <TouchableOpacity
            disabled={!isFormValid}
            onPress={() => router.push("/auditor/dashboard")}
            style={[
              styles.button,
              isFormValid ? styles.btnActive : styles.btnInactive,
            ]}
          >
            <Text
              style={[
                styles.btnText,
                isFormValid ? styles.btnTextActive : styles.btnTextInactive,
              ]}
            >
              Berikutnya
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E7F0F5",
  },

  scroll: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 30,
  },

  // SIMANTIC TURUN
  header: {
    marginTop: 40,          // ↓ diperbesar agar turun
    alignItems: "center",
    marginBottom: 70,       // ↓ lebih jauh dari title
  },

  logo: {
    fontFamily: "GeologicaExtraBold",
    fontSize: 22,
    letterSpacing: 1.5,
    color: "#0C2B40",
  },

  title: {
    fontFamily: "GeologicaBold",
    fontSize: 30,
    fontWeight: "700",
    color: "#0C2B40",
    marginBottom: 35,
    lineHeight: 38,
  },

  form: {
    marginBottom: 20,
  },

  inputWrapper: {
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: "GeologicaRegular",
    color: "#0C2B40",
  },

  passwordInput: {
    paddingRight: 50,
  },

  eyeIcon: {
    position: "absolute",
    right: 14,
    top: 18,
  },

  forgotWrapper: {
    alignSelf: "flex-end",
    marginTop: -4,
  },

  forgot: {
    color: "#0C2B40",
    fontSize: 14,
    fontFamily: "GeologicaRegular",
  },

  // TOMBOL TURUN
  button: {
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 160,           // ↓ tombol makin ke bawah
    marginBottom: 60,
  },

  btnInactive: {
    backgroundColor: "#D3D3D3",
  },

  btnActive: {
    backgroundColor: "#0C2B40",
  },

  btnText: {
    fontSize: 17,
    fontFamily: "GeologicaSemiBold",
  },

  btnTextInactive: {
    color: "#A7A7A7",
  },

  btnTextActive: {
    color: "#FFFFFF",
  },
});
