import { View, StyleSheet, Text } from "react-native";
import { WalletButton } from "./WalletButton";
import { LockedButton } from "./LockedButton";
import { InformationText } from "./InformationText";
import { useAuthorWalletInfo } from "@/hooks/useAuthorWalletInfo";
import { useAppTheme } from "@/hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient"; // Gradient'i ekledik
import Animated from "react-native-reanimated";

export const WalletCard = ({ isCanWithdraw }: { isCanWithdraw: boolean }) => {
  const { theme, isDarkMode } = useAppTheme();
  const { data: wallet, isLoading } = useAuthorWalletInfo();
  const isPendingStatus = false;

  // Gradient Renkleri Mantığı:
  // Aydınlık modda sağ üste doğru ferah beyaz, karanlık modda ise derin lacivert/siyah
  const gradientColors = isDarkMode
    ? ["#0F172A", "#1E293B"] // Derin Siyah/Lacivert -> Sağ üste doğru açılan ton
    : ["#FFFFFF", "#F9FAFB"]; // Tam Beyaz -> Sağ üste doğru açılan çok açık gri

  return (
    <Animated.View
      style={[
        styles.animatedWrapper,
        {
          shadowColor: isDarkMode ? "#000" : "#000",
          shadowOpacity: isDarkMode ? 0.3 : 0.1,
        },
      ]}
    >
      {/* Kartın arka planını düz renk yerine Gradient yaptık */}
      <LinearGradient
        colors={gradientColors as any}
        start={{ x: 0, y: 1 }} // Sol alt (Daha koyu başlangıç)
        end={{ x: 1, y: 0 }} // Sağ üst (Daha açık bitiş)
        style={styles.wrapper}
      >
        <View style={styles.headContainer}>
          <View style={styles.head}>
            <View style={styles.greenDot} />
            <Text
              style={[
                styles.headTitle,
                { fontSize: 12, color: theme.textSecondary },
              ]}
            >
              Çekilebilir Bakiye
            </Text>
          </View>

          <Text
            style={[
              styles.headValue,
              { fontSize: 24, color: theme.textPrimary },
            ]}
          >
            ₺{wallet?.withdrawableBalance.toFixed(2)}
          </Text>
        </View>

        <View style={styles.bodyContainer}>
          <View style={styles.headContainer}>
            <Text
              style={[
                styles.headTitle,
                { fontSize: 11, color: theme.textSecondary },
              ]}
            >
              Bekleyen
            </Text>
            <Text
              style={[
                styles.headValue,
                { fontSize: 16, color: theme.textPrimary },
              ]}
            >
              ₺{wallet?.pendingWithdrawalBalance.toFixed(2)}
            </Text>
          </View>

          <View
            style={[
              styles.line,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.1)",
              },
            ]}
          />

          <View style={styles.headContainer}>
            <Text
              style={[
                styles.headTitle,
                { fontSize: 11, color: theme.textSecondary },
              ]}
            >
              Toplam kazanılan tutar
            </Text>
            <Text
              style={[
                styles.headValue,
                { fontSize: 16, color: theme.textPrimary },
              ]}
            >
              ₺{wallet?.totalEarnings.toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          {isCanWithdraw ? (
            <>
              <WalletButton
                isPendingStatus={isPendingStatus}
                isWithdrawal={true}
              />
              <WalletButton isWithdrawal={false} />
            </>
          ) : (
            <LockedButton />
          )}
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedWrapper: {
    borderRadius: 26,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
  },
  wrapper: {
    flex: 1, // Gradient'in tüm kartı kaplaması için
    borderRadius: 26, // Radius'u Gradient'e de verdik
    paddingVertical: 24,
    paddingHorizontal: 24,
    gap: 8,
    overflow: "hidden", // Radius'un dışarı taşmaması için
  },
  headContainer: {
    gap: 8,
  },
  bodyContainer: {
    flexDirection: "row",
    gap: 24,
  },
  head: {
    flexDirection: "row",
    alignItems: "center",
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 10,
    backgroundColor: "#4CAF50",
    marginRight: 8,
  },
  headTitle: {
    fontFamily: "Mont-400",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  headValue: {
    fontFamily: "Mont-500",
    letterSpacing: -0.5,
  },
  line: {
    width: 1,
    height: "100%",
  },
  buttonContainer: {
    flexGrow: 1,
    flexWrap: "wrap",
    marginTop: 12,
    flexDirection: "row",
    gap: 8,
  },
});
