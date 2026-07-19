import api from "@/api/axiosInstance";

export interface RegisterDeviceDto {
  pushToken: string;
  provider: "expo";
  platform: "ios" | "android";
  deviceId: string | null;
}

export const registerDevice = async (dto: RegisterDeviceDto) => {
  const { data } = await api.post("/users/me/devices", dto);
  return data;
};

export const deleteDevice = async (pushToken: string) => {
  const { data } = await api.delete("/users/me/devices", {
    data: { pushToken },
  });
  return data;
};
