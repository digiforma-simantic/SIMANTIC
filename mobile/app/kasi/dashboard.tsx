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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 160,
        }}
      >
        {/* ================= HEADER ================= */}
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <View>
              <Text style={styles.welcome}>Selamat Datang,</Text>
              <Text style={styles.username}>Sri Permatasari</Text>
            </View>

            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={styles.helpButton}
                onPress={() => router.push("/kasi/bantuan")}
              >
                <Image
                  source={require("../../assets/images/bantuan.png")}
                  style={styles.helpIcon}
                />
                <Text style={styles.helpText}>Bantuan</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.notifButton}
                onPress={() => router.push("/kasi/notifikasi")}
              >
                <Image
                  source={require("../../assets/images/notifikasi.png")}
                  style={styles.notifIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        /* ================= STATUS APPROVAL CARD ================= */
        <View style={styles.statusCard}>
        <Text style={styles.sectionTitle}>Status Approval</Text>

        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statusRow}
        >
            <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>Ditunggu</Text>
            <Text style={styles.statusValue}>2</Text>
            </View>

            <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>Disetujui</Text>
            <Text style={styles.statusValue}>4</Text>
            </View>

            <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>Ditolak</Text>
            <Text style={styles.statusValue}>1</Text>
            </View>

            <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>Diteruskan</Text>
            <Text style={styles.statusValue}>0</Text>
            </View>
        </ScrollView>
        </View>

        {/* ================= CONTENT ================= */}
        <View style={styles.content}>
          {/* DAFTAR APPROVAL */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Daftar Approval</Text>
              <TouchableOpacity onPress={() => router.push("/kasi/daftarapproval")}>
                <Text style={styles.seeAllText}>Lihat Semua</Text>
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

                <TouchableOpacity
                onPress={() => router.push("/kasi/detailapproval")}
                >
                <Text style={styles.linkText}>Cek Detail</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* DAFTAR PENGAJUAN */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Daftar Pengajuan</Text>
              <TouchableOpacity onPress={() => router.push("/kasi/daftarpengajuan")}>
                <Text style={styles.seeAllText}>Lihat Semua</Text>
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

                <TouchableOpacity
                onPress={() => router.push("/kasi/status")}
                >
                <Text style={styles.linkText}>Cek Status</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
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
  helpText: { 
    fontFamily: "GeologicaSemiBold",
    fontSize: 12, 
    color: "#072A45" 
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
  gap: 12,
  marginTop: 16,
},

statusBox: {
  width: 110,          // ✅ tidak dipaksa flex 1
  backgroundColor: "#F4FAFF",
  paddingVertical: 16,
  borderRadius: 12,
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#E6E9EC",
},

  statusLabel: {
    fontFamily: "GeologicaSemiBold",
    fontSize: 11,
    color: "#607D8B",
    marginBottom: 4,
  },

  statusValue: {
    fontFamily: "GeologicaBold",
    fontSize: 24,
    color: "#072A45",
    marginTop: 4,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E6E9EC",
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

detailButton: {
  paddingHorizontal: 0,
  paddingVertical: 0,
  backgroundColor: "transparent",
},

  detailButtonText: {
    fontFamily: "GeologicaSemiBold",
    fontSize: 12,
    color: "#072A45",
  },

statusButton: {
  paddingHorizontal: 0,
  paddingVertical: 0,
  backgroundColor: "transparent",
},

linkText: {
  fontFamily: "GeologicaSemiBold",
  fontSize: 10,
  color: "#002543",
},

  statusButtonText: {
    fontFamily: "GeologicaSemiBold",
    fontSize: 12,
    color: "#072A45",
  },
});