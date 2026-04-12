import { LastActivityIcon } from "@/components/icons/LastActivityIcon";
import { ReadTimeIcon } from "@/components/icons/ReadTimeIcon";
import { RightArrowIcon } from "@/components/icons/RightArrowIcon";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  withSpring,
  Easing,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export interface LibrarySheetData {
  id: string;
  title: string;
  author?: string;
  coverImageUrl: string;
}

export const CustomLibrarySheet = ({ isVisible, onClose, data }: any) => {
  const insets = useSafeAreaInsets();
  const [shouldRender, setShouldRender] = useState(isVisible);
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const opacity = useSharedValue(0);

  const softFastConfig = { damping: 18, stiffness: 120, mass: 0.6 };

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      opacity.value = withTiming(1, { duration: 250 });
      translateY.value = withSpring(0, softFastConfig);
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(SCREEN_HEIGHT, { duration: 250 }, (f) => {
        if (f) runOnJS(setShouldRender)(false);
      });
    }
  }, [isVisible]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!shouldRender || !data) return null;

  return (
    <Modal
      visible
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={{ flex: 1 }} onPress={onClose} />
        </Animated.View>

        <Animated.View
          style={[
            styles.sheetContainer,
            sheetStyle,
            { paddingBottom: insets.bottom + 12 },
          ]}
        >
          <View style={styles.dragIndicator} />

          <View style={styles.heroWrapper}>
            <Image
              source={{ uri: data.coverImageUrl }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              blurRadius={70}
            />
            <View style={styles.heroDarkener} />

            <View style={styles.heroContent}>
              <View style={styles.coverShadow}>
                <Image
                  source={{ uri: data.coverImageUrl }}
                  style={styles.mainCover}
                  contentFit="cover"
                />
              </View>

              <View style={styles.textWrapper}>
                <Text style={styles.titleText} numberOfLines={2}>
                  {data.title}
                </Text>
                <Text style={styles.authorText}>
                  {data.author || "Yazar Belirtilmemiş"}
                </Text>

                {/* Belirginleştirilmiş Buzlu Chip Stat Kısmı */}
                <View style={styles.statChip}>
                  <View style={styles.statItem}>
                    <ReadTimeIcon size={12} color="rgba(255,255,255,0.6)" />
                    <Text style={styles.sValue}>45.7 Saat</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <LastActivityIcon size={12} color="rgba(255,255,255,0.6)" />
                    <Text style={styles.sValue}>2 Gün Önce</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.body}>
            <ActionButton
              icon={<View style={styles.dotIndicator} />}
              label="Okumaya Devam Et"
              onPress={() => {}}
              primary
            />
            <ActionButton
              icon={<View style={[styles.dotIndicator, { opacity: 0.3 }]} />}
              label="Bu Kitap Hakkında"
              onPress={() => {}}
            />
            <ActionButton
              icon={
                <View
                  style={[
                    styles.dotIndicator,
                    { backgroundColor: "#E11D48", opacity: 0.5 },
                  ]}
                />
              }
              label="Kütüphanemde Gizle"
              onPress={() => {}}
              isDestructive
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const ActionButton = ({
  icon,
  label,
  onPress,
  primary,
  isDestructive,
}: any) => (
  <Pressable
    style={({ pressed }) => [
      styles.actionRow,
      primary && styles.primaryAction,
      {
        backgroundColor: pressed
          ? primary
            ? "#FFF"
            : "rgba(255,255,255,0.05)"
          : primary
            ? "#FFF"
            : "transparent",
        transform: [{ scale: pressed ? 0.99 : 1 }],
      },
    ]}
    onPress={onPress}
  >
    <View style={styles.actionLeft}>
      {icon}
      <Text
        style={[
          styles.actionText,
          primary && { color: "#000", fontFamily: "Mont-800" },
          isDestructive && { color: "#E11D48", opacity: 0.9 },
        ]}
      >
        {label}
      </Text>
    </View>
    {!primary && <RightArrowIcon size={10} color="rgba(255,255,255,0.1)" />}
  </Pressable>
);

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  sheetContainer: {
    backgroundColor: "#0A0A0B",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    width: "100%",
    overflow: "hidden",
  },
  dragIndicator: {
    width: 32,
    height: 3,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    position: "absolute",
    zIndex: 10,
  },
  heroWrapper: {
    height: 185,
    width: "100%",
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  heroDarkener: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 10, 11, 0.78)",
  },
  heroContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    zIndex: 5,
    paddingTop: 10,
  },
  coverShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  mainCover: { width: 92, aspectRatio: 2 / 3, borderRadius: 10 },
  textWrapper: { flex: 1, marginLeft: 20, paddingTop: 2 },
  titleText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Mont-700",
    lineHeight: 24,
    letterSpacing: -0.5,
  },
  authorText: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 12,
    marginTop: 6,
    fontFamily: "Mont-500",
  },

  statChip: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  statDivider: {
    width: 1,
    height: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginHorizontal: 10,
    alignItems: "center",
  },
  statItem: { flexDirection: "row", gap: 6, alignItems: "center" },
  sValue: {
    color: "#ffffffd4",
    fontSize: 9,
    fontFamily: "Mont-600",
    letterSpacing: 0.5,
  },

  body: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 8 },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 2,
  },
  primaryAction: { marginBottom: 10, marginTop: 4 },
  actionLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  dotIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#FFF",
  },
  actionText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontFamily: "Mont-600",
    letterSpacing: -0.3,
  },
});
