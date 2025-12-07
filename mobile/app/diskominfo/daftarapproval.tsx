import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Image,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";

const DaftarApprovalScreen = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState("Semua");

  const approvalData = [
    { id: 1, title: "Pembaruan Aplikasi E-Kinerja", code: "#RFC-0001", date: "17 Agustus 2025", level: "Low" },
    { id: 2, title: "Pemeliharaan Aplikasi", code: "#RFC-0001", date: "17 Agustus 2025", level: "Medium" },
    { id: 3, title: "Install Aplikasi Kerja", code: "#RFC-0001", date: "17 Agustus 2025", level: "High" },
    { id: 4, title: "Install Aplikasi Kerja", code: "#RFC-0001", date: "17 Agustus 2025", level: "Medium" },
    { id: 5, title: "Install Aplikasi Kerja", code: "#RFC-0001", date: "17 Agustus 2025", level: "Low" },
  ];

  const filteredData =
    activeFilter === "Semua"
      ? approvalData
      : approvalData.filter((item) => item.level === activeFilter);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E9F6FF" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Daftar Approval</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>

        {/* SEARCH */}
        <View style={styles.searchContainer}>
          <Image
            source={require("../../assets/images/search.png")}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari Daftar Approval..."
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* CARD UTAMA */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>Daftar Approval</Text>

          {/* FILTER */}
          <View style={styles.filterRow}>
            {["Semua", "Low", "Medium", "High"].map((f) => (
              <TouchableOpacity
                key={f}
                style={[
                  styles.filterButton,
                  activeFilter === f && styles.filterButtonActive,
                ]}
                onPress={() => setActiveFilter(f)}
              >
                <Text
                  style={[
                    styles.filterText,
                    activeFilter === f && styles.filterTextActive,
                  ]}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* LIST DENGAN SCROLL */}
          <View style={styles.approvalListContainer}>
            <ScrollView showsVerticalScrollIndicator={true}>
              {filteredData.map((item) => (
                <View key={item.id} style={styles.itemCard}>
                  
                  {/* TAG PRIORITAS */}
                  <View style={[styles.levelTag, { backgroundColor: "#DCEBFF" }]}>
                    <Text style={[styles.levelText, { color: "#0F2D52" }]}>
                      {item.level}
                    </Text>
                  </View>

                  {/* CONTENT */}
                  <View style={{ flex: 1, marginTop: 6 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={styles.itemTitle}>{item.title}</Text>

                      <TouchableOpacity
                        onPress={() => router.push("/diskominfo/detailapproval")}
                      >
                        <Text style={styles.detailButton}>Cek Detail</Text>
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.itemSubtitle}>
                      {item.code} · {item.date}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DaftarApprovalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9F6FF",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    marginTop: 50,
    marginBottom: 20,
    alignItems: "center",
  },

  backButton: { width: 40, alignItems: "flex-start" },
  backIcon: { fontSize: 22 },

  headerTitle: {
    fontSize: 20,
    fontFamily: "GeologicaBold",
    color: "#0F172A",
  },

  scrollView: { paddingHorizontal: 16 },

  // SEARCH
  searchContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 13,
    marginTop: 20,
    marginBottom: 16,
  },
  searchIcon: { width: 18, height: 18, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 14 },

  // CARD
  cardContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },

  cardTitle: {
    fontFamily: "GeologicaBold",
    fontSize: 16,
    marginBottom: 12,
  },

  // FILTER
  filterRow: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 10,
    flexWrap: "wrap",
  },

  filterButton: {
    borderWidth: 1,
    borderColor: "#001A2F",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
    color: "#F2FAFF",
  },

  filterButtonActive: {
    backgroundColor: "#001A2F",
  },

  filterText: {
    fontSize: 12,
    color: "#001A2F",
    fontFamily: "GeologicaSemiBold",
  },

  filterTextActive: {
    color: "#fff",
  },

  // LIST SCROLL
  approvalListContainer: {
    maxHeight: 400, // <<< BATAS TINGGI AGAR SCROLL DI DALAM
    paddingRight: 6,
  },

  // ITEM CARD
  itemCard: {
    backgroundColor: "#EEF7FF",
    padding: 20,
    borderRadius: 20,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  levelTag: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 6,
  },

  levelText: {
    fontFamily: "GeologicaSemiBold",
    fontSize: 12,
  },

  itemTitle: {
    fontSize: 15,
    fontFamily: "GeologicaSemiBold",
    color: "#0F172A",
  },

  itemSubtitle: {
    marginTop: 6,
    fontSize: 12,
    color: "#64748B",
    fontFamily: "GeologicaRegular",
  },

  detailButton: {
    fontSize: 13,
    color: "#0F172A",
    fontFamily: "GeologicaSemiBold",
  },
});
