import { Text, TouchableOpacity, View } from "react-native";
import { SearchIcon } from "./icons/SearchIcon";
import { useAppNavigation } from "../hooks/useAppNavigation";
import { useAppTheme } from "../hooks/useTheme";

export const FakeSearchBar = () => {
  const navigation = useAppNavigation();
  const { theme, isDarkMode } = useAppTheme();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Search");
      }}
      style={{
        width: "100%",
        // Karanlık modda yüzey rengini (surface), aydınlık modda ise o ferah açık maviyi kullanıyoruz
        backgroundColor: isDarkMode ? theme.surface : "#F0F4FF",
        borderRadius: 99,
        height: 40,
        position: "relative",
      }}
    >
      <View
        style={{
          position: "absolute",
          left: 16,
          top: 0,
          bottom: 0,
          flexDirection: "row",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {/* İkon rengi de metin rengiyle uyumlu hale geldi */}
        <SearchIcon color={theme.textSecondary} />
        <Text style={{ fontSize: 14, color: theme.textSecondary }}>
          Search by Title
        </Text>
      </View>
    </TouchableOpacity>
  );
};
