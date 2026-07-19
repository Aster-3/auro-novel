import { ImageSourcePropType } from "react-native";
import defaultProfile from "@assets/defaultProfile.jpg";

export const getProfileImageSource = (
  profileImageUrl?: string | null,
): ImageSourcePropType => {
  const trimmedUrl = profileImageUrl?.trim();
  return trimmedUrl ? { uri: trimmedUrl } : defaultProfile;
};
