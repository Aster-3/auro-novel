import { Text, TextInput, View, StyleSheet } from "react-native";
import { SearchIcon } from "./icons/SearchIcon";
import React, { useRef } from "react";
import { useAppTheme } from "../hooks/useTheme";

export const SearchBar = ({
  value,
  setValue,
}: {
  value: string;
  setValue: (val: string) => void;
}) => {
  const inputRef = useRef<TextInput>(null);
  const { theme, isDarkMode } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? theme.surface : "#F0F4FF" },
      ]}
    >
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={setValue}
        style={[styles.input, { color: theme.textPrimary }]}
        autoFocus={true}
        // Klavye tarafındaki belirteç rengini de temaya uydurduk
        selectionColor={theme.accent}
        keyboardAppearance={isDarkMode ? "dark" : "light"}
      />

      <View style={styles.placeholderContainer} pointerEvents="none">
        <SearchIcon color={theme.textSecondary} />
        {value.length === 0 && (
          <Text
            style={[styles.placeholderText, { color: theme.textSecondary }]}
          >
            Search by Title
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 999,
    height: 40,
    position: "relative",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 16,
    paddingLeft: 42,
  },
  placeholderContainer: {
    position: "absolute",
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  placeholderText: {
    fontSize: 14,
  },
});
