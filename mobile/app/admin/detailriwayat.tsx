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
} from "react-native";
import { useRouter } from "expo-router";

const DetailApprovalScreen = () => {
  const router = useRouter();

  // Data approval (bisa dari API atau props)
  const approvalData = {
    id: "#0001",
    requester: "Slamet Budianto",
    title: "Pembaruan Aplikasi E-Kinerja Versi 2.1",
    affectedAsset: "Komputer",
    description:
      "Diperlukan pembaruan pada modul pelaporan kinerja agar sesuai dengan format terbaru dari BKN.",
    priority: "Low",
    attachmentName: "Dokumen PIR.File",
    schedule: "12 Desember 2025",
    technician: "Ardiyanto",
  };

  const handleReject = () => {
    console.log("Approval diteruskan");
    // Tambahkan logika untuk reject
  };

  const handleDownloadFile = () => {
    console.log("Download file:", approvalData.attachmentName);
    // Tambahkan logika untuk download file
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Detail Riwayat Approval</Text>

        <View style={{ width: 40 }} />
      </View>

      {/* ================= CONTENT WITH SCROLL ================= */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ================= REQUESTER CARD ================= */}
        <View style={styles.requesterCard}>
          <View style={styles.requesterInfo}>
            <Text style={styles.requesterId}>{approvalData.id}</Text>
            <Text style={styles.requesterName}>{approvalData.requester}</Text>
          </View>

          <TouchableOpacity onPress={handleReject} style={styles.rejectButton}>
            <Text style={styles.rejectButtonText}>Diteruskan</Text>
          </TouchableOpacity>
        </View>

        {/* ================= DETAIL CARD ================= */}
        <View style={styles.detailCard}>
          {/* Judul RFC */}
          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>Judul RFC</Text>
            <Text style={styles.detailValue}>{approvalData.title}</Text>
          </View>

          {/* Aset Terdampak */}
          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>Aset Terdampak</Text>
            <Text style={styles.detailValue}>{approvalData.affectedAsset}</Text>
          </View>

          {/* Deskripsi Permintaan */}
          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>Deskripsi Permintaan</Text>
            <Text style={styles.detailValue}>{approvalData.description}</Text>
          </View>

          {/* Prioritas */}
          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>Prioritas</Text>
            <Text style={styles.detailValue}>{approvalData.priority}</Text>
          </View>

          {/* File Bukti */}
          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>File Bukti</Text>
            <TouchableOpacity
              onPress={handleDownloadFile}
              style={styles.fileContainer}
            >
              <View style={styles.fileIcon}>
                <Text style={styles.fileIconText}>📄</Text>
              </View>
              <Text style={styles.fileName}>{approvalData.attachmentName}</Text>
            </TouchableOpacity>
          </View>

          {/* Jadwal */}
          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>Jadwal</Text>
            <Text style={styles.detailValue}>{approvalData.schedule}</Text>
          </View>

          {/* Teknisi */}
          <View style={[styles.detailSection, styles.detailSectionLast]}>
            <Text style={styles.detailLabel}>Teknisi</Text>
            <Text style={styles.detailValue}>{approvalData.technician}</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailApprovalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2FAFF",
  },

  /* ================= HEADER ================= */
  header: {
    backgroundColor: "#F2FAFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 60,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  backIcon: {
    fontSize: 24,
    color: "#1A1A1A",
  },

  headerTitle: {
    fontFamily: "GeologicaBold",
    fontSize: 18,
    color: "#0F172A",
  },

  /* ================= SCROLL VIEW ================= */
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  /* ================= REQUESTER CARD ================= */
  requesterCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#FF6600",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  requesterInfo: {
    flex: 1,
  },

  requesterId: {
    fontFamily: "GeologicaRegular",
    fontSize: 14,
    color: "#64748B",
    marginBottom: 4,
  },

  requesterName: {
    fontFamily: "GeologicaBold",
    fontSize: 16,
    color: "#0F172A",
  },

  rejectButton: {
    borderWidth: 1,
    borderColor: "#FF6600",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },

  rejectButtonText: {
    fontFamily: "GeologicaSemiBold",
    fontSize: 14,
    color: "#FF6600",
  },

  /* ================= DETAIL CARD ================= */
  detailCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
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

  /* ================= FILE SECTION ================= */
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
});