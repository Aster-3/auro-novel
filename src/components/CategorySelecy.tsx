import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { CategoryIcon } from "./icons/CategoryIcon";

export const CategorySelect = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}: {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <CategoryIcon />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 16 }}
      >
        {categories.map((i) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedCategory(i);
            }}
            style={{ borderBottomWidth: selectedCategory === i ? 1 : 0 }}
            key={i}
          >
            <Text
              style={{
                fontFamily: "Mont-600",
                fontSize: 12,
                color: selectedCategory === i ? "#000000" : "#717171",
              }}
            >
              {i}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};
