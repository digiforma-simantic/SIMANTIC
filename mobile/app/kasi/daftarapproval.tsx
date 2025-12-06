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

  const approvalData = [
    { id: 1, title: "Install Aplikasi Kerja", code: "#0001", date: "17 Agustus 2025", icon: "minus" },
    { id: 2, title: "Install Aplikasi Kerja", code: "#0001", date: "17 Agustus 2025", icon: "minus" },
    { id: 3, title: "Install Aplikasi Kerja", code: "#0001", date: "17 Agustus 2025", icon: "minus" },
    { id: 4, title: "Install Aplikasi Kerja", code: "#0001", date: "17 Agustus 2025", icon: "minus" },
    { id: 5, title: "Install Aplikasi Kerja", code: "#0001", date: "17 Agustus 2025", icon: "alert" },
    { id: 6, title: "Install Aplikasi Kerja", code: "#0001", date: "17 Agustus 2025", icon: "alert" },
    { id: 7, title: "Install Aplikasi Kerja", code: "#0001", date: "17 Agustus 2025", icon: "minus" },
  ];

  const handleDetailPress = (id: number) => {
    router.push(`/kasi/detailapproval`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2FAFF" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Daftar Approval</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* SCROLL LUAR */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* SEARCH */}
        <View style={styles.searchContainer}>
          <Image
            source={require("../../assets/images/search.png")}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari Daftar Approval..."
            placeholderTextColor="#94A3B8"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* CARD */}
        <View style={styles.approvalCard}>
          <Text style={styles.cardTitle}>Daftar Approval</Text>

          {/* ✅ SCROLL KHUSUS DALAM CARD */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
          >
            {approvalData.map((item) => (
              <View key={item.id} style={styles.approvalItem}>

                {/* ICON */}
                <View style={styles.iconContainer}>
                  {item.icon === "minus" ? (
                    <View style={styles.minusIcon}>
                      <View style={styles.minusLine} />
                    </View>
                  ) : (
                    <View style={styles.alertIcon}>
                      <Text style={styles.alertIconText}>!</Text>
                    </View>
                  )}
                </View>

                {/* CONTENT */}
                <View style={styles.contentContainer}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemSubtext}>
                    {item.code} · {item.date}
                  </Text>
                </View>

                {/* DETAIL */}
                <TouchableOpacity onPress={() => handleDetailPress(item.id)}>
                  <Text style={styles.detailText}>Cek Detail</Text>
                </TouchableOpacity>

              </View>
            ))}
          </ScrollView>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DaftarApprovalScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2FAFF" },

  header: {
    backgroundColor: "#F2FAFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 60,
  },

  backButton: { width: 40, alignItems: "center" },
  backIcon: { fontSize: 24, color: "#1A1A1A" },
  headerTitle: { fontFamily: "GeologicaBold", fontSize: 18, color: "#0F172A" },

  scrollView: { flex: 1, paddingHorizontal: 16 },

  /* SEARCH */
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 16,
  },

  searchIcon: { width: 18, height: 18, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 14 },

  /* CARD */
  approvalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    maxHeight: 520,        // ✅ CARD TERBATAS
    overflow: "hidden",
  },

  cardTitle: { fontFamily: "GeologicaBold", fontSize: 16, marginBottom: 12 },

  approvalItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    height: 70,
  },

  iconContainer: { marginRight: 12 },

  minusIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "#64748B",
    justifyContent: "center",
    alignItems: "center",
  },

  minusLine: { width: 10, height: 2, backgroundColor: "#64748B" },

  alertIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "#F59E0B",
    justifyContent: "center",
    alignItems: "center",
  },

  alertIconText: { fontSize: 12, color: "#F59E0B" },

  contentContainer: { flex: 1, justifyContent: "center" },

  itemTitle: {
    fontFamily: "GeologicaSemiBold",
    fontSize: 13,
    marginBottom: 4,
  },

  itemSubtext: { fontSize: 11, color: "#64748B" },

  detailText: {
    fontFamily: "GeologicaSemiBold",
    fontSize: 12,
    color: "#0F172A",
    marginLeft: 8,
  },
});
