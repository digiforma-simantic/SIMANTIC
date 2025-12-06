// ChangePasswordScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";

const ChangePasswordScreen = () => {
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("Mohon lengkapi semua field");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Password baru dan konfirmasi password tidak cocok");
      return;
    }

    console.log("Password berhasil diubah");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <StatusBar barStyle="dark-content" backgroundColor="#F2FAFF" />

        {/* ===== HEADER ===== */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Ganti Password</Text>

          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.body}
        >
          {/* Password Lama */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Password Lama</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan password lama"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={oldPassword}
              onChangeText={setOldPassword}
            />
          </View>

          {/* Password Baru */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Password Baru</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan password baru"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
          </View>

          {/* Konfirmasi Password */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Konfirmasi Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Konfirmasi password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          {/* Button Simpan */}
          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>Simpan</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2FAFF",
  },

  /* ===== HEADER ===== */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#F2FAFF",
    marginTop: 60,
  },

  backIcon: {
    fontSize: 22,
    color: "#0F172A",
  },

  headerTitle: {
    fontSize: 18,
    fontFamily: "GeologicaBold",
    color: "#0F172A",
  },

  /* ===== BODY ===== */
  body: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  fieldContainer: {
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontFamily: "GeologicaSemiBold",
    color: "#0F172A",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    fontSize: 14,
    color: "#0F172A",
    fontFamily: "GeologicaRegular",
  },

  /* ===== BUTTON ===== */
  buttonWrapper: {
    alignItems: "flex-end",
    marginTop: 12,
  },

  saveButton: {
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 8,
  },

  saveButtonText: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "GeologicaSemiBold",
  },
});
