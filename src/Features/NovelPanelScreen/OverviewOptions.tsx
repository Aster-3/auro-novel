import { Text, View, StyleSheet, Pressable } from "react-native";
import { CircleEditIcon } from "@/components/icons/CircleEditIcon";
import { RightArrowIcon } from "@/components/icons/RightArrowIcon";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { Tag } from "@/types/tag";
import { Category } from "@/types/category";
import { NameEditSheet } from "./NameEditSheet";
import { useCallback, useRef } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { SynopsisEditSheet } from "./SynopsisEditSheet";
import { StatusEditSheet } from "./StatusEditSheet";
import { SeriesStatus } from "@/types/novel";
import { ProfileHeaderText } from "../ProfileScreen/ProfileHeaderText";
import { useAppTheme } from "@/hooks/useTheme"; // Temayı ekledik

const options = [
  { id: "name", label: "Başlık" },
  { id: "status", label: "Yayın Durumu" },
  { id: "category", label: "Kategoriler" },
  { id: "tag", label: "Etiketler" },
  { id: "summary", label: "Özet" },
];

export const OverviewOptions = ({
  id,
  tags,
  categories,
  summary,
  name,
  status,
}: {
  id: string;
  tags: Tag[];
  categories: Category[];
  summary: string;
  name: string;
  status: SeriesStatus;
}) => {
  const { theme, isDarkMode } = useAppTheme();
  const navigation = useAppNavigation();

  const handlePress = (option: any) => {
    if (option.id === "category" || option.id === "tag") {
      navigation.push("UpdateTagCategory", {
        id: id,
        mode: option.id === "category" ? "category" : "tag",
        availableItems: option.id === "category" ? categories : tags,
      });
      return;
    } else {
      if (option.id === "name") {
        openNameEditSheet();
      } else if (option.id === "summary") {
        openSynopsisEditSheet();
      } else if (option.id === "status") {
        openStatusEditSheet();
      }
    }
  };

  const nameEditSheetRef = useRef<BottomSheetModal>(null);
  const synopsisEditSheetRef = useRef<BottomSheetModal>(null);
  const statusEditSheetRef = useRef<BottomSheetModal>(null);

  const openNameEditSheet = useCallback(() => {
    nameEditSheetRef.current?.present();
  }, []);

  const openSynopsisEditSheet = useCallback(() => {
    synopsisEditSheetRef.current?.present();
  }, []);

  const openStatusEditSheet = useCallback(() => {
    statusEditSheetRef.current?.present();
  }, []);

  return (
    <View style={styles.wrapper}>
      <ProfileHeaderText title="Genel Bilgiler" />

      <View style={[styles.container, { backgroundColor: theme.surface }]}>
        {options.map((option) => (
          <Pressable
            key={option.id}
            style={({ pressed }) => [
              styles.subcontainer,
              {
                backgroundColor: pressed
                  ? isDarkMode
                    ? "rgba(255,255,255,0.05)"
                    : "#f0f0f0"
                  : "transparent",
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            onPress={() => handlePress(option)}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <Text style={[styles.text, { color: theme.textPrimary }]}>
                {option.label}
              </Text>
              <CircleEditIcon size={16} color={theme.textSecondary} />
            </View>
            <RightArrowIcon size={16} color={theme.textSecondary} />
          </Pressable>
        ))}
      </View>

      <NameEditSheet ref={nameEditSheetRef} id={id} initialName={name} />
      <SynopsisEditSheet
        ref={synopsisEditSheetRef}
        id={id}
        initialSynopsis={summary}
      />
      <StatusEditSheet
        ref={statusEditSheetRef}
        id={id}
        initialStatus={status}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
    marginTop: 16,
  },
  container: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 20,
    alignItems: "center",
    gap: 2,
  },
  subcontainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderRadius: 14,
    width: "100%",
    paddingVertical: 14,
  },
  text: {
    fontFamily: "Mont-500",
    fontSize: 14,
  },
});
