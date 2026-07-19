import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { AboutBookIcon } from "@/components/icons/AboutBookIcon";
import { AddArchiveIcon } from "@/components/icons/AddArchiveIcon";
import { FlagIcon } from "@/components/icons/FlagIcon";
import { InArchiveIcon } from "@/components/icons/InArchiveIcon";
import { ShareIcon } from "@/components/icons/ShareIcon";
import { useLibraryCheck } from "@/hooks/useLibraryCheck";
import { useNovelDetail } from "@/hooks/useNovelDetail";
import { useToggleLibrary } from "@/hooks/useToggleLibrary";
import { globalNavigate, navigateToNovelSafe } from "@/navigation/globalNavigate";
import { useAuthStore } from "@/store/useAuthStore";
import { useReaderStore } from "@/store/useReaderStore";
import { useToastStore } from "@/store/useToastStore";
import NovelShareModal from "@/utils/NovelShareModal";

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
  const user = useAuthStore((state) => state.user);
  const [isShareModalVisible, setShareModalVisible] = useState(false);
  const { data: novelData } = useNovelDetail(novelId);
  const { data: isNovelInLibrary, isLoading: isLibraryLoading } =
    useLibraryCheck(novelId);
  const { mutate: toggleLibrary, isPending: isToggleLibraryPending } =
    useToggleLibrary(novelId);

  const colors = {
    text: isDarkMode ? "#E0E0E0" : "#1A1D23",
    subText: isDarkMode ? "#888B91" : "#9CA3AF",
    border: isDarkMode ? "#2D3139" : "#F6F6F6",
    iconColor: isDarkMode ? "#B0B3B8" : "#374151",
  };

  const handleSharePress = () => {
    if (!novelData) {
      return;
    }

    closeSheet();
    setTimeout(() => {
      setShareModalVisible(true);
    }, 150);
  };

  const handleLibraryPress = () => {
    if (!user) {
      useToastStore.getState().showToast({
        type: "Bilgi",
        message: "Romanı kütüphanene eklemek için giriş yapmalısın.",
      });
      return;
    }

    toggleLibrary();
  };

  const handleReportPress = () => {
    const novelName = novelData?.name || novelId;

    closeSheet();
    setTimeout(() => {
      globalNavigate(
        "SupportFeedback",
        {
          initialType: "report",
          initialSubject: `${novelName}: ${chapterId}`,
        },
        "push",
      );
    }, 150);
  };

  const options = [
    {
      id: "share",
      label: "Paylaş",
      icon: <ShareIcon color={colors.iconColor} size={16} />,
      onClick: handleSharePress,
      disabled: !novelData,
    },
    {
      id: "library",
      label: isNovelInLibrary ? "Kütüphanede" : "Kütüphaneye ekle",
      icon: isNovelInLibrary ? (
        <InArchiveIcon color={colors.iconColor} size={16} />
      ) : (
        <AddArchiveIcon color={colors.iconColor} size={16} />
      ),
      onClick: handleLibraryPress,
      disabled: isLibraryLoading || isToggleLibraryPending,
    },
    {
      id: "about",
      label: "Bu Kitap Hakkında",
      icon: <AboutBookIcon color={colors.iconColor} size={16} />,
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
      icon: <FlagIcon color={colors.iconColor} size={16} />,
      isDestructive: true,
      onClick: handleReportPress,
    },
  ];

  const renderOption = (item: (typeof options)[0], index: number) => (
    <TouchableOpacity
      key={item.id}
      onPress={item.onClick}
      activeOpacity={0.5}
      disabled={item.disabled}
      style={[
        styles.optionRow,
        { borderBottomColor: colors.border },
        item.disabled && styles.disabledOption,
        index === options.length - 1 && { borderBottomWidth: 0 },
      ]}
    >
      <View style={styles.leftContent}>
        <View style={styles.iconPlaceholder}>{item.icon}</View>
        <Text
          style={[
            styles.label,
            { color: item.isDestructive ? "#FF6B6B" : colors.text },
          ]}
        >
          {item.label}
        </Text>
      </View>

      <Text style={[styles.arrow, { color: colors.subText }]}>›</Text>
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

      {novelData ? (
        <NovelShareModal
          isVisible={isShareModalVisible}
          onClose={() => setShareModalVisible(false)}
          novel={novelData}
        />
      ) : null}
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
  disabledOption: {
    opacity: 0.55,
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
});
