import Svg, { Path } from "react-native-svg";

export const ShieldIcon = ({
  color = "#1C274C",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M23.333 15.167c0 5.833-4.083 8.75-8.936 10.441-.254.087-.53.082-.782-.011C8.75 23.917 4.667 21 4.667 15.167V7a1.167 1.167 0 011.166-1.167c2.334 0 5.25-1.4 7.28-3.173a1.365 1.365 0 011.774 0c2.041 1.785 4.946 3.173 7.28 3.173A1.167 1.167 0 0123.333 7v8.167zM9.333 14h.012M14 14h.012M18.667 14h.011"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
