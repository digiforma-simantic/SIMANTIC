import React, { useState } from "react";
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
import { Picker } from "@react-native-picker/picker";

const HEADER_HEIGHT = 160;

const DetailApprovalScreen = () => {
  const router = useRouter();
  const [selectedTeknisi, setSelectedTeknisi] = useState("");

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

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0A2647" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={require("../../assets/images/backputih.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Detail Pengajuan</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* REQUESTER FLOATING CARD */}
      <View style={[styles.requesterCard, { top: HEADER_HEIGHT - 40 }]}>
        <Text style={styles.requesterName}>
          {approvalData.requester}
        </Text>
        <Text style={styles.requesterPosition}>
          {approvalData.position}
        </Text>
      </View>

      {/* CONTENT */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT + 30,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.detailCard}>
          <Item label="Judul RFC" value={approvalData.title} />
          <Item label="Aset Terdampak" value={approvalData.affectedAsset} />
          <Item
            label="Deskripsi Permintaan"
            value={approvalData.description}
          />
          <Item label="Prioritas" value={approvalData.priority} />

          {/* FILE BUKTI */}
          <View style={styles.section}>
            <Text style={styles.textBold}>File Bukti</Text>

            <TouchableOpacity style={styles.fileContainer}>
              <Text style={styles.fileIcon}>📄</Text>
              <Text style={styles.fileName}>
                {approvalData.attachmentName}
              </Text>
            </TouchableOpacity>
          </View>

          <Item label="Jadwal" value={approvalData.schedule} />

          {/* TEKNISI */}
          <View style={[styles.section, { borderBottomWidth: 0 }]}>
            <Text style={styles.textBold}>Teknisi</Text>
            <View style={styles.selectBox}>
              <Picker
                selectedValue={selectedTeknisi}
                onValueChange={(value) => setSelectedTeknisi(value)}
                style={styles.pickerText}
              >
                <Picker.Item
                  label="Pilih teknisi yang tersedia"
                  value=""
                />
                <Picker.Item label="Teknisi 1" value="1" />
                <Picker.Item label="Teknisi 2" value="2" />
              </Picker>
            </View>
          </View>
        </View>

        {/* BUTTONS */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={[styles.btn, styles.btnBlue]}>
            <Text style={styles.btnText}>Butuh Info</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.btn, styles.btnGreen]}>
            <Text style={styles.btnText}>Setujui</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.btn, styles.btnRed]}>
            <Text style={styles.btnText}>Tolak</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

/* ITEM COMPONENT */
const Item = ({ label, value }) => (
  <View style={styles.section}>
    <Text style={styles.textBold}>{label}</Text>
    <Text style={styles.textRegular}>{value}</Text>
  </View>
);

export default DetailApprovalScreen;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0A2647",
  },

  /* HEADER */
  header: {
    height: HEADER_HEIGHT,
    backgroundColor: "#0A2647",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 20,
    justifyContent: "space-between",
  },

  backIcon: {
    width: 22,
    height: 22,
    tintColor: "#fff",
  },

  headerTitle: {
    fontFamily: "GeologicaBold",
    fontSize: 18,
    color: "#fff",
  },

  /* SCROLL AREA */
  scrollView: {
    backgroundColor: "#EAF3FA",
  },

  /* REQUESTER CARD */
  requesterCard: {
    position: "absolute",
    left: 16,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    zIndex: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 20,
  },

  requesterName: {
    fontFamily: "GeologicaBold",
    fontSize: 16,
    color: "#0F172A",
  },

  requesterPosition: {
    fontFamily: "GeologicaRegular",
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
  },

  /* DETAIL CARD */
  detailCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginTop: -120,
    borderColor: "#E2E8F0",
  },

  section: {
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingBottom: 12,
  },

  textBold: {
    fontFamily: "GeologicaBold",
    fontSize: 14,
    color: "#0F172A",
    marginBottom: 6,
  },

  textRegular: {
    fontFamily: "GeologicaRegular",
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
  },

  /* FILE */
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
    fontFamily: "GeologicaRegular",
    fontSize: 18,
    marginRight: 10,
  },

  fileName: {
    fontFamily: "GeologicaMedium",
    fontSize: 14,
    color: "#475569",
  },

  /* PICKER */
  selectBox: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    overflow: "hidden",
  },

  pickerText: {
    fontFamily: "GeologicaRegular",
    fontSize: 14,
    color: "#64748B",
  },

  /* BUTTONS */
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },

  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 4,
  },

  btnBlue: {
    backgroundColor: "#2563EB",
  },

  btnGreen: {
    backgroundColor: "#10B981",
  },

  btnRed: {
    backgroundColor: "#DC2626",
  },

  btnText: {
    fontFamily: "GeologicaSemiBold",
    color: "#fff",
    fontSize: 13,
  },
});
