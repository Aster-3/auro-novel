import React from "react";
import { Svg, Path } from "react-native-svg";

interface IconProps {
  color?: string;
  size?: number;
}

export const PlusIcon = ({ color = "#1C274C", size = 24 }: IconProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 12H18M12 6V18"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
