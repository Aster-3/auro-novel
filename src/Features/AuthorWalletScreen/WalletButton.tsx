import { WithdrawlHisotoryIcon } from "@/components/icons/WithdrawlHisotoryIcon";
import { WithdrawlIcon } from "@/components/icons/WithdrawlIcon";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useAppTheme } from "@/hooks/useTheme"; // Temayı çektik

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const WalletButton = ({
  isWithdrawal,
  isPendingStatus,
}: {
  isWithdrawal: boolean;
  isPendingStatus?: boolean;
}) => {
  const { isDarkMode, theme } = useAppTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: isPendingStatus ? 0.7 : opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const springConfig = {
    damping: 15,
    stiffness: 300,
    mass: 0.5,
  };

  const onPressIn = () => {
    scale.value = withSpring(0.96, springConfig);
    opacity.value = withSpring(0.8, springConfig);
  };

  const onPressOut = () => {
    scale.value = withSpring(1, springConfig);
    opacity.value = withSpring(1, springConfig);
  };

  // Karanlık modda butonun o çok koyu lacivertini (010114) biraz daha
  // belirgin bir custom renkle değiştiriyoruz ki kartın içinde ölmesin.
  const customBackgroundColor = isDarkMode ? "#aaaabc50" : "#010114";

  return (
    <AnimatedPressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={isPendingStatus}
      style={[
        styles.button,
        { backgroundColor: customBackgroundColor },
        animatedStyle,
      ]}
    >
      {isWithdrawal ? (
        <WithdrawlIcon size={16} color="#fff" />
      ) : (
        <WithdrawlHisotoryIcon size={16} color="#fff" />
      )}
      <Text style={styles.buttonText}>
        {isPendingStatus
          ? "Bekleniyor..."
          : isWithdrawal
            ? "Hemen Çek"
            : "Çekme İstekleri"}
      </Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20, // 24'ten 20'ye çektim, butonlar yan yana daha rahat sığsın diye
    borderRadius: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: "Mont-600",
  },
});
