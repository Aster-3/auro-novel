import api from "@/api/axiosInstance";
import {
  AuthorTransaction,
  AuthorTransactionType,
  AuthorWalletInfo,
} from "@/types/author";

export const getAuthorWalletInfo = async (): Promise<AuthorWalletInfo> => {
  const { data } = await api.get("/authors/my-wallet");
  return data;
};

export const getAuthorTransactions = async (query: {
  page?: number;
  limit?: number;
  filterBy?: AuthorTransactionType;
  since?: Date;
}): Promise<{
  items: AuthorTransaction[];
  total: number;
  currentPage: number;
  lastPage: number;
  nextPage: number | null;
}> => {
  const url = `/authors/my-wallet/transactions?page=${query.page || 1}&limit=${query.limit || 20}${
    query.filterBy ? `&filterBy=${query.filterBy}` : ""
  }${query.since ? `&since=${new Date(query.since).toISOString()}` : ""}`;

  const { data } = await api.get(url);
  return data;
};
