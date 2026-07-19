import { DownChevronIcon } from "@/components/icons/DownChevronIcon";
import { NovelTags } from "@/components/icons/NovelTags";
import { Tag } from "@/types/tag";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { useReaderStore } from "@/store/useReaderStore";
import { useAppTheme } from "@/hooks/useTheme";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const NovelSummary = ({
  summary,
  tags,
  isAdultContent,
}: {
  summary: string | null;
  tags: Tag[];
  isAdultContent: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const { theme } = useAppTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>Özet</Text>

      <NovelTags tags={tags} isAdultContent={isAdultContent} />

      <View
        style={[styles.contentBlock, { borderLeftColor: theme.textPrimary }]}
      >
        <Text
          onPress={toggleExpanded}
          style={[styles.summaryText, { color: theme.textPrimary }]}
          numberOfLines={expanded ? undefined : 3}
        >
          {summary ? summary : "Yazar tarafından henüz bir özet girilmedi..."}
        </Text>

        <TouchableOpacity
          onPress={toggleExpanded}
          activeOpacity={0.7}
          style={styles.readMoreButton}
        >
          <Text style={[styles.readMoreText, { color: theme.textSecondary }]}>
            {expanded ? "Daha az göster" : "Devamını oku"}
          </Text>
          <View
            style={{
              transform: [{ rotate: expanded ? "180deg" : "0deg" }],
              opacity: 0.8,
            }}
          >
            <DownChevronIcon color={theme.textSecondary} size={12} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 0,
  },
  title: {
    fontFamily: "Mont-700", // Kallavi başlık kuralı
    fontSize: 16,
    letterSpacing: -0.5,
  },
  contentBlock: {
    borderLeftWidth: 1,
    paddingLeft: 16,
    marginLeft: 2,
    gap: 6,
  },
  summaryText: {
    fontFamily: "Mont-500",
    fontSize: 13,
    lineHeight: 22,
    letterSpacing: -0.1,
  },
  readMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  readMoreText: {
    fontSize: 12,
    fontFamily: "Mont-600",
  },
});
