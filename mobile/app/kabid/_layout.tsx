import { Stack, usePathname } from "expo-router";
import { View, StyleSheet } from "react-native";
import BottomNav from "../../components/navigasi";

export default function KasiLayout() {
  const pathname = usePathname();

  // ✅ Navbar hanya muncul di halaman tertentu milik KABID
  const showBottomNav =
    pathname.includes("/kabid/dashboard") ||
    pathname.includes("/kabid/aset") ||
    pathname.includes("/kabid/riwayat") ||
    pathname.includes("/kabid/profil");

  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }} />
      {showBottomNav && <BottomNav role="kabid" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
