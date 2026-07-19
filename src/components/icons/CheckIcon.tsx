import Svg, { Path } from "react-native-svg";

export const CheckIcon = ({
  color = "#1C274C",
  size = 18,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <Path
      d="M4 9.2L7.25 12.45L14 5.75"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
