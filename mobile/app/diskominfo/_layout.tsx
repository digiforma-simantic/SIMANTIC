import { Stack, usePathname } from "expo-router";
import { View, StyleSheet } from "react-native";
import BottomNav from "../../components/navigasi";

export default function KasiLayout() {
  const pathname = usePathname();

  const showBottomNav =
    pathname.includes("/diskominfo/dashboard") ||
    pathname.includes("/diskominfo/aset") ||
    pathname.includes("/diskominfo/riwayat") ||
    pathname.includes("/diskominfo/profil");

  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }} />
      {showBottomNav && <BottomNav role="diskominfo" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
