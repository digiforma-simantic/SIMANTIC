import { Stack, usePathname } from "expo-router";
import { View, StyleSheet } from "react-native";
import BottomNav from "../../components/navigasi";

export default function KasiLayout() {
  const pathname = usePathname();

  // ✅ Navbar hanya muncul di halaman tertentu milik KASI
  const showBottomNav =
    pathname.includes("/kasi/dashboard") ||
    pathname.includes("/kasi/aset") ||
    pathname.includes("/kasi/riwayat") ||
    pathname.includes("/kasi/profil");

  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }} />
      {showBottomNav && <BottomNav role="kasi" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
