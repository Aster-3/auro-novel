import { ChapterIcon } from "@/components/icons/ChapterIcon";
import { LittleRecommendIcon } from "@/components/icons/LittleRecommendIcon";
import { StatusIcon } from "@/components/icons/StatusIcon";
import { ViewIcon } from "@/components/icons/ViewIcon";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useAppTheme } from "@/hooks/useTheme";
import { useAuthorNovelsQuery } from "@/hooks/userUserProfileQuery";
import { Image } from "expo-image";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Tabs } from "react-native-collapsible-tab-view";

const STATUS_LABELS: Record<string, string> = {
  ongoing: "Devam Ediyor",
  completed: "Tamamlandı",
  hiatus: "Ara Verildi",
  cancelled: "Durduruldu",
  draft: "Hazırlıkta",
};

const STATUS_COLORS: Record<string, string> = {
  ongoing: "#03e889",
  completed: "#36e8ff",
  hiatus: "#c2f493",
  cancelled: "#FF3D00",
  draft: "#FFD600",
};

export const ProfileAuthorNovels = React.memo(
  ({ authorId }: { authorId: string }) => {
    const { theme, isDarkMode } = useAppTheme();
    const navigation = useAppNavigation();
    const { data, isLoading } = useAuthorNovelsQuery(authorId);
    const items = data?.items ?? [];

    return (
      <Tabs.ScrollView contentContainerStyle={styles.content}>
        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator color={theme.textPrimary} />
          </View>
        ) : items.length === 0 ? (
          <View style={styles.center}>
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
              Henüz eser yok
            </Text>

            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Bu yazarın yayında olan bir eseri bulunmuyor.
            </Text>
          </View>
        ) : (
          items.map((item) => {
            const statusColor = STATUS_COLORS[item.status] ?? theme.accent;

            return (
              <Pressable
                key={item.id}
                style={({ pressed }) => [
                  styles.row,
                  {
                    opacity: pressed ? 0.72 : 1,
                  },
                ]}
                onPress={() => navigation.navigate("Novel", { id: item.id })}
              >
                <View
                  style={[
                    styles.coverPlaceholder,
                    {
                      backgroundColor: isDarkMode
                        ? "rgba(255,255,255,0.055)"
                        : "#F1F5F9",
                    },
                  ]}
                >
                  {item.coverImage ? (
                    <Image
                      source={{ uri: item.coverImage }}
                      style={styles.coverImage}
                      contentFit="cover"
                    />
                  ) : null}
                </View>

                <View style={styles.info}>
                  <View style={styles.topContent}>
                    <Text
                      style={[styles.itemText, { color: theme.textPrimary }]}
                      numberOfLines={2}
                    >
                      {item.name}
                    </Text>

                    <View style={styles.statusRow}>
                      <StatusIcon color={statusColor} size={11} />
                      <Text style={[styles.statusText, { color: statusColor }]}>
                        {STATUS_LABELS[item.status] ?? item.status}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.metricsRow}>
                    <View style={styles.metricItem}>
                      <ChapterIcon color={theme.textSecondary} />
                      <Text
                        style={[
                          styles.metaText,
                          { color: theme.textSecondary },
                        ]}
                      >
                        {item.chapterCount} bölüm
                      </Text>
                    </View>

                    <View style={styles.metricItem}>
                      <ViewIcon color={theme.textSecondary} size={13} />
                      <Text
                        style={[
                          styles.metaText,
                          { color: theme.textSecondary },
                        ]}
                      >
                        {item.viewCount}
                      </Text>
                    </View>

                    <View style={styles.metricItem}>
                      <LittleRecommendIcon
                        color={theme.textSecondary}
                        size={13}
                      />
                      <Text
                        style={[
                          styles.metaText,
                          { color: theme.textSecondary },
                        ]}
                      >
                        %{item.recommendationRate ?? 0}
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            );
          })
        )}
      </Tabs.ScrollView>
    );
  },
);

const styles = StyleSheet.create({
  content: {
    marginTop: 12,
    paddingHorizontal: 8,
    paddingBottom: 24,
  },

  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
    padding: 10,
    borderRadius: 12,
  },

  coverPlaceholder: {
    width: 72,
    aspectRatio: 2 / 3,
    borderRadius: 8,
    overflow: "hidden",
  },

  coverImage: {
    width: "100%",
    height: "100%",
  },

  info: {
    flex: 1,
    minHeight: 104,
    paddingVertical: 2,
  },

  topContent: {
    gap: 6,
  },

  itemText: {
    fontFamily: "Mont-700",
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0,
  },

  metaText: {
    fontFamily: "Mont-500",
    fontSize: 10,
    lineHeight: 14,
    opacity: 0.72,
  },

  statusText: {
    fontFamily: "Mont-600",
    fontSize: 9,
    lineHeight: 13,
    letterSpacing: 0.4,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  metricsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
    marginTop: 8,
  },

  metricItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  center: {
    minHeight: 220,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  emptyTitle: {
    fontFamily: "Mont-700",
    fontSize: 15,
    marginBottom: 6,
  },

  emptyText: {
    fontFamily: "Mont-500",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
});
