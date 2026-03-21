import { LoginSchemaType, RegisterSchemaType } from "@/schemas/auth";
import api from "../api/axiosInstance";

export const register = async (data: RegisterSchemaType) => {
  try {
    const response = await api.post("/auth/register", data);

    response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyUser = async (email: string, code: string) => {
  try {
    const { data } = await api.post("/auth/verify", { email, code });
    return data;
  } catch (error) {
    throw error;
  }
};

export const login = async (dto: LoginSchemaType) => {
  try {
    const { data } = await api.post("/auth/login", dto);
    return data;
  } catch (error) {
    throw error;
  }
};

export const verifyToken = async (email: string, code: string) => {
  try {
    const { data } = await api.post("/auth/verify", { email, code });
    return data;
  } catch (error) {
    throw error;
  }
};

export const resendVerificationCode = async (email: string) => {
  try {
    const { data } = await api.post("/auth/resend-code", { email });
    return data;
  } catch (error) {
    throw error;
  }
};
