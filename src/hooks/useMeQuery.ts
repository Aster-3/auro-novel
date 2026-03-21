import { getMe } from "@/services/UserService";
import { UserMe } from "@/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";

export const useMeQuery = (
  fields: (keyof UserMe)[],
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ["me", fields.join(",")],
    queryFn: () => getMe(fields),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
    enabled: options?.enabled,
  });
};
