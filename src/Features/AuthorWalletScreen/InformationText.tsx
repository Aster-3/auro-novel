import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { ChevronBottomIcon } from "@/components/icons/ChevronBottomIcon";

export const InformationText = ({
  informatinoText,
}: {
  informatinoText: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Metin yoksa hiçbir şey dönme
  if (!informatinoText) return null;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => setIsExpanded(!isExpanded)}
      style={styles.container}
    >
      <View style={styles.contentWrapper}>
        <Text
          style={styles.informationText}
          numberOfLines={isExpanded ? undefined : 2} // Kapalıyken 2 satır, açıkken sınırsız
          ellipsizeMode="tail"
        >
          {informatinoText}
        </Text>

        <View
          style={[
            styles.iconContainer,
            { transform: [{ rotate: isExpanded ? "180deg" : "0deg" }] },
          ]}
        >
          <ChevronBottomIcon size={16} color="#1c274cbb" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    width: "100%",
  },
  contentWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 4,
  },
  informationText: {
    flex: 1,
    fontFamily: "Mont-400",
    color: "#1c274cbb",
    fontSize: 10,
    lineHeight: 14,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
