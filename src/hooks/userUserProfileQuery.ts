import { getUserProfile } from "@/services/UserService";
import { useQuery } from "@tanstack/react-query";

export const useUserProfileQuery = (userId: string) => {
  return useQuery({
    queryKey: ["user-profile", userId],
    queryFn: async () => getUserProfile(userId),
    enabled: !!userId,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
};
