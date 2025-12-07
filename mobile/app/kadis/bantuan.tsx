import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Image,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

type QuestionItem = {
  id: number;
  text: string;
  route: string;
};

const BantuanScreen = () => {
  const router = useRouter();

  const questions: QuestionItem[] = [
    {
      id: 1,
      text: "Bagaimana cara memantau pengajuan saya?",
      route: "/kadis/bantuan1",
    },
    {
      id: 2,
      text: "Bagaimana cara melihat detail aset saya?",
      route: "/kadis/bantuan2",
    },
    {
      id: 3,
      text: "Bagaimana cara melihat riwayat status pengajuan sebelumnya?",
      route: "/kadis/bantuan3",
    },
    {
      id: 4,
      text: "Bagaimana cara melihat informasi profil saya?",
      route: "/kadis/bantuan4",
    },
  ];

  // ✅ FIX: route diberi tipe string
  const handleQuestionPress = (route: string) => {
    router.push(route as any); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#002543" />

      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Image
              source={require("../../assets/images/backputih.png")}
              style={styles.backIcon}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Bantuan</Text>
          <View style={{ width: 32 }} />
        </View>
      </View>

      {/* ================= CARD OVERLAY ================= */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Pertanyaan Populer</Text>

        {questions.map((q) => (
          <TouchableOpacity
            key={q.id}
            style={styles.questionItem}
            onPress={() => handleQuestionPress(q.route)}
            activeOpacity={0.7}
          >
            <Text style={styles.questionText}>{q.text}</Text>
            <Image
              source={require("../../assets/images/panahkanan.png")}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* ================= SCROLL ================= */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ height: 400 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default BantuanScreen;

// Styles tetap sama...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#002543",
  },

  /* HEADER SELALU DI ATAS */
header: {
  backgroundColor: "#002543",
  height: 20,           // tinggi area biru
  width: "100%",
  justifyContent: "flex-end",
  paddingBottom: 20,     // jarak ke bawah
  position: "relative",
},

headerContent: {
  position: "absolute",  // KUNCI AGAR TIDAK PERNAH HILANG
  bottom: -100,            // JARAK DARI BAWAH HEADER
  left: 20,
  right: 20,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
},

backButton: {
  padding: 6,
},

backIcon: {
  width: 22,
  height: 22,
  tintColor: "#fff",
},

headerTitle: {
  fontFamily: "GeologicaBold",
  fontSize: 18,
  color: "#fff",
},

  /* CARD MENIMPA AREA BIRU, TAPI TIDAK MENUTUP HEADER */
  card: {
    position: "absolute",
    top: 180,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E1E8EE",
    zIndex: 50,       // card di bawah header
    elevation: 10,
  },

  cardTitle: {
    fontFamily: "GeologicaBold",
    fontSize: 18,
    color: "#072A45",
    marginBottom: 20,
  },

  questionItem: {
    backgroundColor: "#F4FAFF",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E6E9EC",
  },

  questionText: {
    flex: 1,
    fontFamily: "GeologicaSemiBold",
    fontSize: 14,
    color: "#072A45",
    marginRight: 12,
  },

  arrowIcon: {
    width: 16,
    height: 16,
    tintColor: "#072A45",
  },

  scroll: {
    flex: 1,
    backgroundColor: "#E8F2FA",
    marginTop: 300, // di bawah card
    zIndex: 1,
  },
});
