import React, { useRef } from "react";
import { Pressable, TextInput, View, StyleSheet } from "react-native";
import { SearchIcon2 } from "./icons/SearchIcon2";
import { XIcon } from "./icons/XIcon";
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

  const buttonBg = isDarkMode ? theme.surface : "#F8FAFC";
  const borderColor = isDarkMode ? "rgba(255,255,255,0.08)" : "#E5E7EB";

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={setValue}
        style={[
          styles.input,
          {
            backgroundColor: buttonBg,
            borderColor,
            color: theme.textPrimary,
            paddingLeft: 40,
            paddingRight: value ? 42 : 16,
          },
        ]}
        placeholder="Tüm romanlarda ara"
        placeholderTextColor={theme.textSecondary}
        autoFocus={true}
        selectionColor={theme.accent}
        keyboardAppearance={isDarkMode ? "dark" : "light"}
      />

      <View style={styles.iconContainer} pointerEvents="none">
        <SearchIcon2 size={16} color={theme.textSecondary} />
      </View>

      {value ? (
        <Pressable
          onPress={() => setValue("")}
          hitSlop={10}
          style={({ pressed }) => [
            styles.clearButton,
            {
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.06)"
                : "rgba(15,23,42,0.06)",
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <XIcon size={10} color={theme.textSecondary} />
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    fontFamily: "Mont-500",
    fontSize: 12,
  },
  iconContainer: {
    position: "absolute",
    left: 13,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  clearButton: {
    position: "absolute",
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
