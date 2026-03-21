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

export const GlobalConfirmModal = () => {
  const { isVisible, config, hideModal } = useModalStore();

  const cancelAnim = useRef(new Animated.Value(1)).current;
  const confirmAnim = useRef(new Animated.Value(1)).current;

  // ÇÖZÜM: Modal her açıldığında animasyonları varsayılan (1) değerine döndür
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
    cancelAnim.setValue(1); // Yarıda kesilen animasyonu manuel sıfırla
    hideModal();
  };

  const onConfirmPress = () => {
    confirmAnim.setValue(1); // Yarıda kesilen animasyonu manuel sıfırla
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
            <View style={styles.content}>
              <View style={styles.header}>
                <Text style={styles.title}>{config.title}</Text>
                <Text style={styles.message}>{config.message}</Text>
              </View>

              <View style={styles.buttons}>
                {/* CANCEL */}
                <Animated.View
                  style={{
                    flex: 1,
                    transform: [{ scale: cancelAnim }],
                    opacity: cancelAnim.interpolate({
                      inputRange: [0.94, 1],
                      outputRange: [0.7, 1],
                    }),
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPressIn={() => handlePressIn(cancelAnim)}
                    onPressOut={() => handlePressOut(cancelAnim)}
                    onPress={onCancelPress}
                    style={[styles.btn, styles.cancelBtn]}
                  >
                    <Text style={[styles.btnText, styles.cancelBtnText]}>
                      {config.cancelText || "Vazgeç"}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>

                {/* CONFIRM */}
                <Animated.View
                  style={{
                    flex: 1,
                    transform: [{ scale: confirmAnim }],
                    opacity: confirmAnim.interpolate({
                      inputRange: [0.94, 1],
                      outputRange: [0.7, 1],
                    }),
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPressIn={() => handlePressIn(confirmAnim)}
                    onPressOut={() => handlePressOut(confirmAnim)}
                    onPress={onConfirmPress}
                    style={[styles.btn, styles.confirmBtn]}
                  >
                    <Text style={[styles.btnText, styles.confirmBtnText]}>
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
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  content: {
    width: "100%",
    maxWidth: 300,
    backgroundColor: "white",
    padding: 18,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
    fontFamily: "Mont-600",
  },
  message: {
    fontSize: 13.5,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 19,
    fontFamily: "Mont-500",
  },
  buttons: {
    flexDirection: "row",
    gap: 10,
  },
  btn: {
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    fontWeight: "600",
    fontSize: 13.5,
    fontFamily: "Mont-600",
  },
  cancelBtn: {
    backgroundColor: "#e9e9e9",
  },
  cancelBtnText: {
    color: "#1F2937",
  },
  confirmBtn: {
    backgroundColor: "#000",
  },
  confirmBtnText: {
    color: "white",
  },
});
