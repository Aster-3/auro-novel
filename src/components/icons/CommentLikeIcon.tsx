import React, { useEffect } from "react";
import Svg, { Path } from "react-native-svg";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface CommentLikeIconProps {
  color?: string;
  size?: number;
  isLiked?: boolean;
}

export const CommentLikeIcon = ({
  color = "#FFFFFF",
  size = 16,
  isLiked = false,
}: CommentLikeIconProps) => {
  const progress = useSharedValue(isLiked ? 1 : 0);

  useEffect(() => {
    // Renk geçişi için 300ms ideal bir "soft" süre
    progress.value = withTiming(isLiked ? 1 : 0, { duration: 300 });
  }, [isLiked]);

  const animatedProps = useAnimatedProps(() => {
    // İç dolgu rengi: Şeffaf -> Ana Renk
    const fill = interpolateColor(
      progress.value,
      [0, 1],
      ["transparent", color],
    );

    return {
      fill: fill,
      stroke: color,
    };
  });

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      style={{ overflow: "visible" }} // Kenar kırpılmalarını önler
    >
      <AnimatedPath
        d="M1.333 6.333a3.667 3.667 0 016.394-2.45.373.373 0 00.546 0 3.66 3.66 0 016.394 2.45c0 1.527-1 2.667-2 3.667l-3.662 3.542a1.333 1.333 0 01-2 .013L3.333 10c-1-1-2-2.133-2-3.667z"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        animatedProps={animatedProps}
      />
    </Svg>
  );
};
