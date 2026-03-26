import { Text, View, StyleSheet, Pressable, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CircleEditIcon } from "@/components/icons/CircleEditIcon";
import { RightArrowIcon } from "@/components/icons/RightArrowIcon";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { Tag } from "@/types/tag";
import { Category } from "@/types/category";

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
}: {
  id: string;
  tags: Tag[];
  categories: Category[];
}) => {
  const navigation = useAppNavigation();

  const handlePress = (option: any) => {
    if (option.id === "logout") {
      option.callback?.();
      return;
    }

    if (option.id === "category" || option.id === "tag") {
      navigation.navigate("UpdateTagCategory", {
        id: id,
        mode: option.id === "category" ? "category" : "tag",
        availableItems: option.id === "category" ? categories : tags,
      });
      return;
    }
  };

  return (
    <View style={styles.wrapper}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: 4,
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
