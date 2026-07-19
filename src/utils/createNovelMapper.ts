import { CreateNovelScreenProps } from "@/screens/CreateNovelScreen";

export const createNovelMapper = (data: CreateNovelScreenProps) => {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("slug", data.slug);

  if (data.coverImage) {
    formData.append(
      "coverImage",
      {
        uri: data.coverImage.uri,
        name: data.coverImage.name ?? "cover.jpg",
        type: data.coverImage.type ?? "image/jpeg",
      } as any,
    );
  }
  return formData;
};
