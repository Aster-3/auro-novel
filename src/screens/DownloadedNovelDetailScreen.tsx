import { Fragment, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Header } from "@/components/Header";
import { Screen } from "@/components/layout/Screen";
import { CheckIcon } from "@/components/icons/CheckIcon";
import { DownloadedsIcon } from "@/components/icons/DownloadedsIcon";
import { TrashIcon } from "@/components/icons/TrashIcon";
import { RootStackParamList } from "@/constants/navigation";
import {
  useDeleteDownloadedChaptersMutation,
  useDownloadedNovelChaptersQuery,
  useDownloadedNovelDetailQuery,
} from "@/hooks/useDownloadedOfflineLibrary";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useAppTheme } from "@/hooks/useTheme";
import { useModalStore } from "@/store/useModalStore";
import { isPremiumActive, useAuthStore } from "@/store/useAuthStore";
import { DownloadedChapterRow } from "@/types/offline";

const STATUS_LABELS: Record<string, string> = {
  ongoing: "Devam ediyor",
  completed: "Tamamlandı",
  hiatus: "Ara verildi",
  cancelled: "Durduruldu",
  draft: "Hazırlıkta",
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(date));

const formatWordCount = (wordCount?: number) => {
  if (!wordCount) return null;
  return `${wordCount.toLocaleString("tr-TR")} kelime`;
};

