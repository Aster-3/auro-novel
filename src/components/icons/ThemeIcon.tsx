import Svg, { Path } from "react-native-svg";

export const ThemeIcon = ({
  color = "#1C274C",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M18.375 21a7 7 0 100-14 7 7 0 000 14zM12.25 4.375v.875M4.209 5.959l1.855 1.855M2.625 14H3.5M4.209 22.041l1.855-1.855M12.25 23.625v-.875"
      stroke={color}
      strokeWidth={1.92}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14.376 19.749a6.142 6.142 0 01-2.126.376A6.12 6.12 0 016.125 14a6.12 6.12 0 016.125-6.125c.744 0 1.461.131 2.126.376"
      stroke={color}
      strokeWidth={1.92}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
