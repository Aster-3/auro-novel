import { useMemo } from "react";
import { useDynamicBottom } from "./useDynamicBottom";

export const TAB_BAR_HEIGHT = 46;
export const TAB_BAR_CONTENT_GAP = 34;

export const useTabBarBottomPadding = (extraGap = 0) => {
  const dynamicBottom = useDynamicBottom();

  return useMemo(
    () => dynamicBottom + TAB_BAR_HEIGHT + TAB_BAR_CONTENT_GAP + extraGap,
    [dynamicBottom, extraGap],
  );
};
