import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { CategoryIcon } from "./icons/CategoryIcon";
import { useAppTheme } from "@/hooks/useTheme";

export const CategorySelect = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}: {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}) => {
  const { theme } = useAppTheme();

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <CategoryIcon color={theme.textPrimary} />
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
            style={{
              borderBottomWidth: selectedCategory === i ? 1 : 0,
              borderBottomColor: theme.textPrimary, // Çizgi rengi metinle uyumlu
            }}
            key={i}
          >
            <Text
              style={{
                fontFamily: "Mont-600",
                fontSize: 12,
                color:
                  selectedCategory === i
                    ? theme.textPrimary
                    : theme.textSecondary,
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
