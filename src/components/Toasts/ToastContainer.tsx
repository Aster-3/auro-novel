import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { useToastStore } from "@/store/useToastStore";
import { ToastItem } from "./ToastItem";

export const ToastContainer = () => {
  const { toasts } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <View pointerEvents="box-none" style={styles.container}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: Platform.OS === "ios" ? 58 : 40,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 9999,
  },
});
