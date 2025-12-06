import React, { useState } from "react";
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
import { router } from "expo-router";

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [emailFocused, setEmailFocused] = useState(false);
  const [newFocused, setNewFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

  const isFormValid =
    email.trim() !== "" &&
    newPass.trim() !== "" &&
    confirmPass.trim() !== "" &&
    newPass === confirmPass;

  const getBorderColor = (focused: boolean, value: string) => {
    if (focused) return "#698A9A";
    if (value.trim() !== "") return "#698A9A";
    return "#C7D1D8";
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
        >
          {/* SIMANTIC */}
          <View style={styles.header}>
            <Text style={styles.logo}>SIMANTIC</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>Reset{"\n"}Kata Sandi</Text>

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

            {/* NEW PASSWORD */}
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Sandi Baru"
                placeholderTextColor="#9BA8B2"
                secureTextEntry={!showNew}
                value={newPass}
                onChangeText={setNewPass}
                onFocus={() => setNewFocused(true)}
                onBlur={() => setNewFocused(false)}
                style={[
                  styles.input,
                  styles.passwordInput,
                  { borderColor: getBorderColor(newFocused, newPass) },
                ]}
              />

              <TouchableOpacity
                onPress={() => setShowNew(!showNew)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showNew ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color="#8CA0AA"
                />
              </TouchableOpacity>
            </View>

            {/* CONFIRM PASSWORD */}
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Konfirmasi Sandi Baru"
                placeholderTextColor="#9BA8B2"
                secureTextEntry={!showConfirm}
                value={confirmPass}
                onChangeText={setConfirmPass}
                onFocus={() => setConfirmFocused(true)}
                onBlur={() => setConfirmFocused(false)}
                style={[
                  styles.input,
                  styles.passwordInput,
                  { borderColor: getBorderColor(confirmFocused, confirmPass) },
                ]}
              />

              <TouchableOpacity
                onPress={() => setShowConfirm(!showConfirm)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showConfirm ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color="#8CA0AA"
                />
              </TouchableOpacity>
            </View>

            {/* Back to login */}
            <TouchableOpacity
              style={styles.backLoginWrapper}
              onPress={() => router.push("/public/login")}
            >
              <Text style={styles.backLogin}>Kembali ke Login</Text>
            </TouchableOpacity>
          </View>

          {/* BUTTON */}
          <TouchableOpacity
            disabled={!isFormValid}
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
              Kirim
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

  header: {
    marginTop: 40,
    alignItems: "center",
    marginBottom: 70,
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

  backLoginWrapper: {
    alignSelf: "flex-end",
    marginTop: -4,
  },

  backLogin: {
    fontFamily: "GeologicaSemiBold",
    color: "#0C2B40",
    fontSize: 14,
  },

  button: {
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 80,
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
