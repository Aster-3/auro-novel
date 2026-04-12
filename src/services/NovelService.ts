import api from "@/api/axiosInstance";
import {
  GetLastUpdatedNovel,
  UpdateNovelFormData,
  WeeklyTrendNovel,
} from "@/types/novel";

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

export const getLastUpdatedNovels = async (
  limit: number,
): Promise<GetLastUpdatedNovel[]> => {
  const { data } = await api.get("/novels/last-updated", {
    params: { limit },
  });
  return data;
};

export const getWeeklyTrendingNovels = async (
  limit?: number,
): Promise<WeeklyTrendNovel[]> => {
  const { data } = await api.get("/novels/weekly-trending", {
    params: { limit },
  });
  return data;
};

export const getNovelsByTag = async (tagId: string) => {
  const { data } = await api.get(`/novels/with-tag/${tagId}`);
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
  return data;
};

export const getLastCreatedNovels = async (
  limit: number,
): Promise<{ id: string; name: string; coverImage: string }[]> => {
  const { data } = await api.get("/novels/last-created", {
    params: { limit },
  });
  return data;
};
