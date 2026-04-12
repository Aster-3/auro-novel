import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

export const LittleRecommendIcon = ({
  color = "#FFFFFF",
  size = 14,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <Path
      d="M6.459 13.982v-3.981M1.643 9.123a2.405 2.405 0 114.803 0v4.053a2.405 2.405 0 11-4.803 0V9.123z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6.459 13.176a2.412 2.412 0 002.398 2.426h2.966a3.197 3.197 0 003.067-2.304l1.08-3.657a1.62 1.62 0 00-1.512-2.16h-3.974V3.679A1.051 1.051 0 009.44 2.621a1.044 1.044 0 00-1.001.763l-1.98 6.595"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
