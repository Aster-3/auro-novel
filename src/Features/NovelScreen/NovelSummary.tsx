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
} from "react-native";

export const NovelSummary = ({
  summary,
  tags,
}: {
  summary: string;
  tags: Tag[];
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={s.container}>
      <View style={s.headerRow}>
        <Text style={s.title}>Özet</Text>
        <Text style={s.quoteIcon}>"</Text>
      </View>

      <NovelTags tags={tags} />

      <View style={s.contentWrapper}>
        <Text
          onPress={toggleExpanded}
          style={s.summaryText}
          numberOfLines={expanded ? undefined : 4}
        >
          {summary ? summary : "Yazar tarafından henüz bir özet girilmedi..."}
        </Text>

        <TouchableOpacity
          onPress={toggleExpanded}
          activeOpacity={0.7}
          style={s.readMoreButton}
        >
          <Text style={s.readMoreText}>
            {expanded ? "Küçült" : "Tümünü gör"}
          </Text>
          <View
            style={{ transform: [{ rotate: expanded ? "180deg" : "0deg" }] }}
          >
            <DownChevronIcon color="#94A3B8" size={14} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 2, // Başlığın kutuyla tam hizalanması için
  },
  title: {
    fontSize: 17, // iOS standart başlık boyutu
    fontFamily: "Mont-700",
    letterSpacing: -0.4,
    color: "#1C1C1E", // Daha net bir siyah
  },
  quoteIcon: {
    fontSize: 44,
    color: "#E5E5EA", // Daha soft bir gri
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    lineHeight: 44,
    marginBottom: -18,
  },
  contentWrapper: {
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    gap: 8,
  },
  summaryText: {
    fontFamily: "Poppins-400",
    fontSize: 13.5, // Okunabilirliği artırmak için hafif büyütüldü
    lineHeight: 22,
    color: "#3A3A3C", // Apple'ın ikincil metin rengi
    letterSpacing: -0.2,
  },
  readMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    marginTop: 4,
    paddingVertical: 4,
  },
  readMoreText: {
    fontSize: 12,
    fontFamily: "Mont-600",
    color: "#8E8E93", // Daha klas bir gri tonu
  },
});
