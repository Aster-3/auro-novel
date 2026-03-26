import Svg, { Path } from "react-native-svg";

export const ChevronBottomIcon = ({
  color = "#1C274C",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 15.375l-6.75-6.75M18.75 8.625L12 15.375"
      stroke={color}
      strokeWidth={1.92}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
