import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

export const SelectImageIcon = ({
  color = "#1C274C",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Path
      d="M11.968 28C5.406 28 4 26.594 4 20.032M28 20.032C28 26.594 26.594 28 20.032 28M20.032 4C26.594 4 28 5.406 28 11.968M4 11.968C4 5.406 5.406 4 11.968 4"
      stroke={color}
      strokeWidth={1.92}
      strokeLinecap="round"
    />
    <Path
      d="M16 12.667v6.666M19.333 16h-6.666"
      stroke={color}
      strokeWidth={1.92}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
