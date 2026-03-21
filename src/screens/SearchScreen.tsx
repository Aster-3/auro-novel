import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Screen } from "../components/layout/Screen";
import { useState } from "react";
import { SearchHeader } from "../Features/SearchScreen/SearchHeader";
const SearchScreen = () => {
  const [value, setValue] = useState<string>("");

  return (
    <Screen>
      <SearchHeader value={value} setValue={setValue} />
      <View>
        <Text style={styles.text1}>Placeholder for SearchScreen</Text>
      </View>
    </Screen>
  );
};
export default SearchScreen;

const styles = StyleSheet.create({
  text1: {
    color: "red",
  },
});
