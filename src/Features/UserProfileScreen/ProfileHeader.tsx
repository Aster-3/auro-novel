import { BackButton } from "@/components/BackButton";
import { FlagIcon2 } from "@/components/icons/FlagIcon2";
import { useAppNavigation } from "@/hooks/useAppNavigation";
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
    userId,
    nickname,
    canReport = true,
  }: {
    coverImage?: string | null;
    profileImage?: string | null;
    userId: string;
    nickname: string;
    canReport?: boolean;
  }) => {
    const { theme, isDarkMode } = useAppTheme();
    const navigation = useAppNavigation();
    const coverBackgroundColor = isDarkMode
      ? "rgba(255,255,255,0.06)"
      : "#E5E7EB";
    const avatarBackgroundColor = isDarkMode ? "#1f2334" : "#F1F5F9";
    const [isProfileImageOpen, setIsProfileImageOpen] = useState(false);
    const profileImageSource = useMemo(
      () => getProfileImageSource(profileImage),
      [profileImage],
    );
    const handleReportPress = () => {
      navigation.push("SupportFeedback", {
        initialType: "report",
        initialSubject: `Kullanıcı Şikayeti | ${nickname}: (User ID: ${userId})`,
        isSubjectDisable: true,
        isTypeDisable: true,
      });
    };

    return (
      <View style={styles.container} pointerEvents="box-none">
        <View style={styles.coverContainer} pointerEvents="box-none">
          <View
            style={[
              styles.coverBackground,
              { backgroundColor: coverBackgroundColor },
            ]}
            pointerEvents="none"
          />
          <View style={styles.backButton}>
            <BackButton />
          </View>
          {canReport && (
            <Pressable
              style={styles.reportButton}
              onPress={handleReportPress}
              hitSlop={8}
            >
              <FlagIcon2 color="#FFFFFF" size={22} />
            </Pressable>
          )}
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
          style={[
            styles.profileImageWrapper,
            { backgroundColor: avatarBackgroundColor },
          ]}
          onPress={() => setIsProfileImageOpen(true)}
        >
          <Image
            source={profileImageSource}
            style={[
              styles.profileImage,
              {
                backgroundColor: avatarBackgroundColor,
                borderColor: theme.background,
              },
            ]}
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
            backgroundColor="transparent"
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
  coverBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
  },
  reportButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
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
    width: PROFILE_HEADER.avatarSize,
    height: PROFILE_HEADER.avatarSize,
    borderRadius: PROFILE_HEADER.avatarRadius,
    overflow: "hidden",
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
