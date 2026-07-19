import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet, Platform, Keyboard } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Portal } from "@gorhom/portal";
import { useFocusEffect } from "@react-navigation/native";

// Projenize özel importlar
import { LoginBody } from "./LoginBody";
import { globalNavigate } from "@/navigation/globalNavigate";
import { useAuthStore } from "@/store/useAuthStore";
import { TokenStorage } from "@/utils/tokenStorage";
import { useAppTheme } from "@/hooks/useTheme";

export interface LoginSheetRef {
  expand: () => void;
  close: () => void;
}

export interface LoginSheetProps {}

export const LoginSheet = forwardRef<LoginSheetRef, LoginSheetProps>(
  (props, ref) => {
    const user = useAuthStore((state) => state.user);
    const { theme, isDarkMode } = useAppTheme();
    const bottomSheetRef = useRef<BottomSheet>(null);

    const currentIndex = useRef<number>(-1);
    const [canClose, setCanClose] = useState<boolean>(true);
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const snapPoints = useMemo(() => ["60%", "97%"], []);

    const animationConfigs = useMemo(
      () => ({
        damping: 20, // Yaylanma direnci (ne kadar yüksekse o kadar az zıplar)
        stiffness: 90, // Yayın sertliği
        mass: 0.2,
        overshootClamping: true, // Hedefi aşmasını engeller
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
      }),
      [],
    );

    // Klavye yönetimi
    useFocusEffect(
      useCallback(() => {
        const showEvent =
          Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
        const hideEvent =
          Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

        let timeoutId: ReturnType<typeof setTimeout>;

        const showSubscription = Keyboard.addListener(showEvent, () => {
          if (currentIndex.current === -1) return;
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            if (currentIndex.current !== 1) {
              bottomSheetRef.current?.expand();
            }
          }, 50);
        });

        const hideSubscription = Keyboard.addListener(hideEvent, () => {
          if (currentIndex.current === -1) return;
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            if (currentIndex.current === 1) {
              bottomSheetRef.current?.snapToIndex(0);
            }
          }, 50);
        });

        return () => {
          clearTimeout(timeoutId);
          showSubscription.remove();
          hideSubscription.remove();
        };
      }, []),
    );

    // Navigasyon ve Başarı Fonksiyonları
    const navigateToRegister = () => {
      bottomSheetRef.current?.close();
      setTimeout(() => globalNavigate("Register"), 300);
    };

    const navigateToVerify = (email: string) => {
      bottomSheetRef.current?.close();
      setTimeout(() => globalNavigate("VerifyUser", { email }), 300);
    };

    const navigateToForgotPassword = () => {
      bottomSheetRef.current?.close();
      setTimeout(() => globalNavigate("ForgotPassword"), 300);
    };

    const onLoginSuccess = (
      data: any,
      accessToken: string,
      refreshToken: string,
    ) => {
      useAuthStore.getState().setAuthSession({ user: data.user, accessToken });
      TokenStorage.saveTokens(accessToken, refreshToken);
      bottomSheetRef.current?.close();
    };

    // Backdrop (Arka plan karartması)
    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.4}
        />
      ),
      [],
    );

    // Dışarıdan tetiklenecek metodlar
    useImperativeHandle(ref, () => ({
      expand: () => {
        setIsVisible(true);
      },
      close: () => {
        currentIndex.current = -1;
        Keyboard.dismiss();
        bottomSheetRef.current?.close();
      },
    }));

    if (user || !isVisible) return null;

    return (
      <Portal>
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          backdropComponent={renderBackdrop}
          backgroundStyle={[
            styles.sheetBackground,
            { backgroundColor: isDarkMode ? "#08080a" : "#FFFFFF" },
          ]}
          handleIndicatorStyle={[
            styles.indicator,
            {
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.24)"
                : "#E0E0E0",
            },
          ]}
          enablePanDownToClose={canClose}
          enableDynamicSizing={false}
          animateOnMount={true} // Mount edildiğinde animasyon yapmasını sağlar
          animationConfigs={animationConfigs} // Özel yumuşaklık ayarları
          onAnimate={(_, toIndex) => {
            currentIndex.current = toIndex;
          }}
          onChange={(index) => {
            setCanClose(index !== 1);
            if (index === -1) {
              setIsVisible(false);
            }
          }}
        >
          <BottomSheetView style={styles.contentContainer}>
            <LoginBody
              navigateToVerify={navigateToVerify}
              navigateToRegister={navigateToRegister}
              navigateToForgotPassword={navigateToForgotPassword}
              onLoginSuccess={onLoginSuccess}
            />
          </BottomSheetView>
        </BottomSheet>
      </Portal>
    );
  },
);

const styles = StyleSheet.create({
  sheetBackground: {
    borderRadius: 30,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  indicator: {
    backgroundColor: "#E0E0E0",
    width: 40,
  },
  contentContainer: {
    flex: 1,
  },
});
