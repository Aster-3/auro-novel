import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useReaderStore } from "@/store/useReaderStore";
import { ShareIcon } from "@/components/icons/ShareIcon";
// import { BookmarkIcon } from "@/components/icons/BookmarkIcon";
import { DownloadedsIcon } from "@/components/icons/DownloadedsIcon";
import { AboutBookIcon } from "@/components/icons/AboutBookIcon";
import { FlagIcon } from "@/components/icons/FlagIcon";
import {
  globalNavigate,
  navigateToNovelSafe,
} from "@/navigation/globalNavigate";
export const MoreOptions = ({
  novelId,
  chapterId,
  closeSheet,
}: {
  novelId: string;
  closeSheet: () => void;
  chapterId: string;
}) => {
  const isDarkMode = useReaderStore((state) => state.isDarkMode);

  const colors = {
    text: isDarkMode ? "#E0E0E0" : "#1A1D23",
    subText: isDarkMode ? "#888B91" : "#9CA3AF",
    border: isDarkMode ? "#2D3139" : "#F6F6F6",
    iconColor: isDarkMode ? "#B0B3B8" : "#374151",
  };

  const options = [
    { id: "share", label: "Paylaş", icon: "share", onClick: () => {} },
    {
      id: "bookmark",
      label: "Yer İşareti",
      icon: "bookmark",
      onClick: () => {},
    },
    // { id: "download", label: "İndir", icon: "download" },
    {
      id: "about",
      label: "Bu Kitap Hakkında",
      icon: "info",
      onClick: () => {
        closeSheet();
        setTimeout(() => {
          navigateToNovelSafe(novelId, chapterId);
        }, 150);
      },
    },
    {
      id: "report",
      label: "Şikayet Et",
      icon: "flag",
      isDestructive: true,
      onClick: () => {},
    },
  ];

  const iconMap: { [key: string]: React.ReactNode } = {
    share: <ShareIcon color={colors.iconColor} size={16} />,
    bookmark: <ShareIcon color={colors.iconColor} size={16} />,
    download: <DownloadedsIcon color={colors.iconColor} size={16} />,
    info: <AboutBookIcon color={colors.iconColor} size={16} />,
    flag: <FlagIcon color={colors.iconColor} size={16} />,
  };

  const renderOption = (item: (typeof options)[0], index: number) => (
    <TouchableOpacity
      key={item.id}
      onPress={item.onClick}
      activeOpacity={0.5}
      style={[
        styles.optionRow,
        { borderBottomColor: colors.border },
        index === options.length - 1 && { borderBottomWidth: 0 },
      ]}
    >
      <View style={styles.leftContent}>
        <View style={styles.iconPlaceholder}>{iconMap[item.icon]}</View>
        <Text
          style={[
            styles.label,
            { color: item.isDestructive ? "#FF6B6B" : colors.text },
          ]}
        >
          {item.label}
        </Text>
      </View>

      <Text style={[styles.arrow, { color: colors.subText }]}></Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.subText }]}>
        SEÇENEKLER
      </Text>
      <View style={styles.listContainer}>
        {options.map((opt, i) => renderOption(opt, i))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 36,
    paddingTop: 12,
  },
  sectionTitle: {
    fontFamily: "Mont-500",
    fontSize: 9,
    letterSpacing: 2.5,
    marginBottom: 20,
    textTransform: "uppercase",
    opacity: 0.8,
  },
  listContainer: {
    width: "100%",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    borderBottomWidth: 0.4,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconPlaceholder: {
    width: 24,
    marginRight: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontFamily: "Mont-300",
    fontSize: 14,
    letterSpacing: 0.4,
  },
  arrow: {
    fontSize: 14,
    fontWeight: "200",
    opacity: 0.5,
  },
  thinIcon: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderRadius: 4,
  },
});
