import Svg, { Path } from "react-native-svg";

export const LikeİconFill = ({
  color = "#00F48E",
  borderColor = "#1C274C",
  size = 24,
}: {
  color?: string;
  borderColor?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M8.612 18.643v-5.309z" fill={color} />
    <Path
      d="M8.612 18.643v-5.309"
      stroke={borderColor}
      strokeWidth={1.28}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2.191 12.163a3.206 3.206 0 116.403 0v5.405a3.207 3.207 0 11-6.403 0v-5.405z"
      fill={color}
      stroke={borderColor}
      strokeWidth={1.28}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8.612 17.568a3.216 3.216 0 003.197 3.235h3.955a4.263 4.263 0 004.09-3.072l1.44-4.877a2.161 2.161 0 00-2.017-2.88h-5.299V4.906a1.402 1.402 0 00-1.392-1.412 1.392 1.392 0 00-1.334 1.018l-2.64 8.794"
      fill={color}
    />
    <Path
      d="M8.612 17.568a3.216 3.216 0 003.197 3.235h3.955a4.263 4.263 0 004.09-3.072l1.44-4.877a2.161 2.161 0 00-2.017-2.88h-5.299V4.906a1.402 1.402 0 00-1.392-1.412 1.392 1.392 0 00-1.334 1.018l-2.64 8.794"
      stroke={borderColor}
      strokeWidth={1.28}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
