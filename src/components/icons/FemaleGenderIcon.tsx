import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

export const FemaleGenderIcon = ({
  color = "#606060",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Path
      d="M9.8 10.1a3.9 3.9 0 11-7.8 0 3.9 3.9 0 017.8 0zM9.8 2H14v4.2M8.9 7.1L14 2"
      stroke={color}
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
