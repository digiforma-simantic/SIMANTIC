import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function AsetScreen() {
  // ================== TAB STATE ==================
  const [activeTab, setActiveTab] = useState<"asetSaya" | "daftarAset">(
    "asetSaya"
  );

  // ================== DATA ==================
  const asetSaya = [
    { id: 1, name: "Laptop M-25-001", code: "#CI-000245" },
    { id: 2, name: "Laptop M-25-002", code: "#CI-000246" },
  ];

  const daftarAset = [
    { id: 1, name: "Printer LX-500", code: "#CI-000310" },
    { id: 2, name: "Laptop M-30-010", code: "#CI-000278" },
    { id: 3, name: "Scanner EP-22", code: "#CI-000187" },
    { id: 4, name: "Modem A-10", code: "#CI-000099" },
    { id: 5, name: "Laptop A-20", code: "#CI-000320" },
  ];

  const currentData = activeTab === "asetSaya" ? asetSaya : daftarAset;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F9FD" />

      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Aset</Text>
      </View>

      {/* ================= TAB ================= */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === "asetSaya" && styles.tabActive,
          ]}
          onPress={() => setActiveTab("asetSaya")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "asetSaya" && styles.tabTextActive,
            ]}
          >
            Aset Saya
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === "daftarAset" && styles.tabActive,
          ]}
          onPress={() => setActiveTab("daftarAset")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "daftarAset" && styles.tabTextActive,
            ]}
          >
            Daftar Aset
          </Text>
        </TouchableOpacity>
      </View>

      {/* ================= CARD LIST ================= */}
      <View style={styles.card}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {currentData.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.assetItem,
                index === currentData.length - 1 && { marginBottom: 0 },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.assetName}>{item.name}</Text>
                <Text style={styles.assetCode}>{item.code}</Text>
              </View>

              <TouchableOpacity
                style={styles.detailButton}
                onPress={() =>
                  router.push(
                    activeTab === "asetSaya"
                      ? "/admin/detailasetsaya"
                      : "/admin/detaildaftaraset"
                  )
                }
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
    paddingBottom: 26,
    paddingHorizontal: 20,
    backgroundColor: "#F3F9FD",
  },

  headerTitle: {
    fontFamily: "GeologicaBold",
    fontSize: 22,
    color: "#072A45",
    textAlign: "center",
  },

  /* ===== TAB ===== */
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    backgroundColor: "#E1EBF5",
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },

  tabItem: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  tabActive: {
    backgroundColor: "#072A45",
  },

  tabText: {
    fontFamily: "GeologicaSemiBold",
    fontSize: 14,
    color: "#546E7A",
  },

  tabTextActive: {
    color: "#FFFFFF",
  },

  /* ===== CARD LIST ===== */
  card: {
    marginHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E6E9EC",
    height: 440, // kotak fixed
  },

  assetItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F4FAFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E6E9EC",
  },

  assetName: {
    fontFamily: "GeologicaSemiBold",
    fontSize: 15,
    color: "#072A45",
    marginBottom: 4,
  },

  assetCode: {
    fontFamily: "GeologicaRegular",
    fontSize: 12,
    color: "#607D8B",
  },

  detailButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  detailText: {
    fontFamily: "GeologicaSemiBold",
    fontSize: 12,
    color: "#072A45",
  },
});
