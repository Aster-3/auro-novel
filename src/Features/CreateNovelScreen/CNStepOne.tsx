import { SelectImageIcon } from "@/components/icons/SelectImageIcon";
import {
  Pressable,
  View,
  StyleSheet,
  TextInput,
  Animated,
  Easing,
  Platform,
  Text,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useRef } from "react";
import { Image } from "expo-image";
import {
  CreateNovelErrors,
  CreateNovelScreenProps,
} from "@/screens/CreateNovelScreen";
import { slugifyText } from "@/utils/slugify";

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

export const CNStepOne = ({
  formData,
  setFormData,
  errors,
  setErrors,
}: {
  formData: CreateNovelScreenProps;
  setFormData: (data: CreateNovelScreenProps) => void;
  errors: CreateNovelErrors;
  setErrors: (errors: CreateNovelErrors) => void;
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
      setFormData({
        ...formData,
        coverImage: {
          uri: pickedImage.assets[0].uri,
          name: pickedImage.assets[0].fileName || "upload.jpg",
          type: pickedImage.assets[0].mimeType || "image/jpeg",
        },
      });

      if (errors.coverImage) {
        setErrors({ ...errors, coverImage: undefined });
      }
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
        onPress={handleImageSelect}
      >
        <Animated.View
          style={[
            styles.coverPlaceholder,
            animatedPressStyle,
            errors.coverImage
              ? { borderWidth: 2, borderColor: "#ef4444" }
              : null,
          ]}
        >
          {formData.coverImage ? (
            <Image
              source={formData.coverImage.uri}
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

      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Roman Başlığı"
          style={[
            styles.input,
            errors.title ? { borderBottomColor: "#ef4444" } : null,
          ]}
          placeholderTextColor="#94a3b8"
          value={formData.title}
          onChangeText={(text) => {
            setFormData({ ...formData, title: text });
            if (errors.title) {
              setErrors({ ...errors, title: undefined });
            }
          }}
        />

        {errors.title && (
          <Animated.View style={styles.errorContainer}>
            <View style={styles.errorDot} />
            <Text style={styles.errorText}>{errors.title}</Text>
          </Animated.View>
        )}
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          placeholder={"Slug (URL için benzersiz isim)"}
          value={formData.slug}
          style={[
            styles.input,
            errors.slug && { borderBottomColor: "#ef4444" },
          ]}
          placeholderTextColor="#94a3b8"
          onChangeText={(text) => {
            const newSlug = slugifyText(text);

            setFormData({
              ...formData,
              slug: newSlug,
            });

            setErrors({ ...errors, slug: undefined });
          }}
        />
        <Animated.View style={styles.errorContainer}>
          <Text style={styles.infoText}>*</Text>
          <Text style={styles.infoText}>
            Önerilen Slug:{" "}
            {formData.title ? slugifyText(formData.title) : "---"}
          </Text>
        </Animated.View>
        {errors.slug && (
          <Animated.View style={styles.errorContainer}>
            <View style={styles.errorDot} />
            <Text style={styles.errorText}>{errors.slug}</Text>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    padding: 24,
    alignItems: "center",
    gap: 40,
    width: "100%",
  },
  coverPlaceholder: {
    width: 150,
    aspectRatio: 2 / 3,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "#fff",
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
  inputWrapper: {
    width: "90%",
  },
  input: {
    width: "100%",
    paddingHorizontal: 0,
    height: 50,
    borderBottomWidth: 1.5,
    borderColor: "#f1f5f9",
    fontSize: 14,
    fontFamily: "Mont-500",
    color: "#0f172a",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 8,
    gap: 6,
  },
  errorDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ef4444",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    fontFamily: "Mont-500",
    fontWeight: "500",
  },
  infoDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#0f0e31",
  },
  infoText: {
    color: "#0f0e31",
    fontSize: 12,
    fontFamily: "Mont-500",
    fontWeight: "500",
  },
});
