import { Text, TextInput, View, StyleSheet } from "react-native";
import { SearchIcon } from "./icons/SearchIcon";
import React, { useRef, useState } from "react";

export const SearchBar = ({
  value,
  setValue,
}: {
  value: string;
  setValue: (val: string) => void;
}) => {
  const inputRef = useRef<TextInput>(null);

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={setValue}
        style={styles.input}
        autoFocus={true}
      />

      <View style={styles.placeholderContainer} pointerEvents="none">
        <SearchIcon />
        {value.length === 0 && (
          <Text style={styles.placeholderText}>Search by Title</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4FF",
    borderRadius: 999,
    height: 40,
    position: "relative",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#363b60",
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
    color: "gray",
  },
});
