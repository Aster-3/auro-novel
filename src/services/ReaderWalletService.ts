import api from "@/api/axiosInstance";

export const getBalances = async (): Promise<{
  moonCoins: number;
  sunCoins: number;
}> => {
  const { data } = await api.get("users/me/wallet");
  return data;
};
