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
  const statusData = [
    { id: 1, status: "success" },
    { id: 2, status: "failed" },
    { id: 3, status: "progress" },
    { id: 4, status: "progress" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "#00C853";
      case "failed":
        return "#D50000";
      case "progress":
        return "#2979FF";
      default:
        return "#9E9E9E";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#002543" />

      {/* ✅ SEMUA KONTEN DISATUKAN DALAM SCROLL */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 160, // ✅ JARAK AMAN DARI NAVBAR
        }}
      >
        {/* ================= HEADER ================= */}
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <View>
              <Text style={styles.welcome}>Selamat Datang,</Text>
              <Text style={styles.username}>Slamet Budianto</Text>
            </View>

            <View style={styles.actionContainer}>
              <TouchableOpacity 
                  style={styles.helpButton}
                  onPress={() => router.push("/staff/bantuan")}
              >
                <Image
                  source={require("../../assets/images/bantuan.png")}
                  style={styles.helpIcon}
                />
                <Text style={styles.helpText}>Bantuan</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.notifButton}
                onPress={() => router.push("/staff/notifikasi")}
              >
                <Image
                  source={require("../../assets/images/notifikasi.png")}
                  style={styles.notifIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ================= STATUS CARD ================= */}
        <View style={styles.statusCard}>
          <Text style={styles.sectionTitle}>Status Perubahan</Text>

          <View style={styles.statusRow}>
            <View style={styles.statusBox}>
              <Text style={styles.statusLabel}>Proses</Text>
              <Text style={styles.statusValue}>3</Text>
            </View>

            <View style={styles.statusBox}>
              <Text style={styles.statusLabel}>Gagal</Text>
              <Text style={styles.statusValue}>2</Text>
            </View>

            <View style={styles.statusBox}>
              <Text style={styles.statusLabel}>Sukses</Text>
              <Text style={styles.statusValue}>6</Text>
            </View>
          </View>
        </View>

        {/* ================= CONTENT ================= */}
        <View style={styles.content}>
          <View style={styles.monitorCard}>
            <Text style={styles.sectionTitle}>Pantau Status</Text>

            {statusData.map((item) => (
              <View key={item.id} style={styles.statusItem}>
                <View style={styles.statusLeft}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: getStatusColor(item.status) },
                    ]}
                  />
                  <View>
                    <Text style={styles.statusTitleText}>
                      Install Aplikasi Kerja
                    </Text>
                    <Text style={styles.statusSubText}>
                      #0001 · 17 Agustus 2025
                    </Text>
                  </View>
                </View>

                <TouchableOpacity onPress={() => router.push("/staff/status")}>
                  <Text style={styles.checkStatus}>Cek Status</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* ❌ TIDAK ADA <BottomNav /> DI SINI */}
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
  helpText: { fontSize: 12, color: "#072A45" },

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

  statusCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: -60,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E6E9EC",
  },

  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },

  statusBox: {
    flex: 1,
    backgroundColor: "#F4FAFF",
    marginHorizontal: 6,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E6E9EC",
  },

  statusLabel: {
    fontFamily: "GeologicaSemiBold",
    fontSize: 12,
    marginBottom: -12,
    color: "#607D8B",
  },

  statusValue: {
    fontFamily: "GeologicaBold",
    fontSize: 26,
    color: "#072A45",
    marginTop: 8,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  monitorCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E6E9EC",
  },

  sectionTitle: {
    fontFamily: "GeologicaBold",
    fontSize: 18,
    color: "#072A45",
  },

  statusItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F4FAFF",
    borderRadius: 12,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#E6E9EC",
  },

  statusLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },

  statusTitleText: {
    fontFamily: "GeologicaSemiBold",
    fontSize: 14,
    color: "#072A45",
  },

  statusSubText: {
    fontFamily: "GeologicaLight",
    fontSize: 11,
    color: "#607D8B",
    marginTop: 2,
  },

  checkStatus: {
    fontFamily: "GeologicaSemiBold",
    fontSize: 12,
    color: "#072A45",
  },
});
