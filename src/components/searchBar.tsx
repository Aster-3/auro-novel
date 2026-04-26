import { Text, TextInput, View, StyleSheet } from "react-native";
import { SearchIcon2 } from "./icons/SearchIcon2"; // Tasarıma uyum için SearchIcon2
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

  // Diğer bileşenlerle uyumlu arka plan rengi
  const buttonBg = isDarkMode ? theme.surface : "#F1F5F9";

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
            color: theme.textPrimary,
            // İkonun üzerine yazı gelmemesi için sol boşluk
            paddingLeft: 40,
          },
        ]}
        placeholder="Search by Title"
        placeholderTextColor={theme.textSecondary}
        autoFocus={true}
        selectionColor={theme.accent}
        keyboardAppearance={isDarkMode ? "dark" : "light"}
      />

      {/* Arama İkonu - Input'un üzerinde sabit durur */}
      <View style={styles.iconContainer} pointerEvents="none">
        <SearchIcon2 size={16} color={theme.textSecondary} />
      </View>
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
    height: 44,
    borderRadius: 99,
    justifyContent: "center",
  },
  iconContainer: {
    position: "absolute",
    left: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
