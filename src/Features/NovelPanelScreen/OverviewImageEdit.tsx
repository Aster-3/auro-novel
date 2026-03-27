import { useModalStore } from "@/store/useModalStore";
import { Image } from "expo-image";
import { Text, View, StyleSheet, Pressable } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNovelMutation } from "@/hooks/useNovelMutation";
import { useToastStore } from "@/store/useToastStore";

export const OverviewImageEdit = ({
  novelId,
  coverImage,
}: {
  novelId: string;
  coverImage: string;
}) => {
  const { mutate: updateNovel } = useNovelMutation(novelId);

  const handleImagePress = async () => {
    console.log("Resim seçme işlemi tetiklendi");
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
            message:
              "Kapak fotoğrafı güncellenirken bir hata oluştu. Lütfen tekrar deneyin.",
          });
        },
      },
    );
  };
  return (
    <View style={styles.headContainer}>
      <Pressable style={styles.imageWrapper} onPress={handleImagePress}>
        <Image
          blurRadius={1}
          source={{ uri: coverImage }}
          style={styles.image}
        />
        <View style={styles.imageOverlay} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContent: { paddingTop: 30, paddingBottom: 40, gap: 32 },
  headContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  imageWrapper: {
    width: 150,
    aspectRatio: 2 / 3,
    marginBottom: 24,
    position: "relative",
  },
  image: { width: "100%", height: "100%", borderRadius: 20 },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 20,
  },

  body: { paddingHorizontal: 4, gap: 40, width: "100%" },
});
