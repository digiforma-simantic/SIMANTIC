import { router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RiwayatScreen() {
  const [searchText, setSearchText] = useState("");

  const riwayatData = [
    { id: 1, title: "Install Aplikasi Kerja", code: "#0001", date: "17 Agustus 2025", status: "progress" },
    { id: 2, title: "Install Aplikasi Kerja", code: "#0001", date: "17 Agustus 2025", status: "progress" },
    { id: 3, title: "Install Aplikasi Kerja", code: "#0001", date: "17 Agustus 2025", status: "progress" },
    { id: 4, title: "Install Aplikasi Kerja", code: "#0001", date: "17 Agustus 2025", status: "progress" },
    { id: 5, title: "Install Aplikasi Kerja", code: "#0001", date: "17 Agustus 2025", status: "progress" },
    { id: 6, title: "Install Aplikasi Kerja", code: "#0001", date: "17 Agustus 2025", status: "progress" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "progress":
        return "#FF6600";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F9FD" />

      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Riwayat Approval</Text>
      </View>

      {/* ================= SEARCH BAR + FILTER MENYATU ================= */}
      <View style={styles.searchContainer}>
        <Image
          source={require("../../assets/images/search.png")}
          style={styles.searchIcon}
        />

        <TextInput
          style={styles.searchInput}
          placeholder="Cari riwayat approval..."
          placeholderTextColor="#9E9E9E"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* ================= KOTAK RIWAYAT (TIDAK SCROLL) ================= */}
      <View style={styles.card}>
        {/* ================= LIST YANG BISA SCROLL ================= */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {riwayatData.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.riwayatItem,
                index === riwayatData.length - 1 && styles.riwayatItemLast,
              ]}
            >
              <View style={styles.riwayatLeft}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: getStatusColor(item.status) },
                  ]}
                />
                <View style={styles.riwayatInfo}>
                  <Text style={styles.riwayatTitle}>{item.title}</Text>
                  <Text style={styles.riwayatSubText}>
                    {item.code} · {item.date}
                  </Text>
                </View>
              </View>

              <TouchableOpacity style={styles.statusButton} onPress={() => router.push("/admin/detailriwayat")}>
                <Text style={styles.statusText}>Cek Status</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
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
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },

  headerTitle: {
    fontFamily: "GeologicaBold",
    fontSize: 22,
    color: "#072A45",
    textAlign: "center",
  },

  /* ================= SEARCH ================= */

  searchContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E6E9EC",

    flexDirection: "row",
    alignItems: "center",
  },

  searchIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    fontFamily: "GeologicaRegular",
    fontSize: 14,
    color: "#072A45",
    padding: 0,
  },

  filterIcon: {
    width: 18,
    height: 18,
  },

  /* ================= CARD ================= */

  card: {
    marginHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E6E9EC",

    height: 430, // ✅ KOTAK RIWAYAT DIBATASI (TIDAK SCROLL)
  },

  listContent: {
    paddingBottom: 24,
  },

  riwayatItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F4FAFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E6E9EC",
  },

  riwayatItemLast: {
    marginBottom: 0,
  },

  riwayatLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },

  riwayatInfo: {
    flex: 1,
  },

  riwayatTitle: {
    fontFamily: "GeologicaSemiBold",
    fontSize: 14,
    color: "#072A45",
    marginBottom: 2,
  },

  riwayatSubText: {
    fontFamily: "GeologicaLight",
    fontSize: 11,
    color: "#607D8B",
  },

  statusButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  statusText: {
    fontFamily: "GeologicaSemiBold",
    fontSize: 12,
    color: "#072A45",
  },
});
