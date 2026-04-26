import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

export const MaleGenderIcon = ({
  color = "#606060",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Path
      d="M12 5.846a4 4 0 11-8 0 4 4 0 018 0zM5.23 12.308h5.54M8 14.154V9.846"
      stroke={color}
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
