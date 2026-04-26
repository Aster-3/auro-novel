import Svg, { Path } from "react-native-svg";

export const SortIcon = ({
  color = "#1C274C",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="4 4 22 22" fill="none">
    <Path
      d="M5 10h11.25M7.5 16.25h8.75M10 22.5h6.25"
      stroke={color}
      strokeWidth={1.92}
      strokeLinecap="round"
    />
    <Path
      d="M21.25 25V5L25 10"
      stroke={color}
      strokeWidth={1.92}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
