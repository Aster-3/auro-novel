import React, { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { Header } from "@/components/Header";
import { Screen } from "@/components/layout/Screen";
import { DownloadedsIcon } from "@/components/icons/DownloadedsIcon";
import { RightChevronIcon } from "@/components/icons/RightChevronIcon";
import { StatusIcon } from "@/components/icons/StatusIcon";
import { TableOfContentsIcon } from "@/components/icons/TableOfContentsIcon";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useDownloadedNovelsQuery } from "@/hooks/useDownloadedOfflineLibrary";
import { useAppTheme } from "@/hooks/useTheme";
import { isPremiumActive, useAuthStore } from "@/store/useAuthStore";
import { DownloadedNovelSummary } from "@/types/offline";

const STATUS_LABELS: Record<string, string> = {
  ongoing: "Devam ediyor",
  completed: "Tamamlandı",
  hiatus: "Ara verildi",
  cancelled: "Durduruldu",
  draft: "Hazırlıkta",
};

const MetaItem = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => {
  const { theme } = useAppTheme();

  return (
    <View style={styles.metaItem}>
      {icon}
      <Text
        numberOfLines={1}
        style={[styles.rowMeta, { color: theme.textSecondary }]}
      >
        {label}
      </Text>
    </View>
  );
};

const DownloadedNovelRow = React.memo(
  ({ item }: { item: DownloadedNovelSummary }) => {
    const navigation = useAppNavigation();
    const { theme, isDarkMode } = useAppTheme();
    const iconColor = theme.textSecondary;
    const total = item.totalPublishedChapters || item.downloadedChapterCount;

    return (
      <Pressable
        onPress={() =>
          navigation.navigate("DownloadedNovelDetail", {
            novelId: item.novelId,
          })
        }
        style={({ pressed }) => [
          styles.row,
          {
            backgroundColor: pressed
              ? isDarkMode
                ? "rgba(255,255,255,0.04)"
                : "rgba(15,23,42,0.035)"
              : "transparent",
          },
        ]}
      >
        <View style={[styles.coverWrap, { backgroundColor: theme.surface }]}>
          {item.coverImage ? (
            <Image
              source={{ uri: item.coverImage }}
              style={styles.cover}
              contentFit="cover"
              transition={160}
            />
          ) : (
            <DownloadedsIcon size={22} color={theme.textSecondary} />
          )}
        </View>

        <View style={styles.rowBody}>
          <Text
            numberOfLines={1}
            style={[styles.rowTitle, { color: theme.textPrimary }]}
          >
            {item.name}
          </Text>
          <View style={styles.metaWrap}>
            <MetaItem
              icon={<DownloadedsIcon size={12} color={iconColor} />}
              label={`${item.downloadedChapterCount} indirildi`}
            />
            <MetaItem
              icon={<TableOfContentsIcon size={12} color={iconColor} />}
              label={`${item.downloadedChapterCount} / ${total} bölüm`}
            />
            {item.status ? (
              <MetaItem
                icon={<StatusIcon size={11} color={iconColor} />}
                label={STATUS_LABELS[item.status] ?? item.status}
              />
            ) : null}
          </View>
          {!!item.synopsis && (
            <Text
              numberOfLines={1}
              style={[styles.synopsis, { color: theme.textSecondary }]}
            >
              {item.synopsis}
            </Text>
          )}
        </View>

        <View style={styles.chevronWrap}>
          <RightChevronIcon size={16} color={theme.textSecondary} />
        </View>
      </Pressable>
    );
  },
);

const EmptyState = () => {
  const { theme } = useAppTheme();

  return (
    <View style={styles.emptyState}>
      <View style={[styles.emptyIcon, { backgroundColor: theme.surface }]}>
        <DownloadedsIcon size={30} color={theme.textSecondary} />
      </View>
      <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
        İndirilen bölüm yok
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
        Novel sayfalarından bölümleri indirerek çevrimdışı kitaplığını
        oluşturabilirsin.
      </Text>
    </View>
  );
};

