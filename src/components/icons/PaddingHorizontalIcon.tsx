import Svg, { Path } from "react-native-svg";

export const PaddingHorizontalIcon = ({
  color = "#1C274C",
  size = 16,
  strokeWidth = 1.664,
}: {
  color?: string;
  size?: number;
  strokeWidth?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Path
      d="M12.667 2.667v10.666M3.333 2.667v10.666m4-2h1.334a.667.667 0 00.666-.666V5.333a.667.667 0 00-.666-.666H7.333a.667.667 0 00-.666.666v5.334c0 .368.298.666.666.666z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
