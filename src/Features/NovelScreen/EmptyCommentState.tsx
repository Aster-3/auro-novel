import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import ghost from "@assets/state-illustrations/unhappy.png";
export const EmptyCommentState = () => {
  return (
    <View style={styles.container}>
      <Image source={ghost} style={styles.ghostImage} resizeMode="contain" />
      <Text style={styles.description}>Bu seriye henüz yorum yapılmamış.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    gap: 8,
  },
  ghostImage: {
    width: 55,
    marginRight: 10,
  },
  description: {
    fontFamily: "Mont-500",
    fontSize: 14,
    color: "#7e8a9b",
  },
});
