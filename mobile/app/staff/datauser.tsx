import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

const DetailProfile = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2FAFF" />

      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Detail Profil</Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ===== FOTO PROFIL ===== */}
        <View style={styles.imageWrapper}>
          <Image
            source={require("../../assets/images/slamet.png")}
            style={styles.profileImage}
          />
        </View>

        {/* ===== FORM ===== */}
        <View style={styles.formContainer}>
          <Field label="Nama Lengkap" value="Slamet Budianto" />
          <Field label="Jenis Kelamin" value="Laki-Laki" />
          <Field label="NIP" value="1120917398140" />
          <Field label="Jabatan" value="Staff Dinas Kesehatan" />
          <Field label="Unit Kerja" value="Bidang Pencegahan Penyakit" />
          <Field
            label="Asal Dinas"
            value="Dinas Kesehatan Provinsi Jawa Timur"
          />
          <Field label="Email" value="Slametbudddd@gmail.com" />

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

/* ===== KOMPONEN FIELD ===== */
const Field = ({ label, value }: { label: string; value: string }) => {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputBox}>
        <Text style={styles.inputText}>{value}</Text>
      </View>
    </View>
  );
};

export default DetailProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2FAFF",
  },

  /* ===== HEADER ===== */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 60,
    backgroundColor: "#F2FAFF",
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },

  backIcon: {
    fontSize: 22,
    color: "#0F172A",
  },

  headerTitle: {
    fontSize: 18,
    fontFamily: "GeologicaBold",
    color: "#0F172A",
  },

  /* ===== FOTO ===== */
  imageWrapper: {
    alignItems: "center",
    marginTop: 12,
    marginBottom: 24,
  },

  profileImage: {
    width: 140,
    height: 180,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
  },

  /* ===== FORM ===== */
  formContainer: {
    paddingHorizontal: 20,
  },

  fieldGroup: {
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontFamily: "GeologicaSemiBold",
    color: "#0F172A",
    marginBottom: 8,
  },

  inputBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },

  inputText: {
    fontSize: 15,
    fontFamily: "GeologicaRegular",
    color: "#0F172A",
  },
});
