import Svg, { Path } from "react-native-svg";

export const NextChapterIcon = ({
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
      d="M6 17l5-5-5-5M13 17l5-5-5-5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
