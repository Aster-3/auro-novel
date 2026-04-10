import React, { useRef, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import { useModalStore } from "@/store/useModalStore";
import { useAppTheme } from "@/hooks/useTheme"; // Temayı ekledik

export const GlobalConfirmModal = () => {
  const { isVisible, config, hideModal } = useModalStore();
  const { theme, isDarkMode } = useAppTheme();

  const cancelAnim = useRef(new Animated.Value(1)).current;
  const confirmAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isVisible) {
      cancelAnim.setValue(1);
      confirmAnim.setValue(1);
    }
  }, [isVisible, cancelAnim, confirmAnim]);

  if (!config) return null;

  const handlePressIn = (anim: Animated.Value) => {
    Animated.spring(anim, {
      toValue: 0.94,
      useNativeDriver: true,
      friction: 8,
      tension: 120,
    }).start();
  };

  const handlePressOut = (anim: Animated.Value) => {
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const onCancelPress = () => {
    cancelAnim.setValue(1);
    hideModal();
  };

  const onConfirmPress = () => {
    confirmAnim.setValue(1);
    config.onConfirm();
    hideModal();
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={hideModal}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.content, { backgroundColor: theme.surface }]}>
              <View style={styles.header}>
                <Text style={[styles.title, { color: theme.textPrimary }]}>
                  {config.title}
                </Text>
                <Text style={[styles.message, { color: theme.textSecondary }]}>
                  {config.message}
                </Text>
              </View>

              <View style={styles.buttons}>
                {/* CANCEL */}
                <Animated.View
                  style={[
                    styles.buttonContainer,
                    {
                      transform: [{ scale: cancelAnim }],
                      opacity: cancelAnim.interpolate({
                        inputRange: [0.94, 1],
                        outputRange: [0.7, 1],
                      }),
                    },
                  ]}
                >
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPressIn={() => handlePressIn(cancelAnim)}
                    onPressOut={() => handlePressOut(cancelAnim)}
                    onPress={onCancelPress}
                    style={[
                      styles.btn,
                      {
                        backgroundColor: isDarkMode
                          ? "rgba(255,255,255,0.05)"
                          : "#f3f4f6",
                      },
                    ]}
                  >
                    <Text
                      style={[styles.btnText, { color: theme.textPrimary }]}
                    >
                      {config.cancelText || "Vazgeç"}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>

                {/* CONFIRM */}
                <Animated.View
                  style={[
                    styles.buttonContainer,
                    {
                      transform: [{ scale: confirmAnim }],
                      opacity: confirmAnim.interpolate({
                        inputRange: [0.94, 1],
                        outputRange: [0.7, 1],
                      }),
                    },
                  ]}
                >
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPressIn={() => handlePressIn(confirmAnim)}
                    onPressOut={() => handlePressOut(confirmAnim)}
                    onPress={onConfirmPress}
                    style={[
                      styles.btn,
                      { backgroundColor: theme.textPrimary }, // Ana metin rengi butonun dolgusu oldu
                    ]}
                  >
                    <Text style={[styles.btnText, { color: theme.background }]}>
                      {config.confirmText || "Onayla"}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)", // Overlay biraz daha derinleşti
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  content: {
    width: "100%",
    maxWidth: 300,
    borderRadius: 24, // Auro standartlarına göre yumuşatıldı
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontFamily: "Mont-700",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
    fontFamily: "Mont-500",
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
    alignItems: "stretch",
    width: "100%",
  },
  buttonContainer: {
    flex: 1,
    minHeight: 44,
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
  },
  btnText: {
    fontSize: 13,
    fontFamily: "Mont-600",
    textAlign: "center",
  },
});