const DownloadedNovelDetailScreen = () => {
  const route =
    useRoute<RouteProp<RootStackParamList, "DownloadedNovelDetail">>();
  const { novelId } = route.params;
  const navigation = useAppNavigation();
  const { theme, isDarkMode } = useAppTheme();
  const user = useAuthStore((state) => state.user);
  const isPremium = useAuthStore((state) => state.isPremium);
  const premiumUntil = useAuthStore((state) => state.premiumUntil);
  const canUseOfflineDownloads =
    !!user && isPremiumActive(isPremium, premiumUntil);
  const showConfirm = useModalStore((state) => state.showConfirm);
  const { data: novel, isLoading: isNovelLoading } =
    useDownloadedNovelDetailQuery(novelId);
  const { data: chapters = [], isLoading: isChaptersLoading } =
    useDownloadedNovelChaptersQuery(novelId);
  const deleteMutation = useDeleteDownloadedChaptersMutation(novelId);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const isSelectionMode = selectedIds.length > 0;
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const total =
    novel?.totalPublishedChapters || novel?.downloadedChapterCount || 0;
  const isLoading = isNovelLoading || isChaptersLoading;

  useEffect(() => {
    if (
      canUseOfflineDownloads &&
      !isNovelLoading &&
      !isChaptersLoading &&
      !novel
    ) {
      navigation.goBack();
    }
  }, [
    canUseOfflineDownloads,
    isChaptersLoading,
    isNovelLoading,
    navigation,
    novel,
  ]);

  const toggleSelected = (chapterId: string) => {
    setSelectedIds((current) =>
      current.includes(chapterId)
        ? current.filter((id) => id !== chapterId)
        : [...current, chapterId],
    );
  };

  const confirmDelete = (chapterIds: string[]) => {
    const count = chapterIds.length;
    showConfirm({
      title: count > 1 ? "Bölümleri Sil" : "Bölümü Sil",
      message:
        count > 1
          ? `${count} indirilen bölümü cihazından silmek istediğine emin misin?`
          : "Bu indirilen bölümü cihazından silmek istediğine emin misin?",
      confirmText: "Sil",
      cancelText: "Vazgeç",
      onConfirm: () => {
        deleteMutation.mutate(chapterIds, {
          onSuccess: () => setSelectedIds([]),
        });
      },
    });
  };

  const renderHero = () => {
    if (!novel) return null;

    return (
      <View style={styles.hero}>
        <View style={[styles.coverWrap, { backgroundColor: theme.surface }]}>
          {novel.coverImage ? (
            <Image
              source={{ uri: novel.coverImage }}
              style={styles.cover}
              contentFit="cover"
              transition={180}
            />
          ) : (
            <DownloadedsIcon size={26} color={theme.textSecondary} />
          )}
        </View>

        <View style={styles.heroBody}>
          <Text
            numberOfLines={2}
            style={[styles.novelTitle, { color: theme.textPrimary }]}
          >
            {novel.name}
          </Text>
          <View style={styles.heroMetaWrap}>
            <View
              style={[
                styles.metaPill,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.055)"
                    : "rgba(15,23,42,0.045)",
                },
              ]}
            >
              <DownloadedsIcon size={13} color={theme.textSecondary} />
              <Text
                style={[styles.metaPillText, { color: theme.textSecondary }]}
              >
                {novel.downloadedChapterCount} / {total} bölüm
              </Text>
            </View>
            {!!novel.status && (
              <Text style={[styles.statusText, { color: theme.textSecondary }]}>
                {STATUS_LABELS[novel.status] ?? novel.status}
              </Text>
            )}
          </View>
          {!!novel.synopsis && (
            <Text
              numberOfLines={3}
              style={[styles.heroSynopsis, { color: theme.textSecondary }]}
            >
              {novel.synopsis}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const renderSectionTitle = () => (
    <View style={styles.sectionTitleWrap}>
      <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
        Bölümler
      </Text>
      <View
        style={[
          styles.sectionLine,
          {
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.18)",
          },
        ]}
      />
    </View>
  );

  const renderVolumeHeader = (item: DownloadedChapterRow) => {
    const volumeLabel = `Cilt ${item.volumeOrder}${
      item.volumeName ? ` • ${item.volumeName}` : ""
    }`;

    return (
      <View style={styles.volumeHeader}>
        <Text style={[styles.volumeText, { color: theme.textPrimary }]}>
          {volumeLabel}
        </Text>
        <View
          style={[
            styles.volumeLine,
            {
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.23)",
            },
          ]}
        />
      </View>
    );
  };

  const renderChapter = ({
    item,
    index,
  }: {
    item: DownloadedChapterRow;
    index: number;
  }) => {
    const isSelected = selectedSet.has(item.id);
    const previousItem = chapters[index - 1];
    const showVolumeHeader =
      !previousItem || previousItem.volumeOrder !== item.volumeOrder;
    const metaText = [
      formatWordCount(item.wordCount),
      `İndirildi ${formatDate(item.downloadedAt)}`,
    ]
      .filter(Boolean)
      .join(" • ");

    return (
      <Fragment>
        {showVolumeHeader && renderVolumeHeader(item)}
        <Pressable
          onPress={() => {
            if (isSelectionMode) {
              toggleSelected(item.id);
              return;
            }
            navigation.navigate("ChapterRead", {
              id: item.id,
              isOffline: true,
            });
          }}
          onLongPress={() => toggleSelected(item.id)}
          style={({ pressed }) => [
            styles.chapterRow,
            {
              backgroundColor: isSelected
                ? isDarkMode
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(15,23,42,0.055)"
                : pressed
                  ? isDarkMode
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(15,23,42,0.035)"
                  : "transparent",
            },
          ]}
        >
          <View style={styles.orderBadge}>
            <Text style={[styles.orderText, { color: theme.textSecondary }]}>
              {String(item.chapterOrder).padStart(2, "0")}
            </Text>
          </View>

          <View style={styles.chapterText}>
            <Text
              numberOfLines={1}
              style={[styles.chapterTitle, { color: theme.textPrimary }]}
            >
              {item.title}
            </Text>
            <Text
              numberOfLines={1}
              style={[styles.chapterMeta, { color: theme.textSecondary }]}
            >
              {metaText}
            </Text>
          </View>

          {isSelectionMode ? (
            <View
              style={[
                styles.selectCircle,
                {
                  backgroundColor: isSelected ? theme.accent : "transparent",
                  borderColor: isSelected ? theme.accent : theme.textSecondary,
                },
              ]}
            >
              {isSelected && (
                <CheckIcon
                  color={isDarkMode ? "#000000" : "#FFFFFF"}
                  size={14}
                />
              )}
            </View>
          ) : (
            <Pressable
              hitSlop={10}
              onPress={() => confirmDelete([item.id])}
              style={styles.deleteButton}
            >
              <TrashIcon color="#EF4444" size={18} />
            </Pressable>
          )}
        </Pressable>
      </Fragment>
    );
  };

  return (
    <Screen backgroundColor={theme.background}>
      {isSelectionMode ? (
        <View style={styles.selectionHeader}>
          <Text style={[styles.selectionTitle, { color: theme.textPrimary }]}>
            {selectedIds.length} bölüm seçildi
          </Text>
          <View style={styles.selectionActions}>
            <Pressable onPress={() => setSelectedIds([])}>
              <Text
                style={[styles.selectionAction, { color: theme.textSecondary }]}
              >
                İptal
              </Text>
            </Pressable>
            <Pressable onPress={() => confirmDelete(selectedIds)}>
              <Text style={[styles.selectionDelete, { color: "#EF4444" }]}>
                Sil
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Header title="İndirilenler" isAdjacent={false} />
      )}

      {!canUseOfflineDownloads ? (
        <View style={styles.lockedState}>
          <View style={[styles.lockedIcon, { backgroundColor: theme.surface }]}>
            <DownloadedsIcon size={30} color={theme.textSecondary} />
          </View>
          <Text style={[styles.lockedTitle, { color: theme.textPrimary }]}>
            {user ? "Auro Pass gerekli" : "Giriş yapmalısın"}
          </Text>
          <Text style={[styles.lockedText, { color: theme.textSecondary }]}>
            {user
              ? "İndirilen bölümleri okumak için aktif Auro Pass hesabı gerekir."
              : "İndirilen bölümler hesaba bağlıdır. Devam etmek için giriş yap."}
          </Text>
        </View>
      ) : isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={theme.accent} />
        </View>
      ) : (
        <FlatList
          data={chapters}
          keyExtractor={(item) => item.id}
          renderItem={renderChapter}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListHeaderComponent={
            <>
              {renderHero()}
              {renderSectionTitle()}
            </>
          }
        />
      )}
    </Screen>
  );
};

