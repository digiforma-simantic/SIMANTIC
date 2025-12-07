import { Stack, usePathname } from "expo-router";
import { View, StyleSheet } from "react-native";
import BottomNav from "../../components/navigasi";

export default function KasiLayout() {
  const pathname = usePathname();

  // ✅ Navbar hanya muncul di halaman tertentu milik KASI
  const showBottomNav =
    pathname.includes("/kadis/dashboard") ||
    pathname.includes("/kadis/aset") ||
    pathname.includes("/kadis/riwayat") ||
    pathname.includes("/kadis/profil");

  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }} />
      {showBottomNav && <BottomNav role="kadis" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
