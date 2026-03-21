import Svg, { Path } from "react-native-svg";

export const UserIcon = ({
  color = "#1C274C",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M14 14a3.5 3.5 0 100-7 3.5 3.5 0 000 7z"
      stroke={color}
      strokeWidth={1.92}
    />
    <Path
      d="M14 25.667c6.443 0 11.667-5.224 11.667-11.667S20.443 2.333 14 2.333 2.333 7.557 2.333 14 7.557 25.667 14 25.667z"
      stroke={color}
      strokeWidth={1.92}
    />
    <Path
      d="M20.964 23.333C20.778 19.96 19.746 17.5 14 17.5s-6.778 2.46-6.964 5.833"
      stroke={color}
      strokeWidth={1.92}
      strokeLinecap="round"
    />
  </Svg>
);
