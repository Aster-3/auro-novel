import { getAuthorWalletInfo } from "@/services/AuthorService";
import { useQuery } from "@tanstack/react-query";

export const useAuthorWalletInfo = () => {
  return useQuery({
    queryKey: ["author-wallet-info"],
    queryFn: async () => getAuthorWalletInfo(),
  });
};
