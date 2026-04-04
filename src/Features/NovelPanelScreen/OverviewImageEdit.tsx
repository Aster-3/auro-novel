import { useModalStore } from "@/store/useModalStore";
import { Image } from "expo-image";
import { Text, View, StyleSheet, Pressable } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNovelMutation } from "@/hooks/useNovelMutation";
import { useToastStore } from "@/store/useToastStore";
import { SelectImageIcon } from "@/components/icons/SelectImageIcon";

export const OverviewImageEdit = ({
  novelId,
  coverImage,
}: {
  novelId: string;
  coverImage: string;
}) => {
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
            opacity: pressed ? 0.7 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          }, // Dokunma animasyonu
        ]}
        onPress={handleImagePress}
      >
        <Image
          blurRadius={2} // Arka planı biraz daha bulanıklaştırdık ki ikon parlasın
          source={{ uri: coverImage }}
          style={styles.image}
        />
        {/* Overlay ve İkon Konumlandırması */}
        <View style={styles.imageOverlay}>
          <SelectImageIcon size={32} color="#fff" />
          <Text style={styles.overlayText}>Değiştir</Text>
        </View>
      </Pressable>

      <View style={styles.body}>
        <Text style={styles.text}>
          * En iyi görünüm için 2:3 oranında ve maksimum 5 MB boyutunda
          görseller kullanın.
        </Text>
        <Text style={styles.text}>
          * Yetişkin (Mature) içeriklere izin verilse de, aşırı müstehcenlik ve
          pornografik içerik barındıran kapaklar kaldırılır.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headContainer: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 8,
  },
  imageWrapper: {
    width: 120,
    aspectRatio: 2 / 3,
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#2c2c2c",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  overlayText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontFamily: "Mont-600",
    textTransform: "uppercase",
  },
  body: {
    flex: 1,
    marginLeft: 16,
    gap: 8,
  },
  text: {
    fontFamily: "Mont-500",
    fontSize: 12,
    color: "#828282",
    letterSpacing: -0.5,
  },
});
