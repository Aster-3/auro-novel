import { Text, View, StyleSheet } from "react-native";
import { EarningIcon } from "@/components/icons/EarningIcon";
import {
  AuthorTransaction,
  AuthorTransactionType,
  typeMapper,
} from "@/types/author";
import { formatRawDate } from "@/utils/formatRawDate";
import { formatCurrency } from "@/utils/formatCurrency";
import { BonusIcon } from "@/components/icons/BonusIcon";
import { useAppTheme } from "@/hooks/useTheme"; // Temayı ekledik

export const AuthorTransactionItem = ({
  transaction,
}: {
  transaction: AuthorTransaction;
}) => {
  const { theme, isDarkMode } = useAppTheme();
  const {
    transactionType,
    description,
    createdAt,
    amount,
    balanceAfterTransaction,
  } = transaction;

  const isProfit = [
    AuthorTransactionType.EARNING,
    AuthorTransactionType.BONUS,
  ].includes(transactionType);

  const availableIcon = {
    [AuthorTransactionType.EARNING]: (
      <EarningIcon size={20} color={theme.textPrimary} />
    ),
    [AuthorTransactionType.BONUS]: (
      <BonusIcon size={18} color={theme.textPrimary} />
    ),
    [AuthorTransactionType.WITHDRAWAL]: (
      <EarningIcon size={20} color={theme.textPrimary} />
    ),
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderBottomColor: isDarkMode ? "rgba(255,255,255,0.05)" : "#F2F2F2",
        },
      ]}
    >
      <View style={styles.leftSection}>
        <View
          style={[
            styles.iconBox,
            { backgroundColor: isDarkMode ? theme.surface : "#F9FAFB" },
          ]}
        >
          {availableIcon[transactionType]}
        </View>

        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            {typeMapper[transactionType]}
          </Text>
          <Text
            style={[styles.description, { color: theme.textSecondary }]}
            numberOfLines={1}
          >
            {description}
          </Text>
          <Text
            style={[styles.date, { color: theme.textSecondary, opacity: 0.8 }]}
          >
            {formatRawDate(createdAt, true)}
          </Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text
          style={[
            styles.amount,
            { color: theme.textPrimary },
            isProfit && styles.profitText,
          ]}
        >
          {isProfit ? "+" : "-"}
          {formatCurrency(amount, 1)}
        </Text>
        <Text style={[styles.balance, { color: theme.textSecondary }]}>
          {formatCurrency(balanceAfterTransaction, 1)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    marginHorizontal: 4,
    borderBottomWidth: 0.5,
    backgroundColor: "transparent",
  },
  leftSection: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  content: {
    flex: 1,
    gap: 0,
  },
  rightSection: {
    alignItems: "flex-end",
    justifyContent: "center",
    paddingLeft: 8,
  },
  title: {
    fontFamily: "Mont-600",
    fontSize: 14,
    letterSpacing: -0.1,
  },
  description: {
    fontFamily: "Mont-500",
    fontSize: 12,
    marginTop: 1,
  },
  date: {
    fontFamily: "Mont-400",
    fontSize: 10,
    letterSpacing: 0.5,
    marginTop: 4,
  },
  amount: {
    fontFamily: "Mont-600",
    fontSize: 15,
    letterSpacing: -0.3,
  },
  balance: {
    fontFamily: "Mont-400",
    fontSize: 11,
    marginTop: 3,
  },
  profitText: {
    color: "#10B981", // Kâr rengini (Yeşil) Auro paletine uygun bıraktım
    fontFamily: "Mont-500",
  },
});
