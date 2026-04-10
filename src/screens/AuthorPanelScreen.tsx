import { ScrollView, View } from "react-native";
import { Screen } from "../components/layout/Screen";
import { ProfileSettingsHeader } from "@/components/ProfileSettingsHeader";
import { AuthorStats } from "@/Features/AuthorPanelScreen/AuthorStats";
import { AuthorPanelHeader } from "@/Features/AuthorPanelScreen/AuthorPanelHeader";
import { NovelParallax } from "@/Features/AuthorPanelScreen/NovelParallax";
import { useState } from "react";
import { useDashboardStatsQuery } from "@/hooks/useDashboardStatsQuery";
import { AuthorPanelOptions } from "@/Features/AuthorPanelScreen/AuthorPanelOptions";
import { Header } from "@/components/Header";

const AuthorPanelScreen = () => {
  const [selectedNovelIndex, setSelectedNovelIndex] = useState<string | null>(
    null,
  );

  const { data: statsData, isLoading } =
    useDashboardStatsQuery(selectedNovelIndex);

  console.log("Seçili Kitap ID:", selectedNovelIndex);

  return (
    <Screen style={{ gap: 12, paddingHorizontal: 0, paddingVertical: 0 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        <View style={{ paddingHorizontal: 16 }}>
          <Header title="Yazar Paneli" isAdjacent={false} />
        </View>
        <View style={{ gap: 12 }}>
          <AuthorStats stats={statsData ?? null} isLoading={isLoading} />
        </View>
        <View style={{ gap: 12, marginTop: 16 }}>
          <AuthorPanelHeader title="Kitaplarım" />
          <NovelParallax onNovelSelect={setSelectedNovelIndex} />
        </View>
        <View style={{ gap: 12, paddingBottom: 40 }}>
          <AuthorPanelHeader title="Seçenekler" />
          <AuthorPanelOptions />
        </View>
      </ScrollView>
    </Screen>
  );
};
export default AuthorPanelScreen;
