import Svg, { Path } from "react-native-svg";

export const HideLibraryIcon = ({
  color = "#1C274C",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 30 30" fill="none">
    <Path
      d="M19.561 6.744a12.79 12.79 0 00-4.56-.844c-4.413 0-8.526 2.286-11.388 6.242-1.125 1.55-1.125 4.154 0 5.704A16.997 16.997 0 005.458 20M24.156 9.62a16.83 16.83 0 012.232 2.522c1.125 1.55 1.125 4.154 0 5.704-2.863 3.956-6.975 6.242-11.388 6.242-1.732 0-3.418-.353-5-1.02"
      stroke={color}
      strokeWidth={1.28}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M18.75 15A3.746 3.746 0 0115 18.75m2.625-6.43A3.738 3.738 0 0015 11.25 3.746 3.746 0 0011.25 15c0 .912.324 1.746.863 2.396"
      stroke={color}
      strokeWidth={1.28}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2.5 26.25l25-22.875"
      stroke={color}
      strokeWidth={1.28}
      strokeLinecap="round"
    />
  </Svg>
);
