import api from "@/api/axiosInstance";
import { UpdateProfileSchemaType } from "@/schemas/auth";
import { UserMe } from "@/store/useAuthStore";

export const getMe = (fields: (keyof UserMe)[]) => {
  return api
    .get<UserMe>("/users/me", {
      params: {
        fields: fields.join(","),
      },
    })
    .then((res) => res.data);
};

export const updateMe = (data: UpdateProfileSchemaType | FormData) => {
  const isFormData = data instanceof FormData;
  return api
    .patch<UserMe>("/users/me", data, {
      headers: isFormData
        ? { "Content-Type": "multipart/form-data" }
        : undefined,
    })
    .then((res) => res.data);
};
