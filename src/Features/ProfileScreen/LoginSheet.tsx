import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet, Platform, Keyboard } from "react-native";
import { LoginBody } from "./LoginBody";
import { globalNavigate } from "@/navigation/globalNavigate";
import { useFocusEffect } from "@react-navigation/native";
import { useAuthStore } from "@/store/useAuthStore";
import { TokenStorage } from "@/utils/tokenStorage";

export interface LoginSheetRef {
  expand: () => void;
  close: () => void;
}

export interface LoginSheetProps {}

export const LoginSheet = forwardRef<LoginSheetRef, LoginSheetProps>(
  (props: LoginSheetProps, ref) => {
    const user = useAuthStore((state) => state.user);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const currentIndex = useRef<number>(-1);
    const [canClose, setCanClose] = useState<boolean>(true);

    const navigateToRegister = () => {
      bottomSheetModalRef.current?.dismiss();

      setTimeout(() => {
        globalNavigate("Register");
      }, 200);
    };

    const navigateToVerify = (email: string) => {
      bottomSheetModalRef.current?.dismiss();
      setTimeout(() => {
        globalNavigate("VerifyUser", { email });
      }, 200);
    };

    const onLoginSuccess = (
      data: any,
      accessToken: string,
      refreshToken: string,
    ) => {
      console.log("Login Başarılı:", data);
      useAuthStore.setState({ user: data.user });
      TokenStorage.saveTokens(accessToken, refreshToken);
      bottomSheetModalRef.current?.dismiss();
    };

    const snapPoints = useMemo(() => ["60%", "97%"], []);

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
            if (currentIndex.current === 1) return;
            bottomSheetModalRef.current?.expand();
          }, 150);
        });

        const hideSubscription = Keyboard.addListener(hideEvent, () => {
          if (currentIndex.current === -1) return;

          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            if (currentIndex.current === 1) {
              bottomSheetModalRef.current?.snapToIndex(0);
            }
          }, 150);
        });

        return () => {
          clearTimeout(timeoutId);
          showSubscription.remove();
          hideSubscription.remove();
        };
      }, []),
    );

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

    useImperativeHandle(ref, () => ({
      expand: () => {
        bottomSheetModalRef.current?.present();
      },
      close: () => {
        currentIndex.current = -1;
        Keyboard.dismiss();
        bottomSheetModalRef.current?.dismiss();
      },
    }));

    if (user) {
      return null;
    }

    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.indicator}
        enablePanDownToClose={canClose}
        enableDynamicSizing={false}
        onAnimate={(fromIndex, toIndex) => {
          currentIndex.current = toIndex;
        }}
        onChange={(index) => {
          if (index === 1) {
            setCanClose(false);
          } else {
            setCanClose(true);
          }
        }}
      >
        <LoginBody
          navigateToVerify={navigateToVerify}
          navigateToRegister={navigateToRegister}
          onLoginSuccess={onLoginSuccess}
        />
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: "#FFFFFF",
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
});
