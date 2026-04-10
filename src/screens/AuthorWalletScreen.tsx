import { Header } from "@/components/Header";
import { Screen } from "@/components/layout/Screen";
import { AuthorGraphics } from "@/Features/AuthorWalletScreen/AuthorGraphics";
import { AuthorTransactions } from "@/Features/AuthorWalletScreen/AuthorTransactions";
import { WalletCard } from "@/Features/AuthorWalletScreen/WalletCard";
import { ScrollView } from "react-native";

const AuthorWalletScreen = () => {
  return (
    <Screen>
      <Header title="Yazar Cüzdanı" isAdjacent={false} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: 24,
          paddingHorizontal: 4,
          marginTop: 8,
          paddingBottom: 78,
        }}
      >
        <WalletCard isCanWithdraw={true} />
        <AuthorTransactions />
        {/* <AuthorGraphics /> */}
      </ScrollView>
    </Screen>
  );
};

export default AuthorWalletScreen;
