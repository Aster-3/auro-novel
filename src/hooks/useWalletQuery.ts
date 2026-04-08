import { getBalances } from "@/services/ReaderWalletService";
import { useQuery } from "@tanstack/react-query";

export const useWalletQuery = () => {
  return useQuery({
    queryKey: ["wallet"],
    queryFn: () => getBalances(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  });
};
