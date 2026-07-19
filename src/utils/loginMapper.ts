import { UpdateProfileSchemaType } from "@/schemas/auth";

export const loginMapper = (
  data: UpdateProfileSchemaType,
  dataToCheck?: {
    id: string;
    nickname: string;
    description?: string;
    profileImageUrl?: string;
    profileBackgroundImageUrl?: string;
    gender?: "male" | "female" | "null" | null;
  },
) => {
  const formData = new FormData();
  const currentDescription = dataToCheck?.description ?? "";
  const currentGender = dataToCheck?.gender ?? "null";

  if (data.nickname && data.nickname !== dataToCheck?.nickname) {
    formData.append("nickname", data.nickname);
  }

  if (
    data.description !== undefined &&
    data.description !== currentDescription
  ) {
    formData.append("description", data.description);
  }

  if (data.gender && data.gender !== currentGender) {
    formData.append("gender", data.gender);
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
