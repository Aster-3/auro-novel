import Svg, { Path } from "react-native-svg";

export const FontTypeIcon = ({
  color = "#09244B",
  size = 16,
  strokeWidth = 1.664,
}: {
  color?: string;
  size?: number;
  strokeWidth?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Path
      d="M8.667 12L5.333 4 2 12m5.333-2.667h-4M14 12v-2m0 0V8m0 2a2 2 0 11-4 0 2 2 0 014 0z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
