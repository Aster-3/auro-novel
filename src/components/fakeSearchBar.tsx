import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SearchIcon } from "./icons/SearchIcon";
import { useAppNavigation } from "../hooks/useAppNavigation";

export const FakeSearchBar = () => {
  const navigation = useAppNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Search");
      }}
      style={{
        width: "100%",
        backgroundColor: "#F0F4FF",
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
        <SearchIcon />
        <Text style={{ fontSize: 14, color: "gray" }}>Search by Title</Text>
      </View>
    </TouchableOpacity>
  );
};
