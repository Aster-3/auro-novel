import Svg, { Path } from "react-native-svg";

export const UserRegisterIcon = ({
  color = "#1C274C",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 10a4 4 0 100-8 4 4 0 000 8z"
      stroke={color}
      strokeWidth={1.92}
    />
    <Path
      d="M19.997 18c.003-.164.003-.331.003-.5 0-2.485-3.582-4.5-8-4.5s-8 2.015-8 4.5S4 22 12 22c2.231 0 3.84-.157 5-.437"
      stroke={color}
      strokeWidth={1.92}
      strokeLinecap="round"
    />
  </Svg>
);
