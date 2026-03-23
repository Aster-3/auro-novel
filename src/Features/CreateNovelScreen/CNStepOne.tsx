import { SelectImageIcon } from "@/components/icons/SelectImageIcon";
import {
  Pressable,
  View,
  StyleSheet,
  TextInput,
  Animated,
  Easing,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useRef } from "react";
import { Image } from "expo-image";

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

export const CNStepOne = ({
  profileImage,
  setProfileImage,
}: {
  profileImage: string | null;
  setProfileImage: (image: string) => void;
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  const pressAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 4000,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: false,
      }),
    ).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(pressAnimation, {
      toValue: 1,
      speed: 30,
      bounciness: 0,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnimation, {
      toValue: 0,
      speed: 20,
      bounciness: 10,
      useNativeDriver: true,
    }).start();
  };

  const handleImageSelect = async () => {
    const pickedImage = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [2, 3],
      quality: 0.8,
    });

    if (!pickedImage.canceled && pickedImage.assets.length > 0) {
      setProfileImage(pickedImage.assets[0].uri);
    }
  };

  const animatedPressStyle = {
    transform: [
      {
        scale: pressAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.93],
        }),
      },
      {
        translateY: pressAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
    ],
  };

  const colors = [
    animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: ["#ffafbd", "#ffc3a0", "#ffafbd"],
    }),
    animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: ["#2193b0", "#6dd5ed", "#2193b0"],
    }),
    animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: ["#cc2b5e", "#9d50bb", "#cc2b5e"],
    }),
  ];

  return (
    <View style={styles.mainContainer}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.pressableContainer}
        onPress={handleImageSelect}
      >
        <Animated.View style={[styles.coverPlaceholder, animatedPressStyle]}>
          {profileImage ? (
            <Image
              source={profileImage}
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <>
              <AnimatedGradient
                colors={colors as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <SelectImageIcon color="rgba(255, 255, 255, 0.92)" size={42} />
            </>
          )}
        </Animated.View>
      </Pressable>

      <TextInput
        placeholder="Roman Başlığı"
        style={styles.input}
        placeholderTextColor="#94a3b8"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    padding: 24,
    alignItems: "center",
    gap: 48, // Input ve Kapak arası boşluk artırıldı
    width: "100%",
  },
  pressableContainer: {
    // Pressable, Animated.View'dan bağımsız olmalı
  },
  coverPlaceholder: {
    width: 170, // Boyut çok hafif artırıldı
    aspectRatio: 2 / 3,
    borderRadius: 36, // Apple Squircle formu
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden", // Gradient taşmasın
    backgroundColor: "#fff",
    // --- White Theme Gölge (Apple Soft Shadow) ---
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  input: {
    width: "100%",
    paddingHorizontal: 0,
    height: 56,
    borderBottomWidth: 1.5,
    borderColor: "#f1f5f9",
    fontSize: 16,
    fontFamily: "Mont-500",
    color: "#0f172a",
  },
});
