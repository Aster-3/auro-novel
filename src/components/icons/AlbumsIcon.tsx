import Svg, { Path, Rect } from "react-native-svg";

export const AlbumsIcon = ({
  color = "#1C274C",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 512 512">
    <Rect
      x={64}
      y={176}
      width={384}
      height={256}
      rx={28.87}
      ry={28.87}
      fill="none"
      stroke={color}
      strokeLinejoin="round"
      strokeWidth="32px"
    />
    <Path
      d="M144 80L368 80"
      stroke={color}
      strokeLinecap="round"
      strokeMiterlimit={10}
      strokeWidth="32px"
    />
    <Path
      d="M112 128L400 128"
      stroke={color}
      strokeLinecap="round"
      strokeMiterlimit={10}
      strokeWidth="32px"
    />
  </Svg>
);
