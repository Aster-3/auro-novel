import React, { useEffect, useState } from "react";
import { useAppTheme } from "@/hooks/useTheme";
import {
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Dimensions,
} from "react-native";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import { BackButton } from "@/components/BackButton";

export const ProfileHeader = ({
  coverImage,
  profileImage,
}: {
  coverImage?: string;
  profileImage?: string;
}) => {
  const { theme } = useAppTheme();
  Dimensions.get("window");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState(1);

  useEffect(() => {
    if (selectedImage) {
      Image.getSize(
        selectedImage,
        (width, height) => {
          setAspectRatio(width / height);
        },
        (error) => {
          console.error("Resim boyutu alınamadı:", error);
        },
      );
    }
  }, [selectedImage]);

  return (
    <View style={styles.container}>
      {/* --- COVER IMAGE --- */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setSelectedImage(coverImage || null)}
        style={styles.coverContainer}
      >
        <View style={{ position: "absolute", top: 16, left: 16, zIndex: 10 }}>
          <BackButton />
        </View>
        <Image
          source={{ uri: coverImage }}
          style={styles.coverImage}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
      </TouchableOpacity>

      <View style={styles.profileImageWrapper}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setSelectedImage(profileImage || null)}
        >
          <Image
            source={{ uri: profileImage }}
            style={[styles.profileImage, { borderColor: theme.background }]}
          />
        </TouchableOpacity>
      </View>

      <Modal
        visible={!!selectedImage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
        statusBarTranslucent={true}
      >
        <Pressable
          style={styles.modalBackground}
          onPress={() => setSelectedImage(null)}
        >
          <View style={[styles.dynamicWrapper, { aspectRatio: aspectRatio }]}>
            <Image
              source={{ uri: selectedImage || "" }}
              style={styles.fullImage}
              resizeMode="cover"
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    marginBottom: 60,
  },
  coverContainer: {
    width: "100%",
    height: 180,
    borderRadius: 20,
    overflow: "hidden",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
  profileImageWrapper: {
    position: "absolute",
    bottom: -50,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 40,
    borderWidth: 2,
    elevation: 4,
  },

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  dynamicWrapper: {
    width: SCREEN_WIDTH * 0.95,
    maxWidth: SCREEN_WIDTH,
    maxHeight: SCREEN_HEIGHT * 0.8,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#222",
  },
  fullImage: {
    width: "100%",
    height: "100%",
  },
});
