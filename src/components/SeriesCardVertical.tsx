import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useAppTheme } from "@/hooks/useTheme";

interface Props {
  id: string;
  cover: string;
  name: string;
}

export const SeriesCardVertical = ({ id, cover, name }: Props) => {
  const navigation = useAppNavigation();
  const { theme } = useAppTheme();

  return (
    <View style={s.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.push("Novel", { id });
        }}
        style={[s.coverWrapper, { backgroundColor: theme.surface }]}
      >
        <Image
          source={{ uri: String(cover) }}
          style={s.image}
          contentFit="cover"
          transition={200}
        />
      </TouchableOpacity>

      <Text
        numberOfLines={2}
        style={[s.nameText, { color: theme.textPrimary }]}
      >
        {name}
      </Text>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    width: 105,
    gap: 8,
  },
  coverWrapper: {
    width: "100%",
    aspectRatio: 2 / 3,
    borderRadius: 14,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  nameText: {
    fontFamily: "Mont-600",
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center",
    letterSpacing: -0.4,
    paddingHorizontal: 2,
  },
});
