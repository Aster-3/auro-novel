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
    <View style={styles.container}>
      <Text style={styles.title}>Hakkında</Text>
      <NovelTags tags={tags} />

      <View style={styles.quoteBlock}>
        <Text
          onPress={toggleExpanded}
          style={styles.summaryText}
          numberOfLines={expanded ? undefined : 4}
        >
          {summary ? summary : "Yazar tarafından henüz bir özet girilmedi..."}
        </Text>

        <TouchableOpacity
          onPress={toggleExpanded}
          activeOpacity={0.7}
          style={styles.readMoreButton}
        >
          <Text style={styles.readMoreText}>
            {expanded ? "Kısalt" : "Devamını Gör"}
          </Text>
          <View
            style={{ transform: [{ rotate: expanded ? "180deg" : "0deg" }] }}
          >
            <DownChevronIcon color="#111827" size={14} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 12 },
  title: {
    fontFamily: "Mont-700",
    fontSize: 15,
    color: "#03061ed3",
    letterSpacing: -0.2,
  },
  quoteBlock: {
    borderLeftWidth: 3,
    borderLeftColor: "#111827be",
    paddingLeft: 16,
    marginLeft: 4,
    gap: 8,
  },
  summaryText: {
    marginTop: 8,
    fontFamily: "Mont-500",
    fontSize: 13,
    letterSpacing: -0.1,
    lineHeight: 24,
    color: "#29303b",
  },
  readMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  readMoreText: {
    fontSize: 12,
    fontFamily: "Mont-700",
    color: "#111827",
    textDecorationLine: "underline",
  },
});
