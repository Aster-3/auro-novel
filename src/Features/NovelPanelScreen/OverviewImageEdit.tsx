import { useModalStore } from "@/store/useModalStore";
import { Image } from "expo-image";
import { Text, View, StyleSheet, Pressable } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNovelMutation } from "@/hooks/useNovelMutation";
import { useToastStore } from "@/store/useToastStore";
import { useAppTheme } from "@/hooks/useTheme";
import { Feather } from "@expo/vector-icons";

export const OverviewImageEdit = ({
  novelId,
  coverImage,
}: {
  novelId: string;
  coverImage: string;
}) => {
  const { theme, isDarkMode } = useAppTheme();
  const { mutate: updateNovel } = useNovelMutation(novelId);

  const handleImagePress = async () => {
    const selectedImage = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [2, 3],
      quality: 0.8,
    });

    if (
      !selectedImage.canceled &&
      selectedImage?.assets[0]?.fileSize &&
      selectedImage?.assets[0]?.fileSize > 5 * 1024 * 1024
    ) {
      useToastStore.getState().showToast({
        type: "Uyarı",
        message:
          "Seçilen resmin boyutu 5MB'dan fazla. Lütfen daha küçük bir resim seçin.",
      });
      return;
    }

    if (!selectedImage.canceled) {
      useModalStore.getState().showConfirm({
        title: "Kapak Fotoğrafını Değiştir",
        message:
          "Seçilen resmi kapak fotoğrafı olarak ayarlamak istediğinize emin misiniz?",
        onConfirm: () => {
          handleImageFormat(selectedImage.assets[0]);
        },
      });
    }
  };

  const handleImageFormat = (pickedImage: ImagePicker.ImagePickerAsset) => {
    updateNovel(
      {
        coverImage: {
          uri: pickedImage.uri,
          name: pickedImage.fileName || "cover.jpg",
          type: pickedImage.mimeType || "image/jpeg",
        },
      },
      {
        onSuccess: () => {
          useToastStore.getState().showToast({
            type: "Başarılı",
            message: "Kapak fotoğrafı başarıyla güncellendi!",
          });
        },
        onError: () => {
          useToastStore.getState().showToast({
            type: "Hata",
            message: "Kapak fotoğrafı güncellenirken bir hata oluştu.",
          });
        },
      },
    );
  };

  return (
    <View style={styles.headContainer}>
      <Pressable
        style={({ pressed }) => [
          styles.imageWrapper,
          {
            backgroundColor: isDarkMode ? theme.surface : "#2c2c2c",
            shadowColor: "#000",
            shadowOpacity: isDarkMode ? 0.4 : 0.15,
            opacity: pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.96 : 1 }],
          },
        ]}
        onPress={handleImagePress}
      >
        <Image
          blurRadius={0.5}
          source={{ uri: coverImage }}
          style={styles.image}
          contentFit="cover"
        />

        <View style={styles.imageOverlay}>
          <View
            style={[styles.iconCircle, { backgroundColor: "rgba(0,0,0,0.5)" }]}
          >
            <Feather name="camera" size={18} color="#fff" />
          </View>
          <Text style={styles.overlayText}>Görseli Güncelle</Text>
        </View>
      </Pressable>

      <View style={styles.body}>
        <View style={styles.infoBox}>
          <Text style={[styles.text, { color: theme.textSecondary }]}>
            • En iyi görünüm için 2:3 oranında ve maksimum 5 MB boyutunda
            görseller kullanın.
          </Text>
          <Text style={[styles.text, { color: theme.textSecondary }]}>
            • Müstehcenlik kurallarına uymayan kapaklar moderasyon tarafından
            kaldırılabilir.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headContainer: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 4,
    alignItems: "flex-start", // En üste hizalamak için flex-start yaptık
  },
  imageWrapper: {
    width: 130,
    aspectRatio: 2 / 3,
    position: "relative",
    borderRadius: 22,
    overflow: "hidden",
    elevation: 8,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  iconCircle: {
    padding: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  overlayText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontFamily: "Mont-700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  body: {
    flex: 1,
    marginLeft: 20,
    paddingTop: 4, // Yazıların resmin en üst çizgisiyle hizalanması için
  },
  infoBox: {
    gap: 12,
  },
  text: {
    fontFamily: "Mont-500", // Daha tok durması için 500 yaptık
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: -0.1,
  },
});
