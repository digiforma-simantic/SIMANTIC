import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

// tinggi header yang dipakai untuk perhitungan posisi card
const HEADER_HEIGHT = 160;

const DetailApprovalScreen = () => {
  const router = useRouter();

  // Data approval (bisa dari API atau props)
  const approvalData = {
    requester: "Slamet Budianto",
    position: "Staff Dinas Kesehatan",
    title: "Pembaruan Aplikasi E-Kinerja Versi 2.1",
    affectedAsset: "Komputer",
    description:
      "Diperlukan pembaruan pada modul pelaporan kinerja agar sesuai dengan format terbaru dari BKN.",
    priority: "Low",
    attachmentName: "Dokumen PIR.File",
    schedule: "12 Desember 2025",
  };

  const handleNeedInfo = () => {
    console.log("Butuh Info");
  };

  const handleApprove = () => {
    console.log("Setujui");
  };

  const handleReject = () => {
    console.log("Tolak");
  };

  const handleForward = () => {
    console.log("Teruskan");
  };

  const handleDownloadFile = () => {
    console.log("Download file:", approvalData.attachmentName);
  };

return (
  <SafeAreaView style={styles.safe}>
    <StatusBar barStyle="light-content" backgroundColor="#0A2647" />

    {/* HEADER */}
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Image
          source={require("../../assets/images/backputih.png")}
          style={styles.backIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Detail Approval</Text>

      <View style={{ width: 40 }} />
    </View>

    {/* REQUESTER CARD FLOATING */}
    <View
      style={[
        styles.requesterCard,
        { top: HEADER_HEIGHT - 56 }, // floating seperti desain
      ]}
    >
      <Text style={styles.requesterName}>{approvalData.requester}</Text>
      <Text style={styles.requesterPosition}>{approvalData.position}</Text>
    </View>

    {/* SCROLL CONTENT */}
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={{
        paddingTop: HEADER_HEIGHT + 40,
        paddingHorizontal: 16,
        paddingBottom: 60, // ruang bawah agar tombol tidak nempel
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* DETAIL CARD */}
      <View style={styles.detailCard}>
        <View style={styles.detailSection}>
          <Text style={styles.detailLabel}>Judul RFC</Text>
          <Text style={styles.detailValue}>{approvalData.title}</Text>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.detailLabel}>Aset Terdampak</Text>
          <Text style={styles.detailValue}>{approvalData.affectedAsset}</Text>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.detailLabel}>Deskripsi Permintaan</Text>
          <Text style={styles.detailValue}>{approvalData.description}</Text>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.detailLabel}>Prioritas</Text>
          <Text style={styles.detailValue}>{approvalData.priority}</Text>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.detailLabel}>File Bukti</Text>
          <TouchableOpacity
            onPress={handleDownloadFile}
            style={styles.fileContainer}
            activeOpacity={0.8}
          >
            <View style={styles.fileIcon}>
              <Text style={styles.fileIconText}>📄</Text>
            </View>
            <Text style={styles.fileName}>{approvalData.attachmentName}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.detailSection, styles.detailSectionLast]}>
          <Text style={styles.detailLabel}>Jadwal</Text>
          <Text style={styles.detailValue}>{approvalData.schedule}</Text>
        </View>
      </View>

      {/* ACTION BUTTONS (ikut scroll, di bawah card) */}
      <View style={styles.actionContainer}>
        <TouchableOpacity onPress={handleNeedInfo} style={[styles.actionBtn, styles.btnInfo]}>
          <Text style={styles.actionBtnText}>Butuh Info</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleApprove} style={[styles.actionBtn, styles.btnApprove]}>
          <Text style={styles.actionBtnText}>Setujui</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleReject} style={[styles.actionBtn, styles.btnReject]}>
          <Text style={styles.actionBtnText}>Tolak</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleForward} style={[styles.actionBtn, styles.btnForward]}>
          <Text style={styles.actionBtnText}>Teruskan</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </SafeAreaView>
);
};

export default DetailApprovalScreen;

/* =========== Styles =========== */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0A2647", // warna header area
  },

  /* HEADER */
  header: {
    height: HEADER_HEIGHT,
    backgroundColor: "#0A2647",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    justifyContent: "space-between",
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  backIcon: {
    width: 22,
    height: 22,
    marginBottom: 20,
    tintColor: "#FFFFFF",
  },

  headerTitle: {
    fontFamily: "GeologicaBold",
    fontSize: 18,
    marginBottom: 20,
    color: "#FFFFFF",
    textAlign: "center",
  },

  /* Scroll area */
  scrollView: {
    flex: 1,
    backgroundColor: "#E8F2FA", // background utama di bawah header
  },

  /* Requester card - mengambang */
  requesterCard: {
    position: "absolute",
    left: 16,
    right: 16,
    // top di-set secara dinamis di runtime (lihat penggunaan di component)
    height: 92, // pakai tinggi tetap supaya perhitungan mudah
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    zIndex: 20,
    marginTop: 30,
    borderWidth: 1,
    borderColor: "#E6E9EC",
  },

  requesterName: {
    fontFamily: "GeologicaBold",
    fontSize: 16,
    color: "#0F172A",
    marginBottom: 6,
  },

  requesterPosition: {
    fontFamily: "GeologicaRegular",
    fontSize: 13,
    color: "#64748B",
  },

  /* Detail card */
  detailCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    // beri marginTop agar detailCard mulai sedikit di bawah requester card
    marginTop: -140,
    borderWidth: 1,
    borderColor: "#E6E9EC",
  },

  detailSection: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  detailSectionLast: {
    marginBottom: 0,
    paddingBottom: 0,
    borderBottomWidth: 0,
  },

  detailLabel: {
    fontFamily: "GeologicaBold",
    fontSize: 14,
    color: "#0F172A",
    marginBottom: 8,
  },

  detailValue: {
    fontFamily: "GeologicaRegular",
    fontSize: 14,
    color: "#64748B",
    lineHeight: 22,
  },

  /* File */
  fileContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  fileIcon: {
    width: 32,
    height: 32,
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  fileIconText: {
    fontSize: 18,
  },

  fileName: {
    fontFamily: "GeologicaMedium",
    fontSize: 14,
    color: "#475569",
    flex: 1,
  },

  /* ACTIONS (fixed bottom) */
actionContainer: {
  flexDirection: "row",
  marginTop: 2,
  marginBottom: 40,
},

  actionBtn: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginHorizontal: 6,
  },

  btnInfo: {
    backgroundColor: "#2563EB", // biru
  },

  btnApprove: {
    backgroundColor: "#10B981", // hijau
  },

  btnReject: {
    backgroundColor: "#DC2626", // merah
  },

  btnForward: {
    backgroundColor: "#F97316", // orange
  },

  actionBtnText: {
    fontFamily: "GeologicaSemiBold",
    fontSize: 13,
    color: "#FFFFFF",
  },
});
