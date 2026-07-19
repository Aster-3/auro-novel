import { BackButton } from "@/components/BackButton";
import { useAppTheme } from "@/hooks/useTheme";
import { getProfileImageSource } from "@/utils/profileImage";
import React, { useMemo, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import defaultProfileBackground from "@assets/defaultProfileBackground.jpg";
import { PROFILE_HEADER } from "@/constants/profileLayout";

export const ProfileHeader = React.memo(
  ({
    coverImage,
    profileImage,
  }: {
    coverImage?: string | null;
    profileImage?: string | null;
  }) => {
    const { theme } = useAppTheme();
    const [isProfileImageOpen, setIsProfileImageOpen] = useState(false);
    const profileImageSource = useMemo(
      () => getProfileImageSource(profileImage),
      [profileImage],
    );

    return (
      <View style={styles.container} pointerEvents="box-none">
        <View style={styles.coverContainer} pointerEvents="box-none">
          <View style={styles.backButton}>
            <BackButton />
          </View>
          {coverImage ? (
            <Image
              source={{ uri: coverImage }}
              style={styles.coverImage}
              resizeMode="cover"
            />
          ) : (
            <Image
              source={defaultProfileBackground}
              style={styles.coverImage}
              resizeMode="cover"
            />
          )}
          <View style={styles.overlay} pointerEvents="none" />
        </View>

        <Pressable
          style={styles.profileImageWrapper}
          onPress={() => setIsProfileImageOpen(true)}
        >
          <Image
            source={profileImageSource}
            style={[styles.profileImage, { borderColor: theme.background }]}
          />
        </Pressable>

        <Modal
          visible={isProfileImageOpen}
          transparent
          animationType="fade"
          statusBarTranslucent
          navigationBarTranslucent
          onRequestClose={() => setIsProfileImageOpen(false)}
        >
          <StatusBar
            translucent
            backgroundColor="rgba(0,0,0,0.9)"
            barStyle="light-content"
          />
          <Pressable
            style={styles.modalBackground}
            onPress={() => setIsProfileImageOpen(false)}
          >
            <Pressable
              style={styles.fullProfileImageContainer}
              onPress={(event) => event.stopPropagation()}
            >
              <Image
                source={profileImageSource}
                style={styles.fullProfileImage}
                resizeMode="cover"
              />
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    marginBottom: PROFILE_HEADER.containerBottomGap,
  },
  coverContainer: {
    width: "100%",
    aspectRatio: PROFILE_HEADER.coverAspectRatio,
    borderRadius: PROFILE_HEADER.coverRadius,
    overflow: "hidden",
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.16)",
  },
  profileImageWrapper: {
    position: "absolute",
    bottom: -PROFILE_HEADER.avatarOverlap,
  },
  profileImage: {
    width: PROFILE_HEADER.avatarSize,
    height: PROFILE_HEADER.avatarSize,
    borderRadius: PROFILE_HEADER.avatarRadius,
    borderWidth: PROFILE_HEADER.avatarBorderWidth,
  },
  modalBackground: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  fullProfileImageContainer: {
    width: "85%",
    maxWidth: 360,
    aspectRatio: 1,
    borderRadius: 32,
    overflow: "hidden",
  },
  fullProfileImage: {
    width: "100%",
    height: "100%",
  },
});
