import Svg, { Path } from "react-native-svg";

export const UnknownGenderIcon = ({
  color = "#606060",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Path
      d="M5.6 6.2a2.4 2.4 0 114.35 1.4c-.72.72-1.45.95-1.45 2.05M8 12.4h.01"
      stroke={color}
      strokeWidth={1.35}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
