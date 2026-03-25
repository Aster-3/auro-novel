import { CreateNovelScreenProps } from "@/screens/CreateNovelScreen";

export const createNovelMapper = (data: CreateNovelScreenProps) => {
  const formData = new FormData();

  formData.append("name", data.title);
  formData.append("slug", data.slug);

  if (data.coverImage) {
    formData.append("coverImage", data.coverImage as any);
  }
  return formData;
};
