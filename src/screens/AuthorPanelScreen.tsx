import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useState } from "react";
import { Screen } from "../components/layout/Screen";
import { AuthorStats } from "@/Features/AuthorPanelScreen/AuthorStats";
import { AuthorPanelHeader } from "@/Features/AuthorPanelScreen/AuthorPanelHeader";
import { NovelParallax } from "@/Features/AuthorPanelScreen/NovelParallax";
import { useDashboardStatsQuery } from "@/hooks/useDashboardStatsQuery";
import { AuthorPanelOptions } from "@/Features/AuthorPanelScreen/AuthorPanelOptions";
import { Header } from "@/components/Header";
import { useAuthorMeQuery } from "@/hooks/useAuthorMeQuery";
import { useAppTheme } from "@/hooks/useTheme";

const AuthorPanelScreen = () => {
  const [selectedNovelIndex, setSelectedNovelIndex] = useState<string | null>(
    null,
  );
  const { theme } = useAppTheme();
  const { data: authorMe, isLoading: isAuthorLoading } = useAuthorMeQuery();

  const { data: statsData, isLoading } =
    useDashboardStatsQuery(selectedNovelIndex);

  console.log("Seçili Kitap ID:", selectedNovelIndex);

  if (isAuthorLoading) {
    return (
      <Screen style={styles.centerScreen}>
        <ActivityIndicator color={theme.textPrimary} />
        <Text style={[styles.stateText, { color: theme.textSecondary }]}>
          Yazar paneli hazırlanıyor...
        </Text>
      </Screen>
    );
  }

  if (!authorMe?.isAuthor) {
    return (
      <Screen style={styles.centerScreen}>
        <Text style={[styles.stateTitle, { color: theme.textPrimary }]}>
          Yazar paneli kapalı
        </Text>
        <Text style={[styles.stateText, { color: theme.textSecondary }]}>
          Bu alana erişmek için yazar hesabı oluşturman gerekiyor.
        </Text>
      </Screen>
    );
  }

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
        <View style={{ gap: 24, paddingBottom: 40 }}>
          <AuthorPanelHeader title="Seçenekler" />
          <AuthorPanelOptions />
        </View>
      </ScrollView>
    </Screen>
  );
};

export default AuthorPanelScreen;

const styles = StyleSheet.create({
  centerScreen: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 10,
  },
  stateTitle: {
    fontFamily: "Mont-700",
    fontSize: 16,
    textAlign: "center",
  },
  stateText: {
    fontFamily: "Mont-500",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },
});
