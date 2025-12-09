import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Image,
  ScrollView,
  TextInput,
  Alert,
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
  };

  // ============================
  //   STATE FORM INPUT USER
  // ============================
  const [ciCode, setCiCode] = useState("");
  const [version, setVersion] = useState("");
  const [os, setOs] = useState("");
  const [ip, setIp] = useState("");
  const [relationship, setRelationship] = useState("");
  const [owner, setOwner] = useState(""); // <-- added new state

  // ============================
  //   HANDLE SUBMIT
  // ============================
  const handleSubmit = () => {
    if (!ciCode || !version || !os || !ip || !relationship || !owner) {
      Alert.alert("Gagal", "Semua field wajib diisi!");
      return;
    }

    Alert.alert("Sukses", "Data aset berhasil disimpan!");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A2647" />

      {/* HEADER */}
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

      {/* FLOATING CARD */}
      <View style={styles.floatingCardWrapper}>
        <View style={styles.nameCard}>
          <Text style={styles.assetName}>{assetData.name}</Text>
          <Text style={styles.assetCode}>{assetData.code}</Text>
        </View>
      </View>

      {/* CONTENT */}
      <ScrollView
        style={styles.contentBackground}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* STATIC INFO */}
        <View style={styles.infoCard}>
          <InfoRow label="Penanggungjawab" value={assetData.pic} />
          <InfoRow label="Status Aset" value={assetData.status} />
          <InfoRow label="Kategori Aset" value={assetData.category} />
          <InfoRow label="Lokasi Aset" value={assetData.location} />
          <InfoRow label="Risiko" value={assetData.risk} isLast />
        </View>

        {/* INPUT CARD */}
        <View style={styles.infoCard}>

          {/* CI CODE */}
          <Text style={styles.inputLabel}>CI Code</Text>
          <TextInput
            style={styles.inputBox}
            placeholder="Masukkan CI Code"
            value={ciCode}
            onChangeText={setCiCode}
          />

          {/* Versi */}
          <Text style={styles.inputLabel}>Versi</Text>
          <TextInput
            style={styles.inputBox}
            placeholder="Masukkan Versi"
            value={version}
            onChangeText={setVersion}
          />

          {/* OS */}
          <Text style={styles.inputLabel}>OS (Operation System)</Text>
          <TextInput
            style={styles.inputBox}
            placeholder="Masukkan Sistem Operasi"
            value={os}
            onChangeText={setOs}
          />

          {/* IP Address */}
          <Text style={styles.inputLabel}>IP Address</Text>
          <TextInput
            style={styles.inputBox}
            placeholder="Masukkan IP Address"
            value={ip}
            onChangeText={setIp}
          />

          {/* Relasi Antar Aset */}
          <Text style={styles.inputLabel}>Relasi Antar Aset</Text>
          <TextInput
            style={[styles.inputBox, { height: 100, textAlignVertical: "top" }]}
            placeholder="Masukkan hubungan antar aset"
            value={relationship}
            onChangeText={setRelationship}
            multiline
          />

          {/* Pemilik Aset */}
          <Text style={styles.inputLabel}>Pemilik Aset</Text>
          <TextInput
            style={styles.inputBox}
            placeholder="Masukkan Pemilik Aset"
            value={owner}
            onChangeText={setOwner}
          />

        </View>

        {/* SPACER */}
        <View style={{ height: 20 }} />

        {/* BUTTON KIRIM */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Kirim</Text>
        </TouchableOpacity>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// =========================
//   STATIC INFO COMPONENT
// =========================
type InfoRowProps = {
  label: string;
  value: string;
  isLast?: boolean;
};

const InfoRow = ({ label, value, isLast = false }: InfoRowProps) => {
  return (
    <View style={[styles.infoRow, !isLast && styles.infoRowBorder]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
};

// =========================
//   STYLES
// =========================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A2647",
  },

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
    tintColor: "#FFF",
    marginTop: 30,
  },

  headerTitle: {
    fontFamily: "GeologicaBold",
    fontSize: 20,
    marginTop: 30,
    color: "#FFFFFF",
  },

  floatingCardWrapper: {
    position: "absolute",
    top: 110,
    left: 0,
    right: 0,
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
  },

  assetCode: {
    fontFamily: "GeologicaRegular",
    fontSize: 14,
    color: "#94A3B8",
  },

  contentBackground: {
    flex: 1,
    backgroundColor: "#E8F2FA",
    marginTop: 80,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 60,
  },

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

  // INPUT
  inputLabel: {
    marginTop: 10,
    fontFamily: "GeologicaBold",
    fontSize: 14,
    color: "#0F172A",
  },

  inputBox: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
    fontFamily: "GeologicaRegular",
    fontSize: 14,
  },

  submitButton: {
    alignSelf: "center",
    backgroundColor: "#0A2647",
    paddingVertical: 14,
    width: "60%",
    borderRadius: 12,
  },

  submitText: {
    color: "#FFF",
    textAlign: "center",
    fontFamily: "GeologicaBold",
    fontSize: 16,
  },
});

export default DetailAsetScreen;
