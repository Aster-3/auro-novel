import Svg, { Path } from "react-native-svg";

export const BookReadIcon = ({
  color = "#FFFFFF",
  size = 20,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M14 5.09a24.83 24.83 0 017.726-2.863 4.06 4.06 0 015.001 4.137v11.454a6.363 6.363 0 01-5.002 6.045A24.834 24.834 0 0014 26.727M14 5.09a24.83 24.83 0 00-7.726-2.863 4.06 4.06 0 00-5.002 4.137v11.454a6.364 6.364 0 005.002 6.045A24.833 24.833 0 0114 26.727M14 26.727V5.091"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
