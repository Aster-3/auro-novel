import { Header } from "@/components/Header";
import { Screen } from "@/components/layout/Screen";
import { AuthorTransactionItem } from "@/Features/AuthorWalletScreen/AuthorTransactionItem";
import { DateRange } from "@/Features/AuthorWalletScreen/TransactionBottomSheet";
import { TransactionFilterHeader } from "@/Features/AuthorWalletScreen/TransactionFilterHeader";
import { useAuthorTransactionsQuery } from "@/hooks/useAuthorTransactionsQuery";
import { AuthorTransactionType } from "@/types/author";
import { useState } from "react";
import { ScrollView, View } from "react-native";

const AuthorTransactionScreen = () => {
  const [filter, setFilter] = useState<AuthorTransactionType | null>(null);
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  const [since, setSince] = useState<DateRange>(() => {
    const initialDate = new Date();
    initialDate.setHours(0, 0, 0, 0);
    initialDate.setDate(initialDate.getDate() - 1);
    return {
      label: "Son 1 Gün",
      date: initialDate,
    };
  });
  const { data: transactionsData } = useAuthorTransactionsQuery({
    page: 1,
    limit: 20,
    ...(filter && { filterBy: filter }), // filter null değilse ekle
    ...(since.date && { since: since.date }), // since ve date varsa ekle
  });

  return (
    <Screen style={{ flex: 1, gap: 8 }}>
      <Header title="İşlemler" isAdjacent={false} />
      <TransactionFilterHeader
        since={since}
        setFilter={setFilter}
        setSince={setSince}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 4,
          paddingBottom: 78,
          paddingTop: 8,
        }}
      >
        <View>
          {transactionsData?.items.map((transaction) => (
            <AuthorTransactionItem
              key={transaction.id}
              transaction={transaction}
            />
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
};

export default AuthorTransactionScreen;
