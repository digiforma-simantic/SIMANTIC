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

  // DATA APPROVAL
  const approvalData = [
    {
      id: 1,
      level: "Compliance",
      title: "Dinas Kehutanan",
      date: "Q4 2025",
    },
    {
      id: 2,
      level: "Non-Compliance",
      title: "Dinas Kesehatan",
      date: "Q1 2025",
    },
    {
      id: 3,
      level: "Compliance",
      title: "Dinas Pendidikan",
      date: "Q1 2025",
    },
    {
      id: 4,
      level: "Compliance",
      title: "Dinas Pendidikan",
      date: "Q2 2025",
    },
  ];

  /* HELPERS */
  const getBadgeStyle = (level: string) => {
    if (level === "Compliance") {
      return styles.badgeGreen;
    }
    return styles.badgeRed;
  };

  const getBadgeTextStyle = (level: string) => {
    if (level === "Compliance") {
      return styles.badgeTextGreen;
    }
    return styles.badgeTextRed;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#002543" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        {/* ================= HEADER ================= */}
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <View>
              <Text style={styles.welcome}>Selamat Datang,</Text>
              <Text style={styles.username}>Sudarsono</Text>
            </View>

            <View style={styles.actionContainer}>
              {/* Bantuan */}
              <TouchableOpacity
                style={styles.helpButton}
                onPress={() => router.push("/auditor/bantuan")}
              >
                <Image
                  source={require("../../assets/images/bantuan.png")}
                  style={styles.helpIcon}
                />
                <Text style={styles.helpText}>Bantuan</Text>
              </TouchableOpacity>

              {/* Notifikasi */}
              <TouchableOpacity
                style={styles.notifButton}
                onPress={() => router.push("/auditor/notifikasi")}
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
          <Text style={styles.sectionTitle}>Status Approval</Text>

          <View style={styles.statusRow}>
            <View style={styles.statusBox}>
              <Text style={styles.statusLabel}>Compli..</Text>
              <Text style={styles.statusValue}>2</Text>
            </View>

            <View style={styles.statusBox}>
              <Text style={styles.statusLabel}>Non-Co..</Text>
              <Text style={styles.statusValue}>4</Text>
            </View>

            <View style={styles.statusBox}>
              <Text style={styles.statusLabel}>Total</Text>
              <Text style={styles.statusValue}>6</Text>
            </View>
          </View>
        </View>

        {/* ================= RIWAYAT LAPORAN ================= */}
        <View style={styles.content}>
          <View style={styles.approvalCard}>
            <View style={styles.titleRow}>
              <Text style={styles.sectionTitle}>
                Riwayat Laporan Audit
              </Text>

              <TouchableOpacity
                onPress={() =>
                  router.push("/auditor/daftarriwayat")
                }
              >
                <Text style={styles.seeAllText}>
                  Lihat Semua
                </Text>
              </TouchableOpacity>
            </View>

            {/* LIST ITEM */}
            {approvalData.map((item) => (
              <View key={item.id} style={styles.approvalItem}>
                {/* BADGE LEVEL */}
                <View
                  style={[
                    styles.levelBadge,
                    getBadgeStyle(item.level),
                  ]}
                >
                  <Text
                    style={[
                      styles.levelBadgeText,
                      getBadgeTextStyle(item.level),
                    ]}
                  >
                    {item.level}
                  </Text>
                </View>

                {/* TITLE + DETAIL */}
                <View style={styles.rowBetween}>
                  <Text style={styles.itemTitle}>
                    {item.title}
                  </Text>

                  <TouchableOpacity
                    onPress={() =>
                      router.push("/auditor/detaillaporan")
                    }
                  >
                    <Text style={styles.detailText}>
                      Cek Detail
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* SUBTEXT DATE */}
                <Text style={styles.itemSub}>
                  {item.date}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ======================= STYLES ======================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F9FD",
  },

  /* ---------------- HEADER ---------------- */
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
    fontSize: 12,
    color: "#072A45",
    fontFamily: "GeologicaSemiBold",
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

  /* ---------------- STATUS CARD ---------------- */
  statusCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: -60,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E6E9EC",
  },

  sectionTitle: {
    fontFamily: "GeologicaBold",
    fontSize: 18,
    color: "#072A45",
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
    color: "#607D8B",
  },

  statusValue: {
    fontFamily: "GeologicaBold",
    fontSize: 26,
    color: "#072A45",
    marginTop: 8,
  },

  /* ---------------- CONTENT ---------------- */
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  approvalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E6E9EC",
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  seeAllText: {
    fontFamily: "GeologicaSemiBold",
    fontSize: 13,
    color: "#072A45",
    textDecorationLine: "underline",
  },

  /* ---------------- LIST ITEM ---------------- */
  approvalItem: {
    backgroundColor: "#F4FAFF",
    borderRadius: 12,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#E6E9EC",
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },

  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 6,
  },

  badgeGreen: {
    backgroundColor: "#E6F7EE",
  },

  badgeRed: {
    backgroundColor: "#FBEAEA",
  },

  levelBadgeText: {
    fontFamily: "GeologicaSemiBold",
    fontSize: 11,
  },

  badgeTextGreen: {
    color: "#00A650",
  },

  badgeTextRed: {
    color: "#D32F2F",
  },

  itemTitle: {
    fontFamily: "GeologicaSemiBold",
    fontSize: 14,
    color: "#072A45",
    flex: 1,
  },

  detailText: {
    fontFamily: "GeologicaSemiBold",
    fontSize: 12,
    color: "#072A45",
  },

  itemSub: {
    fontFamily: "GeologicaLight",
    fontSize: 11,
    color: "#607D8B",
  },
});