const LockedState = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const { theme } = useAppTheme();

  return (
    <View style={styles.emptyState}>
      <View style={[styles.emptyIcon, { backgroundColor: theme.surface }]}>
        <DownloadedsIcon size={30} color={theme.textSecondary} />
      </View>
      <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
        {isLoggedIn ? "Auro Pass gerekli" : "Giriş yapmalısın"}
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
        {isLoggedIn
          ? "İndirilen bölümleri görüntülemek ve okumak için aktif Auro Pass hesabı gerekir."
          : "İndirilen bölümler hesaba bağlıdır. Devam etmek için giriş yap."}
      </Text>
    </View>
  );
};

const DownloadedChaptersScreen = () => {
  const { theme } = useAppTheme();
  const user = useAuthStore((state) => state.user);
  const isPremium = useAuthStore((state) => state.isPremium);
  const premiumUntil = useAuthStore((state) => state.premiumUntil);
  const canUseOfflineDownloads =
    !!user && isPremiumActive(isPremium, premiumUntil);
  const { data = [], isLoading } = useDownloadedNovelsQuery();

  const renderItem = useCallback(
    ({ item }: { item: DownloadedNovelSummary }) => (
      <DownloadedNovelRow item={item} />
    ),
    [],
  );

  return (
    <Screen backgroundColor={theme.background}>
      <Header title="İndirilenler" isAdjacent={false} />

      <View style={styles.resultsWrap}>
        {!canUseOfflineDownloads ? (
          <LockedState isLoggedIn={!!user} />
        ) : (
          <>
            {isLoading ? (
              <View style={styles.loadingWrap}>
                <ActivityIndicator size="small" color={theme.accent} />
              </View>
            ) : (
              <>
                <FlatList
                  data={data}
                  keyExtractor={(item) => item.novelId}
                  renderItem={renderItem}
                  contentContainerStyle={styles.listContent}
                  ItemSeparatorComponent={() => (
                    <View style={styles.separator} />
                  )}
                  showsVerticalScrollIndicator={false}
                  ListEmptyComponent={<EmptyState />}
                />
              </>
            )}
          </>
        )}

        {canUseOfflineDownloads && !!data.length && !isLoading && (
          <View
            style={[
              styles.stickyNote,
              {
                backgroundColor: theme.background,
                borderTopColor: theme.backgroundSecondary,
              },
            ]}
          >
            <Text style={[styles.securityNote, { color: theme.textSecondary }]}>
              Hesaptan çıkış yaptığında indirilen tüm bölümler bu cihazdan
              silinir.
            </Text>
          </View>
        )}
      </View>
    </Screen>
  );
};

export default DownloadedChaptersScreen;

const styles = StyleSheet.create({
  resultsWrap: {
    flex: 1,
    paddingTop: 12,
  },
  resultLabel: {
    fontFamily: "Mont-600",
    fontSize: 11,
    lineHeight: 15,
    opacity: 0.62,
    marginBottom: 10,
  },
  securityNote: {
    fontFamily: "Mont-500",
    fontSize: 10,
    lineHeight: 15,
    opacity: 0.58,
    textAlign: "center",
  },
  stickyNote: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    paddingTop: 10,
    paddingBottom: 12,
    paddingHorizontal: 18,
  },
  listContent: {
    paddingBottom: 124,
    flexGrow: 1,
  },
  separator: {
    height: 8,
  },
  row: {
    minHeight: 92,
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 4,
    flexDirection: "row",
    gap: 12,
  },
  chevronWrap: {
    alignSelf: "center",
    height: 32,
    justifyContent: "center",
  },
  coverWrap: {
    width: 70,
    aspectRatio: 2 / 3,
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  cover: {
    width: "100%",
    height: "100%",
  },
  rowBody: {
    flex: 1,
    gap: 7,
    minWidth: 0,
    paddingTop: 4,
  },
  rowTitle: {
    fontFamily: "Mont-600",
    fontSize: 14,
    lineHeight: 19,
  },
  metaWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 10,
    rowGap: 4,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    maxWidth: "100%",
    flexShrink: 1,
  },
  rowMeta: {
    fontFamily: "Mont-500",
    fontSize: 10,
    lineHeight: 14,
  },
  synopsis: {
    fontFamily: "Mont-500",
    fontSize: 11,
    lineHeight: 15,
    opacity: 0.8,
  },
  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingBottom: 72,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  emptyTitle: {
    fontFamily: "Mont-700",
    fontSize: 15,
    marginBottom: 5,
    textAlign: "center",
  },
  emptySubtitle: {
    fontFamily: "Mont-500",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
});
