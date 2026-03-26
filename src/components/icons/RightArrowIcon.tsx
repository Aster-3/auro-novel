import Svg, { Path } from "react-native-svg";

export const RightArrowIcon = ({
  color = "#1C274C",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 5l5.15 5a2.739 2.739 0 010 4L9 19"
      stroke={color}
      strokeWidth={1.664}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
