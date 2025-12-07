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

export default function RiwayatApprovalScreen() {
  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState("Semua");

  const filters = ["Semua", "Disetujui", "Ditolak", "Butuh Info", "Diteruskan"];

  const riwayatData = [
    { id: 1, title: "Install Aplikasi Kerja", code: "#0001", date: "17 Agustus 2025", status: "success" },
    { id: 2, title: "Install Aplikasi Kerja", code: "#0001", date: "17 Agustus 2025", status: "failed" },
    { id: 3, title: "Install Aplikasi Kerja", code: "#0001", date: "17 Agustus 2025", status: "progress" },
    { id: 4, title: "Install Aplikasi Kerja", code: "#0001", date: "17 Agustus 2025", status: "warning" },
    { id: 5, title: "Install Aplikasi Kerja", code: "#0001", date: "17 Agustus 2025", status: "progress" },
    { id: 6, title: "Install Aplikasi Kerja", code: "#0001", date: "17 Agustus 2025", status: "progress" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "#00C853";
      case "failed":
        return "#D50000";
      case "progress":
        return "#2979FF";
      case "warning":
        return "#FF9800";
      default:
        return "#9E9E9E";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F9FD" />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Riwayat Approval</Text>
      </View>

      {/* SEARCH */}
      <View style={styles.searchContainer}>
        <Image
          source={require("../../assets/images/search.png")}
          style={styles.searchIcon}
        />

        <TextInput
          style={styles.searchInput}
          placeholder="Cari Riwayat Approval..."
          placeholderTextColor="#9E9E9E"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* CARD */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Riwayat Approval</Text>

        {/* FILTER HORIZONTAL */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={{ alignItems: "center" }}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                activeFilter === filter && styles.filterActive,
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter && styles.filterTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* LIST RIWAYAT (VERTIKAL SCROLL DI DALAM CARD) */}
        <ScrollView
          style={styles.riwayatScroll}
          showsVerticalScrollIndicator={false}
        >
          {riwayatData.map((item) => (
            <View key={item.id} style={styles.riwayatItem}>
              <View style={styles.riwayatLeft}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: getStatusColor(item.status) },
                  ]}
                />

                <View>
                  <Text style={styles.riwayatTitle}>{item.title}</Text>
                  <Text style={styles.riwayatSubText}>
                    {item.code} · {item.date}
                  </Text>
                </View>
              </View>

              {/* CEK DETAIL TANPA BORDER */}
              <TouchableOpacity
                onPress={() => router.push("/diskominfo/detailriwayat")}
              >
                <Text style={styles.detailText}>Cek Detail</Text>
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
    paddingBottom: 30,
    paddingHorizontal: 20,
  },

  headerTitle: {
    fontFamily: "GeologicaBold",
    fontSize: 22,
    color: "#072A45",
    textAlign: "center",
  },

  searchContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
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
  },

  card: {
    marginHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E6E9EC",
    height: 440, // ✅ Tinggi dibatasi
  },

  sectionTitle: {
    fontFamily: "GeologicaBold",
    fontSize: 18,
    color: "#072A45",
    marginBottom: 12,
  },

  filterScroll: {
    marginBottom: 28,
    height: 48,
  },

  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6, // ✅ Tidak terlalu bulat
    borderWidth: 1,
    borderColor: "#E6E9EC",
    marginRight: 8,
    backgroundColor: "#F2FAFF",
  },

  filterActive: {
    backgroundColor: "#002543",
  },

  filterText: {
    fontFamily: "GeologicaSemiBold",
    fontSize: 12,
    color: "#002543",
  },

  filterTextActive: {
    color: "#FFFFFF",
  },

  riwayatScroll: {
    marginTop: 10,
  },

  riwayatItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F4FAFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E6E9EC",
  },

  riwayatLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },

  riwayatTitle: {
    fontFamily: "GeologicaSemiBold",
    fontSize: 13,
    color: "#072A45",
  },

  riwayatSubText: {
    fontFamily: "GeologicaLight",
    fontSize: 11,
    color: "#607D8B",
  },

  detailText: {
    fontFamily: "GeologicaSemiBold",
    fontSize: 10,
    color: "#002543", // ✅ Hanya teks, tanpa border
  },
});