export default DownloadedNovelDetailScreen;

const styles = StyleSheet.create({
  content: {
    paddingTop: 12,
    paddingBottom: 72,
  },
  hero: {
    flexDirection: "row",
    gap: 14,
    paddingBottom: 18,
  },
  coverWrap: {
    width: 104,
    aspectRatio: 2 / 3,
    borderRadius: 14,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  cover: {
    width: "100%",
    height: "100%",
  },
  heroBody: {
    flex: 1,
    justifyContent: "center",
    gap: 8,
    minWidth: 0,
  },
  novelTitle: {
    fontFamily: "Mont-800",
    fontSize: 20,
    lineHeight: 25,
  },
  heroMetaWrap: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  metaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  metaPillText: {
    fontFamily: "Mont-700",
    fontSize: 10,
  },
  statusText: {
    fontFamily: "Mont-600",
    fontSize: 10,
  },
  heroSynopsis: {
    fontFamily: "Mont-500",
    fontSize: 12,
    lineHeight: 18,
  },
  sectionTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingTop: 18,
    paddingBottom: 2,
  },
  sectionTitle: {
    fontFamily: "Mont-700",
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  sectionLine: {
    flex: 1,
    height: 0.5,
  },
  volumeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingTop: 22,
    paddingBottom: 6,
  },
  volumeText: {
    fontFamily: "Mont-500",
    fontSize: 8,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  volumeLine: {
    flex: 1,
    height: 0.5,
  },
  separator: {
    height: 6,
  },
  chapterRow: {
    minHeight: 72,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 4,
    paddingVertical: 10,
  },
  orderBadge: {
    width: 34,
    alignItems: "center",
  },
  orderText: {
    fontFamily: "Mont-600",
    fontSize: 11,
    opacity: 0.72,
  },
  chapterText: {
    flex: 1,
    gap: 6,
    minWidth: 0,
  },
  chapterTitle: {
    fontFamily: "Mont-600",
    fontSize: 13.5,
  },
  chapterMeta: {
    fontFamily: "Mont-500",
    fontSize: 10,
  },
  deleteButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  selectCircle: {
    width: 24,
    height: 24,
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  selectionHeader: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  selectionTitle: {
    fontFamily: "Mont-800",
    fontSize: 15,
  },
  selectionActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  selectionAction: {
    fontFamily: "Mont-700",
    fontSize: 13,
  },
  selectionDelete: {
    fontFamily: "Mont-800",
    fontSize: 13,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  lockedState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    gap: 10,
  },
  lockedIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  lockedTitle: {
    fontFamily: "Mont-700",
    fontSize: 15,
    textAlign: "center",
  },
  lockedText: {
    fontFamily: "Mont-500",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
});
