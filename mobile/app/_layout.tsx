import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { ActivityIndicator, View, StyleSheet } from "react-native";

export default function RootLayout() {
  const [loaded] = useFonts({
    GeologicaThin: require("../assets/fonts/Geologica-Thin.ttf"),
    GeologicaExtraLight: require("../assets/fonts/Geologica-ExtraLight.ttf"),
    GeologicaLight: require("../assets/fonts/Geologica-Light.ttf"),
    GeologicaRegular: require("../assets/fonts/Geologica-Regular.ttf"),
    GeologicaMedium: require("../assets/fonts/Geologica-Medium.ttf"),
    GeologicaSemiBold: require("../assets/fonts/Geologica-SemiBold.ttf"),
    GeologicaBold: require("../assets/fonts/Geologica-Bold.ttf"),
    GeologicaExtraBold: require("../assets/fonts/Geologica-ExtraBold.ttf"),
    GeologicaBlack: require("../assets/fonts/Geologica-Black.ttf"),
  });

  if (!loaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#003049" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
