import Svg, { Path } from "react-native-svg";

export const FilterIcon = ({
  color = "#1C274C",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 30 30" fill="none">
    <Path
      d="M2.5 21.875h6.25M27.5 8.125h-6.25M16.25 21.875H27.5M13.75 8.125H2.5M12.5 25.5a3.75 3.75 0 110-7.5 3.75 3.75 0 010 7.5zM17.5 11.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
      stroke={color}
      strokeWidth={2}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
