import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

const FilterScreen = () => {
  const router = useRouter();

  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string[]>([]);

  const statusOptions = ["Proses", "Selesai", "Ditolak"];
  const monthOptions = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const yearOptions = ["2021", "2022", "2023", "2024"];

  const toggleStatus = (status: string) => {
    setSelectedStatus(selectedStatus.includes(status)
      ? selectedStatus.filter((s) => s !== status)
      : [status] // hanya 1 dipilih sesuai desain
    );
  };

  const toggleMonth = (month: string) => {
    setSelectedMonth(selectedMonth.includes(month)
      ? selectedMonth.filter((m) => m !== month)
      : [month] // hanya 1 dipilih
    );
  };

  const toggleYear = (year: string) => {
    setSelectedYear(selectedYear.includes(year)
      ? selectedYear.filter((y) => y !== year)
      : [year] // hanya 1 dipilih
    );
  };

  const clearAll = () => {
    setSelectedStatus([]);
    setSelectedMonth([]);
    setSelectedYear([]);
  };

  const applyFilters = () => {
    router.back();
  };

  const canApply = selectedStatus.length > 0 && selectedMonth.length > 0 && selectedYear.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2FAFF" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Filter</Text>

        <TouchableOpacity onPress={clearAll}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* STATUS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={styles.chipContainer}>
            {statusOptions.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => toggleStatus(item)}
                style={[
                  styles.chip,
                  selectedStatus.includes(item) && styles.chipSelected,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedStatus.includes(item) && styles.chipTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* BULAN */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bulan</Text>
          <View style={styles.chipContainer}>
            {monthOptions.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => toggleMonth(item)}
                style={[
                  styles.chip,
                  selectedMonth.includes(item) && styles.chipSelected,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedMonth.includes(item) && styles.chipTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* TAHUN */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tahun</Text>
          <View style={styles.chipContainer}>
            {yearOptions.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => toggleYear(item)}
                style={[
                  styles.chip,
                  selectedYear.includes(item) && styles.chipSelected,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedYear.includes(item) && styles.chipTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={canApply ? applyFilters : undefined}
          style={[
            styles.applyButton,
            canApply ? styles.applyButtonActive : styles.applyButtonDisabled,
          ]}
        >
          <Text
            style={[
              styles.applyButtonText,
              canApply ? styles.applyTextActive : styles.applyTextDisabled,
            ]}
          >
            Terapkan
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FilterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2FAFF",
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    marginTop: 60,
    marginBottom: 30,
  },

  backIcon: {
    fontSize: 24,
    color: "#1A1A1A",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },

  clearText: {
    fontSize: 12,
    color: "#3B82F6",
    textDecorationLine: "underline",
  },

  /* CONTENT */
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  section: {
    marginBottom: 30,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#002543",
    marginBottom: 14,
  },

  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  chip: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#C7D7EB",
    borderRadius: 8,
  },

  chipSelected: {
    backgroundColor: "#002543",
    borderColor: "#002543",
  },

  chipText: {
    color: "#002543",
    fontWeight: "500",
  },

  chipTextSelected: {
    color: "white",
  },

  /* FOOTER */
  footer: {
    backgroundColor: "#F2FAFF",
    padding: 20,
  },

  applyButton: {
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 90,
  },

  applyButtonDisabled: {
    backgroundColor: "#E5E5E5",
  },

  applyButtonActive: {
    backgroundColor: "#002543",
  },

  applyButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },

  applyTextDisabled: {
    color: "#9CA3AF",
  },

  applyTextActive: {
    color: "white",
  },
});
