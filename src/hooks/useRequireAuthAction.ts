import { useCallback } from "react";
import { CommonActions } from "@react-navigation/native";

import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastStore } from "@/store/useToastStore";

const DEFAULT_LOGIN_MESSAGE = "Devam etmek için giriş yapmalısın.";

export const useRequireAuthAction = () => {
  const navigation = useAppNavigation();
  const user = useAuthStore((state) => state.user);

  const openLogin = useCallback(
    (message = DEFAULT_LOGIN_MESSAGE) => {
      useToastStore.getState().showToast({
        type: "Bilgi",
        message,
      });

      // navigation.dispatch(
      //   CommonActions.reset({
      //     index: 0,
      //     routes: [
      //       {
      //         name: "Main",
      //         params: {
      //           screen: "Profile",
      //           params: {
      //             screen: "Main",
      //             params: { openLogin: true },
      //           },
      //         },
      //       },
      //     ],
      //   }),
      // );
    },
    [navigation],
  );

  const requireAuth = useCallback(
    (action?: () => void, message?: string) => {
      if (!user) {
        openLogin(message);
        return false;
      }

      action?.();
      return true;
    },
    [openLogin, user],
  );

  return {
    isAuthenticated: !!user,
    openLogin,
    requireAuth,
    user,
  };
};
