import Svg, { Path } from "react-native-svg";

export const LikeIcon = ({
  color = "#FFFFFF",
  size = 14,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Path
      d="M5.741 12.429v-3.54M1.46 8.109a2.137 2.137 0 114.27 0v3.603a2.137 2.137 0 11-4.27 0V8.109z"
      stroke={color}
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5.741 11.712a2.144 2.144 0 002.131 2.157h2.637a2.842 2.842 0 002.727-2.048l.96-3.251a1.441 1.441 0 00-1.344-1.92H9.319V3.27a.935.935 0 00-.928-.94.928.928 0 00-.89.678L5.741 8.87"
      stroke={color}
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
