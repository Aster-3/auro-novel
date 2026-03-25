import { UpdateProfileSchemaType } from "@/schemas/auth";

export const loginMapper = (
  data: UpdateProfileSchemaType,
  dataToCheck?: {
    id: string;
    nickname: string;
    description?: string;
    profileImageUrl?: string;
    profileBackgroundImageUrl?: string;
  },
) => {
  const formData = new FormData();

  if (data.nickname && data.nickname !== dataToCheck?.nickname) {
    formData.append("nickname", data.nickname);
  }

  if (data.description && data.description !== dataToCheck?.description) {
    formData.append("description", data.description);
  }

  if (data.profileImageUrl && typeof data.profileImageUrl === "object") {
    formData.append("profileImageUrl", data.profileImageUrl);
  }

  if (
    data.profileBackgroundImageUrl &&
    typeof data.profileBackgroundImageUrl === "object"
  ) {
    formData.append(
      "profileBackgroundImageUrl",
      data.profileBackgroundImageUrl,
    );
  }

  return formData;
};
