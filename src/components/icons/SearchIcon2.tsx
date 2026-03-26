import Svg, { Path } from "react-native-svg";

export const SearchIcon2 = ({
  color = "#9D9D9D",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.333 9.167a5.833 5.833 0 1111.667 0 5.833 5.833 0 01-11.667 0zm5.834-7.5a7.5 7.5 0 104.681 13.36l3.063 3.062a.833.833 0 001.178-1.178l-3.062-3.063a7.5 7.5 0 00-5.86-12.181z"
      fill={color}
      stroke={color}
      strokeWidth={0.00064}
    />
  </Svg>
);
