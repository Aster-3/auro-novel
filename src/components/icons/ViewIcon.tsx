import Svg, { Path } from "react-native-svg";

export const ViewIcon = ({
  color = "#FFFFFF",
  size = 14,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Path
      d="M1.375 8.232a.667.667 0 010-.464 7.167 7.167 0 0113.25 0 .666.666 0 010 .464 7.166 7.166 0 01-13.25 0z"
      stroke={color}
      strokeOpacity={0.9}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 10a2 2 0 100-4 2 2 0 000 4z"
      stroke="#fff"
      strokeOpacity={0.9}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
