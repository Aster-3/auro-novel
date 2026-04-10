import {
  CommonActions,
  createNavigationContainerRef,
  StackActions,
} from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef<any>();

type NavigationType = "navigate" | "push" | "replace";

export const globalNavigate = (
  name: string,
  params?: object,
  type: NavigationType = "navigate",
) => {
  if (navigationRef.isReady()) {
    if (type === "replace") {
      navigationRef.dispatch(StackActions.replace(name, params));
    } else if (type === "push") {
      navigationRef.dispatch(StackActions.push(name, params));
    } else {
      navigationRef.navigate(name as any, params as any);
    }
  }
};

export const navigateToNovelSafe = (novelId: string, chapterId: string) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate("Novel", { id: novelId });

    navigationRef.dispatch(StackActions.replace("Novel", { id: novelId }));
  }
};
