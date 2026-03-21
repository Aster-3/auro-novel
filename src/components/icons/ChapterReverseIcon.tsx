import Svg, { Path } from "react-native-svg";

export const ChapterReverseIcon = ({
  color = "#1C274C",
  size = 24,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 8h9" stroke={color} strokeWidth={1.28} strokeLinecap="round" />
    <Path
      opacity={0.7}
      d="M6 13h7"
      stroke={color}
      strokeWidth={1.68}
      strokeLinecap="round"
    />
    <Path
      opacity={0.4}
      d="M8 18h5"
      stroke={color}
      strokeWidth={1.68}
      strokeLinecap="round"
    />
    <Path
      d="M17 20V4l3 4"
      stroke={color}
      strokeWidth={1.68}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
