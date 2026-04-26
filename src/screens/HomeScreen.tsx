import React, { useMemo } from "react";
import { View, ScrollView, StyleSheet, RefreshControl } from "react-native";
import { Screen } from "../components/layout/Screen";
import { FakeSearchBar } from "../components/fakeSearchBar";
import { HomeCarousel } from "../Features/HomeScreen/Carousel";
import { WeeklyPopular } from "../Features/HomeScreen/WeeklySeries";
import { UpdatedSeries } from "@/Features/HomeScreen/UpdatedSeries";
import { Categories } from "@/Features/HomeScreen/Categories";
import { BestofCategory } from "@/Features/HomeScreen/BestofCategory";
import { RecenltyAdded } from "@/Features/HomeScreen/RecenltyAdded";
import { useDynamicBottom } from "@/utils/useDynamicBottom";

const HomeScreen = () => {
  const dynamicBottom = useDynamicBottom();

  // Performans için padding değerini memoize ediyoruz
  const contentContainerStyle = useMemo(
    () => [styles.scrollContent, { paddingBottom: dynamicBottom + 40 }],
    [dynamicBottom],
  );

  return (
    <Screen style={styles.container}>
      <View style={styles.searchWrapper}>
        <FakeSearchBar />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        contentContainerStyle={contentContainerStyle}
      >
        {/* İPUCU: Her bir section'ın içine "isLoading" kontrolü ekleyip 
          veriler gelene kadar Skeleton gösterilmesini sağlamalısın.
        */}

        <View style={styles.section}>
          <HomeCarousel />
        </View>

        <View style={styles.groupSection}>
          <WeeklyPopular />
          <UpdatedSeries />
        </View>

        <View style={styles.categoryWrapper}>
          <Categories />
        </View>

        <View style={styles.section}>
          <BestofCategory />
        </View>

        <View style={styles.section}>
          <RecenltyAdded />
        </View>
      </ScrollView>
    </Screen>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchWrapper: {
    paddingBottom: 12,
    paddingTop: 8,
    zIndex: 10, // Üstte kalmasını garantiye alalım
  },
  scrollContent: {
    paddingTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  groupSection: {
    marginBottom: 16,
  },
  categoryWrapper: {
    marginBottom: 24,
    paddingVertical: 4,
  },
});
