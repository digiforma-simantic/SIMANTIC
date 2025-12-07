import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import Svg, { Circle, Line } from "react-native-svg";
import { useRouter } from "expo-router";

export default function StatusPage() {
  const router = useRouter();

  // ==== API EXAMPLE ====
  const progressData = [
    { title: "Permintaan Diajukan", desc: "Pengguna mengajukan instalasi" },
    { title: "Ditinjau Kepala Seksi", desc: "Permintaan sedang ditinjau" },
    { title: "Validasi Kepala Seksi", desc: "Permintaan telah divalidasi" },
    { title: "Ditinjau Kepala Bidang", desc: "Permintaan sedang ditinjau" },
    { title: "Validasi Kepala Bidang", desc: "Permintaan telah divalidasi" },
    { title: "Ditinjau Kepala Dinas", desc: "Permintaan sedang ditinjau" },
    { title: "Validasi Kepala Dinas", desc: "Permintaan telah divalidasi" },
    { title: "Ditinjau Diskominfo", desc: "Permintaan sedang ditinjau" },
    { title: "Diimplementasi Diskominfo", desc: "Permintaan telah diimplementasi" },
    { title: "Selesai", desc: "Proses telah selesai" },
  ];

  // progress saat ini (index)
  const currentStep = 5; // contoh: baru sampai "Ditinjau Kepala Dinas"

  // === Status Card Logic ===
  let statusTitle = "Sukses!";
  let statusIcon = require("../../assets/images/sukses.png");
  if (currentStep < progressData.length - 1) {
    statusTitle = "Proses";
    statusIcon = require("../../assets/images/proses.png");
  }

  return (
    <View style={styles.container}>

      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={require("../../assets/images/backputih.png")} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Status</Text>
      </View>

      {/* ============= FLOATING STATUS CARD ============= */}
      <View style={styles.statusCard}>
        <Image source={statusIcon} style={styles.statusIcon} />
        <Text style={styles.statusHeading}>Instal Aplikasi Kerja</Text>
        <Text style={styles.statusSub}>{statusTitle}</Text>
      </View>

      {/* =================== CONTENT AREA =================== */}
      <View style={styles.body}>

        {/* ----------- Box Progress ----------- */}
        <View style={styles.progressBox}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Progres</Text>
            <View>
              <Text style={styles.codeLabel}>#0001</Text>
              <Text style={styles.dateLabel}>17 Agustus 2025</Text>
            </View>
          </View>

          <View style={styles.innerWhiteBox}>
            {/* Scrollable Timeline */}
            <ScrollView style={{ maxHeight: 350 }} showsVerticalScrollIndicator={false}>
              {progressData.map((item, index) => {
                const active = index <= currentStep;
                return (
                  <View key={index} style={styles.timelineRow}>
                    {/* ICON + LINE */}
                    <View style={styles.timelineLeft}>
                      <Svg height="70" width="30">
                        {/* Garis */}
                        {index !== progressData.length - 1 && (
                          <Line
                            x1="15"
                            y1="35"
                            x2="15"
                            y2="70"
                            stroke={active ? "#1E88E5" : "#B0C4DE"}
                            strokeWidth="2"
                          />
                        )}

                        {/* Lingkaran */}
                        <Circle
                          cx="15"
                          cy="20"
                          r="12"
                          stroke={active ? "#1E88E5" : "#B0C4DE"}
                          strokeWidth="2"
                          fill="white"
                        />
                      </Svg>
                    </View>

                    {/* TEXT */}
                    <View>
                      <Text style={[styles.timelineTitle, active && { color: "#003366" }]}>
                        {item.title}
                      </Text>
                      <Text style={styles.timelineDesc}>{item.desc}</Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2FAFF" },

  /* ================= HEADER ================= */
  header: {
    height: 220,
    backgroundColor: "#002F5F",
    paddingTop: 50,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backIcon: { width: 28, height: 28, tintColor: "white", marginTop: -74, zIndex: 10, padding: 10,},
headerTitle: {
  position: "absolute",
  left: 0,
  right: 0,
  textAlign: "center",
  color: "white",
  fontSize: 20,
  marginTop: -70,
  fontWeight: "700",
},

  /* ============= STATUS FLOAT CARD ============= */
  statusCard: {
    position: "absolute",
    top: 100,
    alignSelf: "center",
    width: "88%",
    backgroundColor: "white",
    borderColor: "#E6E9EC",
    borderWidth: 1,
    paddingVertical: 25,
    borderRadius: 15,
    marginTop: 10,
    alignItems: "center",
  },
  statusIcon: { width: 60, height: 60, marginBottom: 8 },
  statusHeading: { fontSize: 18, fontWeight: "700", color: "#002F5F" },
  statusSub: { fontSize: 14, marginTop: 4, color: "#4A4A4A" },

  /* =============== BODY CONTENT =============== */
  body: {
    marginTop: 170,
    paddingHorizontal: 20,
  },

  /* ========= Progress Box ========= */
  progressBox: {
    backgroundColor: "#FAFDFF",
    padding: 20,
    borderRadius: 16,
    marginTop: -100,
    borderColor: "#E6E9EC",
    borderWidth: 1,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  progressTitle: { fontSize: 18, fontWeight: "700", color: "#003366" },
  codeLabel: { textAlign: "right", fontSize: 12, color: "#003366" },
  dateLabel: { fontSize: 12, color: "#003366" },

  /* ========= Inner white timeline box ========= */
  innerWhiteBox: {
    backgroundColor: "#F2FAFF",
    borderColor: "#E6E9EC",
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
  },

  /* Timeline rows */
  timelineRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  timelineLeft: {
    width: 40,
    alignItems: "center",
  },
  timelineTitle: { fontSize: 15, fontWeight: "600", color: "#4A4A4A" },
  timelineDesc: { fontSize: 12, color: "#7A7A7A" },
});

