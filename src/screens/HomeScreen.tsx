import React, { useMemo } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Screen } from "../components/layout/Screen";
import { FakeSearchBar } from "../components/fakeSearchBar";
import { HomeCarousel } from "../Features/HomeScreen/Carousel";
import { WeeklyPopular } from "../Features/HomeScreen/WeeklySeries";
import { UpdatedSeries } from "@/Features/HomeScreen/UpdatedSeries";
import { Categories } from "@/Features/HomeScreen/Categories";
import { BestofCategory } from "@/Features/HomeScreen/BestofCategory";
import { RecenltyAdded } from "@/Features/HomeScreen/RecenltyAdded";
import { useTabBarBottomPadding } from "@/utils/useTabBarBottomPadding";
import { NativeAdCard } from "@/components/ads/NativeAdBanner";

const HomeScreen = () => {
  const tabBarBottomPadding = useTabBarBottomPadding();

  const contentContainerStyle = useMemo(
    () => [styles.scrollContent, { paddingBottom: tabBarBottomPadding }],
    [tabBarBottomPadding],
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
        <NativeAdCard />

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
    paddingBottom: 10,
    paddingTop: 4,
    zIndex: 10, // Üstte kalmasını garantiye alalım
  },
  scrollContent: {
    paddingTop: 6,
    rowGap: 26,
  },
  section: {
    width: "100%",
  },
  groupSection: {
    width: "100%",
    rowGap: 26,
  },
});
