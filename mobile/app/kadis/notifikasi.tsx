import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

/* ===============================
   TYPE NOTIFIKASI
================================== */
type NotificationType = {
  id: number;
  type: "success" | "approved" | "info" | "failed" | "rejected";
  title: string;
  description: string;
  time: string;
};

/* ===============================
   FUNCTION UNTUK MENDAPATKAN ICON
================================== */
const getIcon = (type: NotificationType["type"]) => {
  switch (type) {
    case "success":
      return require("../../assets/images/setujubiru.png");
    case "approved":
      return require("../../assets/images/refreshbiru.png");
    case "info":
      return require("../../assets/images/serubiru.png");
    case "failed":
      return require("../../assets/images/seruhitam.png");
    case "rejected":
      return require("../../assets/images/refreshhitam.png");
    default:
      return require("../../assets/images/serubiru.png");
  }
};

/* ===============================
   COMPONENT UTAMA
================================== */
export default function NotificationScreen() {
  const router = useRouter();

  const todayNotifications: NotificationType[] = [
    {
      id: 1,
      type: "success",
      title: "Berhasil Diimplementasi",
      description:
        'Perubahan "Instal Aplikasi Zoom pada Laptop-01" telah selesai diimplementasi',
      time: "Now",
    },
    {
      id: 2,
      type: "rejected",
      title: "Diterima oleh Diskominfo",
      description:
        'Permintaan "Instal Aplikasi Zoom pada Laptop-01" sudah diteruskan ke teknisi',
      time: "3j",
    },
    {
      id: 3,
      type: "approved",
      title: "Diterima oleh Kepala Bidang",
      description:
        'Permintaan "Instal Aplikasi Zoom pada Laptop-01" disetujui Kepala Bidang',
      time: "5j",
    },
    {
      id: 4,
      type: "info",
      title: "Info Pemeliharaan Aset",
      description:
        "Aset akan menjalani pemeliharaan pada tanggal 7 November 2025",
      time: "9j",
    },
  ];

  const yesterdayNotifications: NotificationType[] = [
    {
      id: 5,
      type: "failed",
      title: "Pengajuan Gagal",
      description:
        'Permintaan "Instal Game di PC-05" ditolak oleh Diskominfo dengan alasan',
      time: "2h",
    },
    {
      id: 6,
      type: "approved",
      title: "Diterima oleh Kepala Seksi",
      description:
        'Permintaan "Instal Aplikasi Zoom pada Laptop-01" disetujui Kepala Seksi',
      time: "9j",
    },
  ];

  /* ===============================
        COMPONENT LIST ITEM
  ================================== */
  const NotificationItem = ({ item }: { item: NotificationType }) => {
    const hasUnreadDot = ["Now", "3j", "5j", "9j"].includes(item.time);

    return (
      <TouchableOpacity style={styles.notificationItem} activeOpacity={0.7}>
        <View style={styles.iconContainer}>
          <Image
            source={getIcon(item.type)}
            style={styles.iconImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{item.title}</Text>
            {hasUnreadDot && <View style={styles.unreadDot} />}
          </View>

          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        </View>

        <Text style={styles.time}>{item.time}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F9FD" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Image
            source={require("../../assets/images/back.png")}
            style={styles.backIconImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Notifikasi</Text>
        <View style={styles.placeholder} />
      </View>

      {/* LIST */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hari Ini</Text>

          {todayNotifications.map((item) => (
            <NotificationItem key={item.id} item={item} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kemarin</Text>

          {yesterdayNotifications.map((item) => (
            <NotificationItem key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ===============================
        STYLES
================================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F9FD",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#F3F9FD",
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },

  backIconImage: {
    width: 24,
    height: 24,
  },

  headerTitle: {
    fontFamily: "GeologicaBold",
    fontSize: 18,
    color: "#072A45",
    flex: 1,
    textAlign: "center",
  },

  placeholder: {
    width: 40,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontFamily: "GeologicaBold",
    fontSize: 16,
    color: "#072A45",
    marginBottom: 12,
  },

  notificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E6E9EC",
  },

  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  iconImage: {
    width: 28,
    height: 28,
  },

  contentContainer: {
    flex: 1,
    marginRight: 12,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },

  title: {
    fontFamily: "GeologicaSemiBold",
    fontSize: 14,
    color: "#0066CC",
    flex: 1,
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2979FF",
    marginLeft: 8,
  },

  description: {
    fontFamily: "GeologicaLight",
    fontSize: 13,
    color: "#607D8B",
    lineHeight: 18,
  },

  time: {
    fontFamily: "GeologicaRegular",
    fontSize: 12,
    color: "#9E9E9E",
    marginTop: 2,
  },
});