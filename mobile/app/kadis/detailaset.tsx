import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Image,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

const DetailAsetScreen = () => {
  const router = useRouter();

  const assetData = {
    name: "Laptop M-25-001",
    code: "#AHT-LPT-2025-001",
    pic: "Suhandoyo",
    status: "Aktif",
    category: "Hardware",
    location: "Gedung A, Lantai 5, Area Karyawan",
    risk: "Low",
    ciCode: "CI-000245",
    version: "Firmware BIOS v1.14.2",
    os: "Windows 11 Pro 64-bit",
    ipAddress: "10.10.5.123",
    relationship:
      "Laptop Karyawan M-25-001 terhubung ke Server Active Directory dan Printer Jaringan Lantai 5",
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A2647" />

      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Image
            source={require("../../assets/images/backputih.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Detail Aset</Text>

        <View style={{ width: 40 }} />
      </View>

      {/* ===== FLOATING CARD (ABSOLUTE) ===== */}
      <View style={styles.floatingCardWrapper}>
        <View style={styles.nameCard}>
          <Text style={styles.assetName}>{assetData.name}</Text>
          <Text style={styles.assetCode}>{assetData.code}</Text>
        </View>
      </View>

      {/* ===== CONTENT AREA ===== */}
      <ScrollView
        style={styles.contentBackground}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* INFO CARD 1 */}
        <View style={styles.infoCard}>
          <InfoRow label="Penanggungjawab" value={assetData.pic} />
          <InfoRow label="Status Aset" value={assetData.status} />
          <InfoRow label="Kategori Aset" value={assetData.category} />
          <InfoRow label="Lokasi Aset" value={assetData.location} />
          <InfoRow label="Risiko" value={assetData.risk} isLast />
        </View>

        {/* INFO CARD 2 */}
        <View style={styles.infoCard}>
          <InfoRow label="CI Code" value={assetData.ciCode} />
          <InfoRow label="Versi" value={assetData.version} />
          <InfoRow label="OS (Operation System)" value={assetData.os} />
          <InfoRow label="IP Address" value={assetData.ipAddress} />
          <InfoRow label="Relasi Antar Aset" value={assetData.relationship} isLast multiline />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

type InfoRowProps = {
  label: string;
  value: string;
  isLast?: boolean;
  multiline?: boolean;
};

const InfoRow = ({ label, value, isLast = false, multiline = false }: InfoRowProps) => {
  return (
    <View style={[styles.infoRow, !isLast && styles.infoRowBorder]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, multiline && styles.infoValueMultiline]}>
        {value}
      </Text>
    </View>
  );
};

export default DetailAsetScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A2647",
  },

  /* ===== HEADER ===== */
  header: {
    backgroundColor: "#0A2647",
    paddingHorizontal: 16,
    paddingVertical: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  backIcon: {
    width: 26,
    height: 26,
    marginTop: 30,
    tintColor: "#FFF",
  },

  headerTitle: {
    fontFamily: "GeologicaBold",
    fontSize: 20,
    marginTop: 30,
    color: "#FFFFFF",
  },

  /* ===== FLOATING CARD ===== */
  floatingCardWrapper: {
    position: "absolute",
    top: 110,           // POSISI DI ANTARA HEADER & BACKGROUND PUTIH
    left: 0,
    right: 0,
    marginTop: 20,
    alignItems: "center",
    zIndex: 999,
  },

  nameCard: {
    width: "92%",
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E6E9EC",
  },

  assetName: {
    fontFamily: "GeologicaBold",
    fontSize: 18,
    color: "#0F172A",
    marginBottom: 4,
  },

  assetCode: {
    fontFamily: "GeologicaRegular",
    fontSize: 14,
    color: "#94A3B8",
  },

  /* ===== WHITE BACKGROUND CONTENT ===== */
  contentBackground: {
    flex: 1,
    backgroundColor: "#E8F2FA",
    marginTop: 80,   // MEMBERI SPASI DI BAWAH CARD, AGAR TIDAK TERTUTUP
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 60, // AGAR INFO CARD TIDAK NANGKUT CARD MENGAMBANG
  },

  /* ===== INFO CARD ===== */
  infoCard: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E6E9EC",
    marginBottom: 16,
  },

  infoRow: {
    paddingVertical: 12,
  },

  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },

  infoLabel: {
    fontFamily: "GeologicaBold",
    fontSize: 14,
    color: "#0F172A",
  },

  infoValue: {
    fontFamily: "GeologicaRegular",
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
  },

  infoValueMultiline: {
    lineHeight: 22,
  },
});
