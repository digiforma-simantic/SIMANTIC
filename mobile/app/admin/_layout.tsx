import { Stack, usePathname } from "expo-router";
import { View, StyleSheet } from "react-native";
import BottomNav from "../../components/navigasi";

export default function KasiLayout() {
  const pathname = usePathname();

  const showBottomNav =
    pathname.includes("/admin/dashboard") ||
    pathname.includes("/admin/aset") ||
    pathname.includes("/admin/riwayat") ||
    pathname.includes("/admin/profil");

  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }} />
      {showBottomNav && <BottomNav role="admin" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
