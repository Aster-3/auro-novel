import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { AuthorTransactionItem } from "./AuthorTransactionItem";
import { AuthorTransactionType } from "@/types/author";
import { useAuthorTransactionsQuery } from "@/hooks/useAuthorTransactionsQuery";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useAppTheme } from "@/hooks/useTheme"; // Temayı ekledik

export const AuthorTransactions = () => {
  const { theme } = useAppTheme(); // Renkleri aldık
  const { data: transactionsData } = useAuthorTransactionsQuery({
    page: 1,
    limit: 5,
  });
  const navigation = useAppNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text
          style={[
            styles.headerTitle,
            { fontSize: 16, color: theme.textPrimary },
          ]}
        >
          Geçmiş İşlemler
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("AuthorTransaction")}
        >
          <Text
            style={[
              styles.headerTitle,
              { fontSize: 12, color: theme.textSecondary },
            ]}
          >
            Hepsini Gör
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        {transactionsData?.items.map((transaction) => (
          <AuthorTransactionItem
            key={transaction.id}
            transaction={transaction}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    paddingHorizontal: 4,
    gap: 8,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "Mont-600",
  },
});
