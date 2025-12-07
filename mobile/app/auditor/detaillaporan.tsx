import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

const DetailLaporanAuditScreen = () => {
  const router = useRouter();

  const auditData = {
    period: "Q4 2025",
    institution: "Dinas Kehutanan",
    status: "Compliance",
    note:
      "Proses change sudah sesuai SOP, tidak ada temuan mayor.",
    fileName: "DinasKehutanan-Q4-2025.pdf",
    fileSize: "3.45 MB",
  };

  const handleViewFile = () => {
    console.log("Lihat file:", auditData.fileName);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2FAFF" />

      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Detail Laporan Audit
        </Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ===== INFO CARD ===== */}
        <View style={styles.infoCard}>
          <View style={styles.infoLeft}>
            <Text style={styles.infoLabel}>
              Periode Audit
            </Text>
            <Text style={styles.infoPeriod}>
              {auditData.period}
            </Text>

            <Text style={styles.infoOrg}>
              {auditData.institution}
            </Text>
          </View>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {auditData.status}
            </Text>
          </View>
        </View>

        {/* ===== DETAIL CARD ===== */}
        <View style={styles.detailCard}>
          {/* Catatan */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Catatan Auditor
            </Text>
            <Text style={styles.sectionText}>
              {auditData.note}
            </Text>
          </View>

          {/* Lampiran */}
          <View style={[styles.section, { borderBottomWidth: 0 }]}>
            <Text style={styles.sectionTitle}>
              Lampiran Dokumen Auditor
            </Text>

            <View style={styles.fileBox}>
              <View style={styles.fileInfo}>
                <Text style={styles.fileName}>
                  {auditData.fileName}
                </Text>
                <Text style={styles.fileSize}>
                  {auditData.fileSize}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.viewButton}
                onPress={handleViewFile}
              >
                <Text style={styles.viewButtonText}>
                  Lihat
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailLaporanAuditScreen;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2FAFF",
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 60,
  },

  backIcon: {
    fontSize: 24,
    color: "#0F172A",
  },

  headerTitle: {
    fontFamily: "GeologicaBold",
    fontSize: 18,
    color: "#0F172A",
  },

  scrollContent: {
    paddingHorizontal: 16,
  },

  /* INFO CARD */
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#00B227",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  infoLeft: {
    flex: 1,
  },

  infoLabel: {
    fontFamily: "GeologicaRegular",
    fontSize: 13,
    color: "#64748B",
    marginBottom: 2,
  },

  infoPeriod: {
    fontFamily: "GeologicaBold",
    fontSize: 16,
    color: "#0F172A",
    marginBottom: 6,
  },

  infoOrg: {
    fontFamily: "GeologicaBold",
    fontSize: 14,
    color: "#0F172A",
  },

  badge: {
    borderWidth: 1,
    borderColor: "#00B227",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  badgeText: {
    fontFamily: "GeologicaSemiBold",
    fontSize: 13,
    color: "#00B227",
  },

  /* DETAIL CARD */
  detailCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E6E9EC",
  },

  section: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  sectionTitle: {
    fontFamily: "GeologicaBold",
    fontSize: 14,
    color: "#0F172A",
    marginBottom: 8,
  },

  sectionText: {
    fontFamily: "GeologicaRegular",
    fontSize: 14,
    color: "#64748B",
    lineHeight: 22,
  },

  /* FILE BOX */
  fileBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
  },

  fileInfo: {
    flex: 1,
  },

  fileName: {
    fontFamily: "GeologicaMedium",
    fontSize: 14,
    color: "#0F172A",
  },

  fileSize: {
    fontFamily: "GeologicaRegular",
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },

  viewButton: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },

  viewButtonText: {
    fontFamily: "GeologicaMedium",
    fontSize: 12,
    color: "#0F172A",
  },
});
