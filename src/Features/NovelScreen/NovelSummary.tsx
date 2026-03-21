import { DownChevronIcon } from "@/components/icons/DownChevronIcon";
import { NovelTags } from "@/components/icons/NovelTags";
import { Tag } from "@/types/novel";
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
  },
  title: {
    fontSize: 16,
    fontFamily: "Mont-700",
    letterSpacing: -0.2,
    color: "#03061ed3",
  },
  quoteIcon: {
    fontSize: 40,
    color: "#E0E0E0",
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    lineHeight: 40,
    marginBottom: -15,
  },

  contentWrapper: {
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    gap: 8,
  },
  summaryText: {
    fontFamily: "Poppins-400",
    fontSize: 13,
    lineHeight: 21,
    color: "#475569",
    letterSpacing: -0.1,
  },
  readMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    alignSelf: "flex-start",
    paddingVertical: 2,
  },
  readMoreText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94A3B8",
  },
});
