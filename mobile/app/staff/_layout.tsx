import { Stack, usePathname } from "expo-router";
import { View, StyleSheet } from "react-native";
import AnimatedBottomNav from "../../components/navigasi";

export default function StaffLayout() {
  const pathname = usePathname();

  // ✅ Navbar hanya muncul di halaman utama staff
  const showBottomNav =
    pathname.includes("/staff/dashboard") ||
    pathname.includes("/staff/aset") ||
    pathname.includes("/staff/riwayat") ||
    pathname.includes("/staff/profil");

  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }} />
      {showBottomNav && <AnimatedBottomNav role="staff" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
