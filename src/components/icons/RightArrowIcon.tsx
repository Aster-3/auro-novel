import Svg, { Path } from "react-native-svg";

export const RightArrowIcon = ({
  color = "#1C274C",
  size = 16,
  strokeWidth = 1.664,
}: {
  color?: string;
  size?: number;
  strokeWidth?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 5l5.15 5a2.739 2.739 0 010 4L9 19"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
