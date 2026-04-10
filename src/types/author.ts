export enum AuthorTransactionType {
  WITHDRAWAL = "withdrawal",
  EARNING = "earning",
  BONUS = "bonus",
}

export interface AuthorWalletInfo {
  totalEarnings: number;
  pendingWithdrawalBalance: number;
  withdrawableBalance: number;
  canWithdrawAfter: string;
}

export interface AuthorTransaction {
  id: string;
  transactionType: AuthorTransactionType;
  amount: number;
  balanceAfterTransaction: number;
  description: string;
  createdAt: string;
}

export const typeMapper: Record<AuthorTransactionType, string> = {
  [AuthorTransactionType.WITHDRAWAL]: "Çekim",
  [AuthorTransactionType.EARNING]: "Bölüm Satışı",
  [AuthorTransactionType.BONUS]: "Bonus",
};
