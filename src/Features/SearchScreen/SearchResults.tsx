import React, { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { EmptyListGhost } from "@/components/StateIcons/EmptyListGhost";
import { LittleEyeIcon } from "@/components/icons/LittleEyeIcon";
import { LittleRecommendIcon } from "@/components/icons/LittleRecommendIcon";
import { RightChevronIcon } from "@/components/icons/RightChevronIcon";
import { SearchIcon2 } from "@/components/icons/SearchIcon2";
import { StatusIcon } from "@/components/icons/StatusIcon";
import { TableOfContentsIcon } from "@/components/icons/TableOfContentsIcon";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useAppTheme } from "@/hooks/useTheme";
import { useSearchNovels } from "@/hooks/useSearchNovels";
import { SearchNovel, SeriesStatus } from "@/types/novel";

const STATUS_LABELS: Record<string, string> = {
  [SeriesStatus.ONGOING]: "Devam ediyor",
  [SeriesStatus.COMPLETED]: "Tamamlandı",
  [SeriesStatus.HIATUS]: "Ara verildi",
  [SeriesStatus.CANCELLED]: "Durduruldu",
  [SeriesStatus.DRAFT]: "Hazırlıkta",
};

const normalizeItems = (data: any): SearchNovel[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data.items ?? [];
};

const getTotalCount = (data: any, itemsLength: number) => {
  if (!data || Array.isArray(data)) return itemsLength;
  return typeof data.total === "number" ? data.total : itemsLength;
};

const formatViewCount = (count: number) => {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}B`;
  return String(count);
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

const SearchResultRow = React.memo(({ item }: { item: SearchNovel }) => {
  const navigation = useAppNavigation();
  const { theme, isDarkMode } = useAppTheme();

  const iconColor = theme.textSecondary;

  return (
    <Pressable
      onPress={() => navigation.navigate("Novel", { id: item.id })}
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
            transition={140}
          />
        ) : (
          <SearchIcon2 size={20} color={theme.textSecondary} />
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
            icon={<StatusIcon size={11} color={iconColor} />}
            label={STATUS_LABELS[item.status] ?? item.status}
          />
          <MetaItem
            icon={<TableOfContentsIcon size={12} color={iconColor} />}
            label={`${item.chapterCount} bölüm`}
          />
          <MetaItem
            icon={<LittleEyeIcon size={13} color={iconColor} />}
            label={`${formatViewCount(item.viewCount)} görüntülenme`}
          />
          {item.recommendationRate !== null ? (
            <MetaItem
              icon={<LittleRecommendIcon size={13} color={iconColor} />}
              label={`%${item.recommendationRate} öneri`}
            />
          ) : null}
        </View>
      </View>

      <RightChevronIcon size={16} color={theme.textSecondary} />
    </Pressable>
  );
});

const EmptyState = ({
  type,
  query,
}: {
  type: "idle" | "loading" | "empty" | "error";
  query: string;
}) => {
  const { theme } = useAppTheme();

  const icon =
    type === "idle" ? (
      <SearchIcon2 size={28} color={theme.textSecondary} />
    ) : type === "loading" ? (
      <ActivityIndicator size="small" color={theme.accent} />
    ) : (
      <EmptyListGhost size={42} color={theme.textSecondary} strokeWidth={42} />
    );

  const title =
    type === "idle"
      ? "Arama"
      : type === "loading"
        ? "Aranıyor"
        : type === "error"
          ? "Arama tamamlanamadı"
          : "Sonuç bulunamadı";

  const subtitle =
    type === "idle"
      ? "Tüm romanlarda ara"
      : type === "loading"
        ? query
        : type === "error"
          ? "Tekrar dene"
          : query;

  return (
    <View style={styles.emptyState}>
      <View style={[styles.emptyIcon, { backgroundColor: theme.surface }]}>
        {icon}
      </View>
      <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
        {title}
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
        {subtitle}
      </Text>
    </View>
  );
};

export const SearchResults = ({ query }: { query: string }) => {
  const trimmedQuery = query.trim();
  const { theme } = useAppTheme();
  const { data, isLoading, isError } = useSearchNovels(trimmedQuery);

  const items = useMemo(() => normalizeItems(data), [data]);
  const totalCount = useMemo(
    () => getTotalCount(data, items.length),
    [data, items.length],
  );

  const renderItem = useCallback(
    ({ item }: { item: SearchNovel }) => <SearchResultRow item={item} />,
    [],
  );

  if (!trimmedQuery) {
    return <EmptyState type="idle" query="" />;
  }

  if (isLoading && !data) {
    return <EmptyState type="loading" query={trimmedQuery} />;
  }

  if (isError) {
    return <EmptyState type="error" query={trimmedQuery} />;
  }

  return (
    <View style={styles.resultsWrap}>
      <Text style={[styles.resultLabel, { color: theme.textSecondary }]}>
        {totalCount ? `${totalCount} sonuç` : "Sonuçlar"}
      </Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={<EmptyState type="empty" query={trimmedQuery} />}
      />
    </View>
  );
};

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
  listContent: {
    paddingBottom: 96,
    flexGrow: 1,
  },
  separator: {
    height: 8,
  },
  row: {
    minHeight: 88,
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 4,
    flexDirection: "row",
    gap: 12,
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
