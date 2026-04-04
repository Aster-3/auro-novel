import Svg, { Path } from "react-native-svg";

export const AlignCenterIcon = ({
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
      d="M11.333 12H4.667m8.666-2.667H2.667m8.666-2.666H4.667M13.333 4H2.667"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
