import { router } from "expo-router";
import React from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AssetScreen() {
  const assetData = [
    { id: 1, name: "Laptop M-25-001", code: "#CI-000245" },
    { id: 2, name: "Laptop M-25-001", code: "#CI-000245" },
    { id: 3, name: "Laptop M-25-001", code: "#CI-000245" },
    { id: 4, name: "Laptop M-25-001", code: "#CI-000245" },
    { id: 5, name: "Laptop M-25-001", code: "#CI-000245" },
    { id: 6, name: "Laptop M-25-001", code: "#CI-000245" },
    { id: 7, name: "Laptop M-25-001", code: "#CI-000245" },
    { id: 8, name: "Laptop M-25-001", code: "#CI-000245" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F9FD" />

      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cek Aset</Text>
      </View>

      {/* ================= KOTAK DAFTAR (FIX, TIDAK SCROLL) ================= */}
      <View style={styles.card}>
        {/* ================= HANYA ISI YANG SCROLL ================= */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {assetData.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.assetItem,
                index === assetData.length - 1 && styles.assetItemLast,
              ]}
            >
              <View style={styles.assetLeft}>
                <Text style={styles.assetName}>{item.name}</Text>
                <Text style={styles.assetCode}>{item.code}</Text>
              </View>

              <TouchableOpacity style={styles.detailButton} onPress={() => router.push("/kadis/detailaset")}>
                <Text style={styles.detailText}>Cek Detail</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* ✅ TIDAK ADA <BottomNav /> DI SINI */}
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
    paddingTop: 60,     // ✅ Lebih turun dari status bar
    paddingBottom: 40,  // ✅ Jarak ke kotak tidak mepet
    paddingHorizontal: 20,
    backgroundColor: "#F3F9FD",
  },

  headerTitle: {
    fontFamily: "GeologicaBold",
    fontSize: 22,
    color: "#072A45",
    textAlign: "center",
  },

  card: {
    marginHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E6E9EC",

    height: 480,   // ✅ KOTAK FIX (TIDAK SCROLL)
  },

  listContent: {
    paddingBottom: 16,
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

  assetItemLast: {
    marginBottom: 0,
  },

  assetLeft: {
    flex: 1,
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
