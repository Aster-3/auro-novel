import Svg, { Path } from "react-native-svg";

export const FlagIcon2 = ({
  color = "#1C274C",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.25 8A6.75 6.75 0 018 1.25h8A6.75 6.75 0 0122.75 8v8A6.75 6.75 0 0116 22.75H8A6.75 6.75 0 011.25 16V8zM8 2.75A5.25 5.25 0 002.75 8v8c0 2.9 2.35 5.25 5.25 5.25h8c2.9 0 5.25-2.35 5.25-5.25V8c0-2.9-2.35-5.25-5.25-5.25H8z"
      fill={color}
      stroke={color}
      strokeWidth={0.00064}
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 6.25a.75.75 0 01.75.75v7.105a.75.75 0 01-1.5 0V7a.75.75 0 01.75-.75zM11 17a1 1 0 011-1h.01a1 1 0 110 2H12a1 1 0 01-1-1z"
      fill={color}
      stroke={color}
      strokeWidth={0.00064}
    />
  </Svg>
);
