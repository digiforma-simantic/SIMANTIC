import React from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function DetailProfileScreen() {
  const handleLogout = () => {
    Alert.alert("Logout", "Apakah Anda yakin ingin keluar?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          console.log("User logout");
          router.replace("/public/login");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F9FD" />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ================= HEADER ================= */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Detail Profil</Text>
          <View style={styles.headerSpace} />
        </View>

        {/* ================= FORM FIELDS ================= */}
        <View style={styles.formContainer}>
          {/* Nama Lengkap */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Nama Lengkap</Text>
            <View style={styles.inputBox}>
              <Text style={styles.inputText}>Slamet Budianto</Text>
            </View>
          </View>

          {/* Jenis Kelamin */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Jenis Kelamin</Text>
            <View style={styles.inputBox}>
              <Text style={styles.inputText}>Laki - Laki</Text>
            </View>
          </View>

          {/* NIP */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>NIP</Text>
            <View style={styles.inputBox}>
              <Text style={styles.inputText}>1120913458124</Text>
            </View>
          </View>

          {/* Jabatan */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Jabatan</Text>
            <View style={styles.inputBox}>
              <Text style={styles.inputText}>Kepala Seksi Dinas Kehutanan</Text>
            </View>
          </View>

          {/* Unit Kerja */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Unit Kerja</Text>
            <View style={styles.inputBox}>
              <Text style={styles.inputText}>Bidang Pencegahan Hutan Gundul</Text>
            </View>
          </View>

          {/* Asal Dinas */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Asal Dinas</Text>
            <View style={styles.inputBox}>
              <Text style={styles.inputText}>Dinas Kehutanan Provinsi Jawa Barat</Text>
            </View>
          </View>

          {/* Email */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputBox}>
              <Text style={styles.inputText}>SlametBud@gmail.com</Text>
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogout}
          >
            <Image
              source={require("../../assets/images/keluar.png")}
              style={styles.logoutIcon}
            />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F9FD",
  },

  scrollContent: {
    paddingBottom: 160,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: "#F3F9FD",
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  backIcon: {
    fontSize: 24,
    color: "#072A45",
  },

  headerTitle: {
    fontFamily: "GeologicaBold",
    fontSize: 18,
    color: "#072A45",
    textAlign: "center",
    marginLeft: 120,
  },

  headerSpace: {
    width: 40,
  },

  formContainer: {
    paddingHorizontal: 20,
  },

  fieldContainer: {
    marginBottom: 20,
  },

  label: {
    fontFamily: "GeologicaBold",
    fontSize: 14,
    color: "#072A45",
    marginBottom: 8,
  },

  inputBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#E6E9EC",
  },

  inputText: {
    fontFamily: "GeologicaRegular",
    fontSize: 15,
    color: "#374151",
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingVertical: 16,
    gap: 8,
  },

  logoutIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },

  logoutText: {
    fontFamily: "GeologicaBold",
    fontSize: 15,
    color: "#D50000",
  },
});