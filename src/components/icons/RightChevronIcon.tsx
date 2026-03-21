import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

export const RightChevronIcon = ({
  color = "#070000",
  size = 20,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M7.5 15l5-5-5-5"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
