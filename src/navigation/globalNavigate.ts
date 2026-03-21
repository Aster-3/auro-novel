import { createNavigationContainerRef } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef<any>();

export const globalNavigate = (name: string, params?: object) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as any, params as any);
  }
};
