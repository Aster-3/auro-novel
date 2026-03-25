import { GetCategoriesRequest, GetCategoriesResponse } from "@/types/category";
import api from "../api/axiosInstance";

export const getCategories = async (
  query: GetCategoriesRequest,
): Promise<GetCategoriesResponse> => {
  const { data } = await api.get("/categories", { params: query });
  return data;
};
