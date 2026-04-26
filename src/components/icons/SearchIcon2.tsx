import Svg, { Path } from "react-native-svg";

export const SearchIcon2 = ({
  color = "#9D9D9D",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 30 30" fill="none">
    <Path
      d="M25 25l-5.246-5.246S17.5 22.5 13.125 22.5a9.375 9.375 0 119.188-7.5"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
