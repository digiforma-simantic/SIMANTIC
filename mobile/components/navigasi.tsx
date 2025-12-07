import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
} from "react-native";
import { useRouter, usePathname } from "expo-router";

/* ================= TYPES ================= */

type Role =
  | "staff"
  | "admin"
  | "kasi"
  | "kabid"
  | "kadis"
  | "auditor"
  | "diskominfo";

type TabName = "Dashboard" | "Aset" | "Riwayat" | "Profil" | "User" | "Laporan";

type TabItem = {
  name: TabName;
  route: string;
  inactiveIcon: any;
  activeIcon: any;
};

/* ================= COMPONENT ================= */

export default function AnimatedBottomNav({ role }: { role: Role }) {
  const router = useRouter();
  const pathname = usePathname();

  /* ================= ANIMATION MAP ================= */
  const animMap: Record<TabName, Animated.Value> = {
    Dashboard: useRef(new Animated.Value(0)).current,
    Aset: useRef(new Animated.Value(0)).current,
    Riwayat: useRef(new Animated.Value(0)).current,
    Profil: useRef(new Animated.Value(0)).current,
    Laporan: useRef(new Animated.Value(0)).current,
    User: useRef(new Animated.Value(0)).current,
  };

  /* ================= MENU PER ROLE ================= */

  const menuByRole: Record<Role, TabItem[]> = {
    staff: [
      {
        name: "Dashboard",
        route: "/staff/dashboard",
        inactiveIcon: require("../assets/images/home.png"),
        activeIcon: require("../assets/images/homebold.png"),
      },
      {
        name: "Aset",
        route: "/staff/aset",
        inactiveIcon: require("../assets/images/aset.png"),
        activeIcon: require("../assets/images/asetbold.png"),
      },
      {
        name: "Riwayat",
        route: "/staff/riwayat",
        inactiveIcon: require("../assets/images/riwayat.png"),
        activeIcon: require("../assets/images/riwayatbold.png"),
      },
      {
        name: "Profil",
        route: "/staff/profil",
        inactiveIcon: require("../assets/images/profil.png"),
        activeIcon: require("../assets/images/profilbold.png"),
      },
    ],

    admin: [
      {
        name: "Dashboard",
        route: "/admin/dashboard",
        inactiveIcon: require("../assets/images/home.png"),
        activeIcon: require("../assets/images/homebold.png"),
      },
      {
        name: "Aset",
        route: "/admin/aset",
        inactiveIcon: require("../assets/images/aset.png"),
        activeIcon: require("../assets/images/asetbold.png"),
      },
      {
        name: "Riwayat",
        route: "/admin/riwayat",
        inactiveIcon: require("../assets/images/riwayat.png"),
        activeIcon: require("../assets/images/riwayatbold.png"),
      },
      {
        name: "Profil",
        route: "/admin/profil",
        inactiveIcon: require("../assets/images/profil.png"),
        activeIcon: require("../assets/images/profilbold.png"),
      },
    ],

    kasi: [
      {
        name: "Dashboard",
        route: "/kasi/dashboard",
        inactiveIcon: require("../assets/images/home.png"),
        activeIcon: require("../assets/images/homebold.png"),
      },
      {
        name: "Aset",
        route: "/kasi/aset",
        inactiveIcon: require("../assets/images/aset.png"),
        activeIcon: require("../assets/images/asetbold.png"),
      },
      {
        name: "Riwayat",
        route: "/kasi/riwayat",
        inactiveIcon: require("../assets/images/riwayat.png"),
        activeIcon: require("../assets/images/riwayatbold.png"),
      },
      {
        name: "Profil",
        route: "/kasi/profil",
        inactiveIcon: require("../assets/images/profil.png"),
        activeIcon: require("../assets/images/profilbold.png"),
      },
    ],

    kabid: [
      {
        name: "Dashboard",
        route: "/kabid/dashboard",
        inactiveIcon: require("../assets/images/home.png"),
        activeIcon: require("../assets/images/homebold.png"),
      },
      {
        name: "Aset",
        route: "/kabid/aset",
        inactiveIcon: require("../assets/images/aset.png"),
        activeIcon: require("../assets/images/asetbold.png"),
      },
      {
        name: "Riwayat",
        route: "/kabid/riwayat",
        inactiveIcon: require("../assets/images/riwayat.png"),
        activeIcon: require("../assets/images/riwayatbold.png"),
      },
      {
        name: "Profil",
        route: "/kabid/profil",
        inactiveIcon: require("../assets/images/profil.png"),
        activeIcon: require("../assets/images/profilbold.png"),
      },
    ],
    kadis: [
      {
        name: "Dashboard",
        route: "/kadis/dashboard",
        inactiveIcon: require("../assets/images/home.png"),
        activeIcon: require("../assets/images/homebold.png"),
      },
      {
        name: "Aset",
        route: "/kadis/aset",
        inactiveIcon: require("../assets/images/aset.png"),
        activeIcon: require("../assets/images/asetbold.png"),
      },
      {
        name: "Riwayat",
        route: "/kadis/riwayat",
        inactiveIcon: require("../assets/images/riwayat.png"),
        activeIcon: require("../assets/images/riwayatbold.png"),
      },
      {
        name: "Profil",
        route: "/kadis/profil",
        inactiveIcon: require("../assets/images/profil.png"),
        activeIcon: require("../assets/images/profilbold.png"),
      },
    ],
    auditor: [
      {
        name: "Dashboard",
        route: "/auditor/dashboard",
        inactiveIcon: require("../assets/images/home.png"),
        activeIcon: require("../assets/images/homebold.png"),
      },
      {
        name: "Laporan",
        route: "/auditor/laporan",
        inactiveIcon: require("../assets/images/laporan.png"),
        activeIcon: require("../assets/images/laporanbold.png"),
      },
      {
        name: "Profil",
        route: "/auditor/profil",
        inactiveIcon: require("../assets/images/profil.png"),
        activeIcon: require("../assets/images/profilbold.png"),
      },
    ],
    diskominfo: [
      {
        name: "Dashboard",
        route: "/diskominfo/dashboard",
        inactiveIcon: require("../assets/images/home.png"),
        activeIcon: require("../assets/images/homebold.png"),
      },
      {
        name: "Aset",
        route: "/diskominfo/aset",
        inactiveIcon: require("../assets/images/aset.png"),
        activeIcon: require("../assets/images/asetbold.png"),
      },
      {
        name: "Riwayat",
        route: "/diskominfo/riwayat",
        inactiveIcon: require("../assets/images/riwayat.png"),
        activeIcon: require("../assets/images/riwayatbold.png"),
      },
      {
        name: "Profil",
        route: "/diskominfo/profil",
        inactiveIcon: require("../assets/images/profil.png"),
        activeIcon: require("../assets/images/profilbold.png"),
      },
    ],
  };

  const tabs = menuByRole[role].map((tab) => ({
    ...tab,
    animValue: animMap[tab.name],
  }));

  /* ================= ACTIVE TAB ================= */

  const activeTab =
    tabs.find((tab) => pathname.startsWith(tab.route))?.name ??
    tabs[0]?.name;

  useEffect(() => {
    tabs.forEach((tab) => {
      Animated.spring(tab.animValue, {
        toValue: tab.name === activeTab ? 1 : 0,
        useNativeDriver: true,
        tension: 70,
        friction: 7,
      }).start();
    });
  }, [activeTab]);

  /* ================= NAVIGATION ================= */

  const handleTabPress = (route: string) => {
    router.push(route as any);
  };

  /* ================= RENDER ================= */

  return (
    <View style={styles.wrapper}>
      <View style={styles.bottomNav}>
        {tabs.map((item, index) => {
          const isActive = item.name === activeTab;

          const translateY = item.animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -18],
          });

          const scale = item.animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.1],
          });

          const labelOpacity = item.animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
          });

          return (
            <TouchableOpacity
              key={index}
              style={styles.navItem}
              onPress={() => handleTabPress(item.route)}
              activeOpacity={0.85}
            >
              <Animated.View
                style={[
                  styles.iconContainer,
                  { transform: [{ translateY }, { scale }] },
                  isActive && styles.iconContainerActive,
                ]}
              >
                <Image
                  source={isActive ? item.activeIcon : item.inactiveIcon}
                  style={styles.icon}
                />
              </Animated.View>

              <Animated.Text
                style={[
                  styles.navLabel,
                  isActive && styles.navLabelActive,
                  { opacity: labelOpacity },
                ]}
              >
                {item.name}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 44,
  },

  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#002543",
    paddingTop: 10,
    paddingBottom: 14,
    paddingHorizontal: 24,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },

  iconContainerActive: {
    backgroundColor: "#002543",
    borderWidth: 3,
    borderColor: "#002543",
    shadowColor: "#002543",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
  },

  icon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },

  navLabel: {
    fontSize: 11,
    color: "#B0BEC5",
    marginTop: 4,
    fontFamily: "GeologicaRegular",
  },

  navLabelActive: {
    color: "#FFFFFF",
    fontFamily: "GeologicaSemiBold",
  },
});
