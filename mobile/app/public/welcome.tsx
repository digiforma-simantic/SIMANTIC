import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ImageBackground,
  Dimensions,
} from "react-native";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function Welcome() {
  const handleStart = () => {
    router.push("/public/login");
  };

  return (
    <ImageBackground
      source={require("../../assets/images/bgsimantic.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" backgroundColor="#002543" />

      {/* SIMANTIC Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>SIMANTIC</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Selamat Datang{"\n"}Di Simantic</Text>
        
        <Text style={styles.description}>
          Kelola perubahan, konfigurasi, dan pemeliharaan TI dengan lebih mudah
          dan terintegrasi. Wujudkan pengelolaan infrastruktur yang aman dan
          efisien!
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handleStart}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Mulai</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#002543",
  },

  header: {
    width: "100%",
    alignItems: "center",
    marginTop: 60,
  },

  logo: {
    fontFamily: "GeologicaExtraBold",
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 2,
  },

  content: {
    flex: 1,
    paddingHorizontal: 40,
    justifyContent: "flex-end", // diturunkan ke bawah
    paddingBottom: 120, // makin turun ke bawah
  },

  title: {
    fontFamily: "GeologicaBold",
    fontSize: 36,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 20,
    lineHeight: 42,
  },

  description: {
    fontFamily: "GeologicaThin",
    fontSize: 15,
    color: "#FFFFFF",
    lineHeight: 24,
    marginBottom: 50,
    opacity: 0.9,
  },

  button: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    elevation: 6,
  },

  buttonText: {
    fontFamily: "GeologicaBold",
    fontSize: 18,
    fontWeight: "800",
    color: "#003049",
  },
});
