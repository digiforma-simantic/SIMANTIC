import React from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function DashboardScreen() {
  const router = useRouter();

  const approvalData = [
    { id: 1, title: "Install Aplikasi Kerja", code: "#0001", date: "17 Agustus 2025" },
    { id: 2, title: "Install Aplikasi Kerja", code: "#0001", date: "17 Agustus 2025" },
    { id: 3, title: "Install Aplikasi Kerja", code: "#0001", date: "17 Agustus 2025" },
  ];

  const submissionData = [
    { id: 1, title: "Install Aplikasi Kerja", code: "#0001", date: "17 Agustus 2025", status: "success" },
    { id: 2, title: "Install Aplikasi Kerja", code: "#0001", date: "17 Agustus 2025", status: "failed" },
    { id: 3, title: "Install Aplikasi Kerja", code: "#0001", date: "17 Agustus 2025", status: "progress" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "#00C853";
      case "failed": return "#D50000";
      case "progress": return "#2979FF";
      default: return "#9E9E9E";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#002543" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 160 }}>
        
        {/* ================= HEADER ================= */}
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <View>
              <Text style={styles.welcome}>Selamat Datang,</Text>
              <Text style={styles.username}>Joko Gemilang</Text>
            </View>

            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={styles.helpButton}
                onPress={() => router.push("/admin/bantuan")}
              >
                <Image
                  source={require("../../assets/images/bantuan.png")}
                  style={styles.helpIcon}
                />
                <Text style={styles.helpText}>Bantuan</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.notifButton}
                onPress={() => router.push("/admin/notifikasi")}
              >
                <Image
                  source={require("../../assets/images/notifikasi.png")}
                  style={styles.notifIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ================= DAFTAR APPROVAL (naik menggantikan status card) ================= */}
        <View style={[styles.sectionCard, { marginTop: -60 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Daftar Approval</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText} onPress={() => router.push("/admin/daftarapproval")}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          {approvalData.map((item) => (
            <View key={item.id} style={styles.listItem}>
              <View style={styles.itemLeft}>
                <View style={styles.iconCircle}>
                  <Text style={styles.iconText}>⊖</Text>
                </View>

                <View>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemSubText}>
                    {item.code} · {item.date}
                  </Text>
                </View>
              </View>

              <TouchableOpacity onPress={() => router.push("/admin/detailapproval")}>
                <Text style={styles.linkText}>Cek Detail</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* ================= DAFTAR PENGAJUAN ================= */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Daftar Pengajuan</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText} onPress={() => router.push("/admin/daftarpengajuan")}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          {submissionData.map((item) => (
            <View key={item.id} style={styles.listItem}>
              <View style={styles.itemLeft}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: getStatusColor(item.status) },
                  ]}
                />

                <View>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemSubText}>
                    {item.code} · {item.date}
                  </Text>
                </View>
              </View>

              <TouchableOpacity onPress={() => router.push("/admin/status")}>
                <Text style={styles.linkText}>Cek Status</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

/* ====================== STYLES ====================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F9FD",
  },

  header: {
    backgroundColor: "#002543",
    paddingTop: 50,
    paddingBottom: 50,
    paddingHorizontal: 20,
  },

  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  welcome: {
    fontFamily: "GeologicaRegular",
    fontSize: 13,
    color: "#FFFFFF",
  },
  username: {
    fontFamily: "GeologicaBold",
    fontSize: 18,
    color: "#FFFFFF",
    marginTop: 2,
    marginBottom: 40,
  },

  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  helpButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    marginBottom: 30,
  },
  helpIcon: { width: 14, height: 14, marginRight: 6 },
  helpText: {
    fontFamily: "GeologicaSemiBold",
    fontSize: 12,
    color: "#072A45",
  },

  notifButton: {
    backgroundColor: "#FFFFFF",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  notifIcon: { width: 18, height: 18 },

  /* ---------- CARD SECTION ---------- */
  sectionCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E6E9EC",
    marginBottom: 20,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  sectionTitle: {
    fontFamily: "GeologicaBold",
    fontSize: 18,
    color: "#072A45",
  },

  seeAllText: {
    fontFamily: "GeologicaSemiBold",
    fontSize: 13,
    color: "#072A45",
    textDecorationLine: "underline",
  },

  /* ---------- LIST ITEM ---------- */
  listItem: {
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

  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E8F4FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#D1E9FF",
  },

  iconText: {
    fontSize: 16,
    color: "#072A45",
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },

  itemTitle: {
    fontFamily: "GeologicaSemiBold",
    fontSize: 14,
    color: "#072A45",
  },

  itemSubText: {
    fontFamily: "GeologicaLight",
    fontSize: 11,
    color: "#607D8B",
    marginTop: 2,
  },

  linkText: {
    fontFamily: "GeologicaSemiBold",
    fontSize: 10,
    color: "#002543",
  },
});
