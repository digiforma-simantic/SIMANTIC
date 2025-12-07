import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import { useRouter } from "expo-router";

export default function Bantuan1Screen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />

      {/* ============ HEADER ============ */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={require("../../assets/images/back.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Bantuan</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* ============ CONTENT ============ */}
      <View style={styles.content}>
        <Text style={styles.title}>
          Bagaimana cara melihat riwayat status pengajuan sebelumnya?
        </Text>

        <Text style={styles.description}>
          Anda dapat melihat riwayat status pengajuan dengan beberapa langkah seperti berikut :
        </Text>

        {/* Step 1 */}
        <View style={styles.stepItem}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>
          <Text style={styles.stepText}>
            Pergi ke halaman <Text style={styles.bold}>Riwayat</Text>
          </Text>
        </View>
        <View style={styles.divider} />

        {/* Step 2 */}
        <View style={styles.stepItem}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>2</Text>
          </View>
          <Text style={styles.stepText}>
            Gunakan filter atau pencarian jika diperlukan
          </Text>
        </View>
        <View style={styles.divider} />

        {/* Step 3 */}
        <View style={styles.stepItem}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>3</Text>
          </View>
          <Text style={styles.stepText}>
            Klik <Text style={styles.bold}>Cek Status</Text>
          </Text>
        </View>
        <View style={styles.divider} />

        {/* Step 4 */}
        <View style={styles.stepItem}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>4</Text>
          </View>
          <Text style={styles.stepText}>
            Tutup halaman jika sudah selesai
          </Text>
        </View>
        <View style={styles.divider} />
      </View>
    </SafeAreaView>
  );
}

/* ==================== STYLES ==================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginTop: 70,
    marginBottom: 30,
    backgroundColor: "#F5F7FA",
  },

  backIcon: {
    width: 22,
    height: 22,
  },

  headerTitle: {
    fontFamily: "GeologicaBold",
    fontSize: 18,
    color: "#072A45",
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
  },

  title: {
    fontFamily: "GeologicaBold",
    fontSize: 22,
    color: "#072A45",
    marginBottom: 16,
    lineHeight: 30,
  },

  description: {
    fontFamily: "GeologicaRegular",
    fontSize: 14,
    color: "#607D8B",
    marginBottom: 28,
    lineHeight: 20,
  },

  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
  },

  stepNumber: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#E9EEF3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  stepNumberText: {
    fontFamily: "GeologicaSemiBold",
    fontSize: 14,
    color: "#072A45",
  },

  stepText: {
    flex: 1,
    fontFamily: "GeologicaRegular",
    fontSize: 15,
    color: "#072A45",
    lineHeight: 22,
  },

  bold: {
    fontFamily: "GeologicaBold",
  },

  divider: {
    height: 1,
    backgroundColor: "#E1E8EE",
    marginLeft: 48,
  },
});
