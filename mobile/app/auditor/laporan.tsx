import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";

import Navigasi from "../../components/navigasi";

/* ================= TYPES ================= */

type PickedFile = {
  name: string;
  uri: string;
  mimeType?: string;
  size?: number;
};

/* ================= COMPONENT ================= */

export default function LaporanAuditScreen() {
  const [opd, setOpd] = useState<string>("");
  const [periode, setPeriode] = useState<string>("");
  const [catatan, setCatatan] = useState<string>("");
  const [hasilAudit, setHasilAudit] = useState<
    "compliant" | "noncompliant"
  >("compliant");

  const [file, setFile] = useState<PickedFile | null>(
    null
  );

  /* ============ VALIDATION ============ */

  const isFormValid =
    opd.trim() !== "" &&
    periode.trim() !== "" &&
    catatan.trim() !== "";

  /* ================= HANDLERS ================= */

  const handlePickFile = async () => {
    try {
      const result =
        await DocumentPicker.getDocumentAsync({
          type: "*/*",
          copyToCacheDirectory: true,
          multiple: false,
        });

      if (
        !result.canceled &&
        result.assets &&
        result.assets.length > 0
      ) {
        const asset = result.assets[0];
        setFile({
          name: asset.name,
          uri: asset.uri,
          mimeType: asset.mimeType,
          size: asset.size,
        });
      }
    } catch (error) {
      console.log("Gagal memilih file:", error);
    }
  };

  const handleSubmit = () => {
    if (!isFormValid) return;

    console.log({
      opd,
      periode,
      hasilAudit,
      catatan,
      file,
    });

    alert("Laporan berhasil dikirim!");
  };

  /* ================= UI ================= */

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2FAFF" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* TITLE */}
        <Text style={styles.title}>Laporan Audit</Text>

        {/* OPD */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>OPD</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.star}>*</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh : Dinas Kesehatan"
              placeholderTextColor="#A0A0A0"
              value={opd}
              onChangeText={setOpd}
            />
          </View>
        </View>

        {/* PERIODE */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Periode Audit</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.star}>*</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh : Q3 2025"
              placeholderTextColor="#A0A0A0"
              value={periode}
              onChangeText={setPeriode}
            />
          </View>
        </View>

        {/* HASIL AUDIT */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Hasil Audit
          </Text>

          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                hasilAudit ===
                  "compliant" &&
                  styles.toggleActiveGreen,
              ]}
              onPress={() =>
                setHasilAudit("compliant")
              }
            >
              <Text style={styles.toggleText}>
                Compliant
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleButton,
                hasilAudit ===
                  "noncompliant" &&
                  styles.toggleActiveRed,
              ]}
              onPress={() =>
                setHasilAudit("noncompliant")
              }
            >
              <Text style={styles.toggleText}>
                Non-Compliant
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CATATAN */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Catatan Auditor
          </Text>
          <View
            style={[
              styles.inputWrapper,
              styles.textAreaWrapper,
            ]}
          >
            <Text style={styles.star}>*</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Tuliskan deskripsi mengapa perubahan ini diperlukan"
              placeholderTextColor="#A0A0A0"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              value={catatan}
              onChangeText={setCatatan}
            />
          </View>
        </View>

        {/* FILE */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Lampiran Dokumen
          </Text>

          <View style={styles.fileBox}>
            <TouchableOpacity
              style={styles.chooseFileBtn}
              onPress={handlePickFile}
            >
              <Text style={styles.chooseFileText}>
                Choose File
              </Text>
            </TouchableOpacity>

            <Text style={styles.noFileText}>
              {file
                ? file.name
                : "No File Chosen"}
            </Text>
          </View>
        </View>

        {/* SUBMIT BUTTON */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            isFormValid &&
              styles.submitButtonActive,
          ]}
          disabled={!isFormValid}
          onPress={handleSubmit}
        >
          <Text
            style={[
              styles.submitText,
              isFormValid &&
                styles.submitTextActive,
            ]}
          >
            Submit
          </Text>
        </TouchableOpacity>

        <View style={{ height: 160 }} />
      </ScrollView>

      {/* BOTTOM NAV */}
      <Navigasi role="auditor" />
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2FAFF",
  },

  scrollContent: {
    paddingHorizontal: 20,
  },

  title: {
    fontFamily: "GeologicaBold",
    fontSize: 18,
    color: "#0F172A",
    textAlign: "center",
    marginVertical: 20,
    marginTop: 60,
  },

  formGroup: {
    marginBottom: 18,
  },

  label: {
    fontFamily: "GeologicaBold",
    fontSize: 14,
    color: "#0F172A",
    marginBottom: 8,
  },

  inputWrapper: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  star: {
    fontFamily: "GeologicaBold",
    color: "red",
    marginRight: 6,
  },

  input: {
    flex: 1,
    height: 44,
    fontFamily: "GeologicaRegular",
    fontSize: 14,
    color: "#0F172A",
  },

  textAreaWrapper: {
    alignItems: "flex-start",
    paddingTop: 12,
  },

  textArea: {
    flex: 1,
    minHeight: 120,
    fontFamily: "GeologicaRegular",
    fontSize: 14,
    color: "#0F172A",
  },

  toggleContainer: {
    flexDirection: "row",
    gap: 12,
  },

  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#E5E7EB",
  },

  toggleActiveGreen: {
    backgroundColor: "#BFE3CF",
  },

  toggleActiveRed: {
    backgroundColor: "#E8C1C1",
  },

  toggleText: {
    fontFamily: "GeologicaSemiBold",
    fontSize: 14,
    color: "#0F172A",
  },

  fileBox: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  chooseFileBtn: {
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
  },

  chooseFileText: {
    fontFamily: "GeologicaMedium",
    fontSize: 13,
    color: "#0F172A",
  },

  noFileText: {
    fontFamily: "GeologicaRegular",
    fontSize: 13,
    color: "#9CA3AF",
    flexShrink: 1,
  },

  submitButton: {
    alignSelf: "flex-end",
    marginTop: 10,
    backgroundColor: "#E5E7EB",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },

  submitButtonActive: {
    backgroundColor: "#002543",
  },

  submitText: {
    fontFamily: "GeologicaSemiBold",
    fontSize: 14,
    color: "#9CA3AF",
  },

  submitTextActive: {
    color: "#FFFFFF",
  },
});
