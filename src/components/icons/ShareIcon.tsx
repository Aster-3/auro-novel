import Svg, { Path } from "react-native-svg";

export const ShareIcon = ({ color = "#ffffff" }: { color?: string }) => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Path
      d="M10 1.667V12.5M13.333 5L10 1.667 6.667 5M3.333 10v6.667A1.667 1.667 0 005 18.333h10a1.667 1.667 0 001.667-1.666V10"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
