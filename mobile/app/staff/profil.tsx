import React from "react";
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BottomNav from "../../components/navigasi";
import { router } from "expo-router";

export default function ProfileScreen() {
  const handleDataUser = () => {
    console.log("Navigate ke Data User");
  };

  const handleGantiPassword = () => {
    console.log("Navigate ke Ganti Password");
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Apakah Anda yakin ingin keluar?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => console.log("User logout"),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#002543" />

      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil User</Text>
      </View>

      {/* ================= FOTO PROFIL ================= */}
      <View style={styles.profileWrapper}>
        <Image
          source={require("../../assets/images/slamet.png")}
          style={styles.profileImage}
        />
      </View>

      {/* ================= CONTENT ================= */}
      <View style={styles.content}>
        <Text style={styles.userName}>Slamet Budianto</Text>

        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/staff/datauser")}>
            <View style={styles.menuLeft}>
              <Image
                source={require("../../assets/images/profilbiru.png")}
                style={styles.menuIcon}
              />
              <Text style={styles.menuText}>Data User</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/staff/gantipw")}>
            <View style={styles.menuLeft}>
              <Image
                source={require("../../assets/images/setting.png")}
                style={styles.menuIcon}
              />
              <Text style={styles.menuText}>Ganti Password</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Image
            source={require("../../assets/images/keluar.png")}
            style={styles.logoutIcon}
          />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* ================= BOTTOM NAV ================= */}
      <BottomNav role={"staff"} />
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F9FD",
  },

  header: {
    backgroundColor: "#002543",
    height: 210,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 18,
  },

  headerTitle: {
    fontFamily: "GeologicaBold",
    fontSize: 20,
    marginTop: 40,
    color: "#FFFFFF",
    textAlign: "center",
  },

  profileWrapper: {
    alignSelf: "center",
    marginTop: -85,
    width: 140,
    height: 180, // ✅ POTRAIT
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    padding: 6,
    elevation: 6,
  },

  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    resizeMode: "cover",
  },

  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 16,
    paddingHorizontal: 20,
  },

  userName: {
    fontFamily: "GeologicaBold",
    fontSize: 22,
    color: "#072A45",
    marginBottom: 32,
    marginTop: 12,
  },

  menuContainer: {
    width: "100%",
    gap: 14,
    marginBottom: 40,
  },

  menuItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "#E6E9EC",
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  menuIcon: {
    width: 22,
    height: 22,
    marginRight: 12,
    resizeMode: "contain",
  },

  menuText: {
    fontFamily: "GeologicaSemiBold",
    fontSize: 15,
    color: "#072A45",
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  logoutIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },

  logoutText: {
    fontFamily: "GeologicaSemiBold",
    fontSize: 15,
    color: "#D50000",
  },
});
