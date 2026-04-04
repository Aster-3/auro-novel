import { Text, View, StyleSheet, Pressable, Alert } from "react-native";
import { CircleEditIcon } from "@/components/icons/CircleEditIcon";
import { RightArrowIcon } from "@/components/icons/RightArrowIcon";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { Tag } from "@/types/tag";
import { Category } from "@/types/category";
import { NameEditSheet } from "./NameEditSheet";
import { useCallback, useRef, useState } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { SynopsisEditSheet } from "./SynopsisEditSheet";
import { StatusEditSheet } from "./StatusEditSheet";
import { SeriesStatus } from "@/types/novel";
import { ProfileHeaderText } from "../ProfileScreen/ProfileHeaderText";

const getPressStyle = (pressed: boolean) => ({
  backgroundColor: pressed ? "#f0f0f0" : "transparent",
  opacity: pressed ? 0.7 : 1,
});

const options = [
  { id: "name", label: "Başlık" },
  {
    id: "status",
    label: "Yayın Durumu",
  },
  {
    id: "category",
    label: "Kategoriler",
  },
  {
    id: "tag",
    label: "Etiketler",
  },
  {
    id: "summary",
    label: "Özet",
  },
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
  const navigation = useAppNavigation();

  const handlePress = (option: any) => {
    if (option.id === "logout") {
      option.callback?.();
      return;
    }

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

      <View style={styles.container}>
        {options.map((option) => (
          <Pressable
            key={option.id}
            style={({ pressed }) => [
              styles.subcontainer,
              getPressStyle(pressed),
            ]}
            onPress={() => handlePress(option)}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Text style={styles.text}>{option.label}</Text>
              <CircleEditIcon size={18} color="#1C274C" />
            </View>
            <RightArrowIcon size={18} color="#1C274C" />
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
  },
  container: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    backgroundColor: "white",
    paddingHorizontal: 8,
    borderRadius: 16,
    alignItems: "center",
    gap: 8,
  },
  subcontainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    width: "100%",
    paddingVertical: 12,
  },
  text: { fontFamily: "Mont-500", fontSize: 14, color: "#03061E" },
});
