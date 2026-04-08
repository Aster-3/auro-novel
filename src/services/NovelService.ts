import api from "@/api/axiosInstance";
import { UpdateNovelFormData } from "@/types/novel";

export const getNovels = async () => {
  const { data } = await api.get("/novels");
  return data;
};

export const getNovelDetail = async (id: string) => {
  const { data } = await api.get(`/novels/${id}`);
  return data;
};

export const createNovel = async (dto: FormData) => {
  const { data } = await api.post("/novels", dto, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const updateNovel = async (id: string, dto: UpdateNovelFormData) => {
  const formData = new FormData();
  Object.entries(dto).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          formData.append(key, item);
        });
      } else {
        formData.append(key, value);
      }
    }
  });

  console.log("Updating novel with data:", formData.get("categories"));

  const { data } = await api.patch(`/novels/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const addCategoryToNovel = async (
  novelId: string,
  categoryIds: number[],
) => {
  const { data } = await api.post(`/novels/${novelId}/categories`, {
    categories: categoryIds,
  });
  return data;
};

export const incrementNovelViewCount = async (novelId: string) => {
  await api.post(`/novels/${novelId}/views`);
};
