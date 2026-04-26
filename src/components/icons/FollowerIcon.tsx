import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

export const FollowerIcon = ({
  color = "#606060",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Path
      d="M9.5 5a3 3 0 100 6 3 3 0 000-6zM4.5 11c-1.333-2-1.333-4 0-6"
      stroke={color}
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
