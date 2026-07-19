import { Text, View, StyleSheet } from "react-native";
import { EmptyListGhost } from "@/components/StateIcons/EmptyListGhost";
import { SmilingGhost } from "@/components/StateIcons/SmilingGhost";
import { useAppTheme } from "@/hooks/useTheme";

export const EmptyComments = ({ hasMyComment }: { hasMyComment: boolean }) => {
  const { theme, isDarkMode } = useAppTheme();

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        {hasMyComment ? (
          <SmilingGhost
            size={100}
            strokeWidth={18} // Biraz daha ince, daha zarif
            color={isDarkMode ? theme.textPrimary : "#1e293b"}
          />
        ) : (
          <EmptyListGhost
            size={100}
            strokeWidth={18}
            color={isDarkMode ? theme.textPrimary : "#1e293b"}
          />
        )}

        <Text style={[styles.title, { color: theme.textPrimary }]}>
          {hasMyComment
            ? "ŞİMDİLİK SADECE SEN VARSIN!"
            : "BURASI BİRAZ SESSİZ..."}
        </Text>

        <Text style={[styles.description, { color: theme.textSecondary }]}>
          {hasMyComment
            ? "Yorumunla bu bölümü başlatan ilk kişi oldun.\nDiğerleri de katılabilir."
            : "Henüz kimse bir şey yazmamış.\nİlk sen başlatmak ister misin?"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    zIndex: -1,
  },
  card: {
    width: "100%",
    alignItems: "center",
    gap: 16,
  },
  title: {
    fontFamily: "Mont-700",
    fontSize: 10, // Mikro-tipografi: Küçük ama güçlü başlık
    letterSpacing: 2,
    textAlign: "center",
    marginTop: 20,
    textTransform: "uppercase",
  },
  description: {
    fontFamily: "Mont-500",
    fontSize: 12, // 14'ten 12'ye çektik
    textAlign: "center",
    lineHeight: 18,
    letterSpacing: -0.2,
    opacity: 0.8,
  },
});
