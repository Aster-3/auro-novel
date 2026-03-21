import Svg, { Path } from "react-native-svg";

export const BookReadIcon = ({
  color = "#FFFFFF",
  size = 20,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M10 5.833V17.5M13.333 10H15M13.333 6.667H15M2.5 15a.833.833 0 01-.833-.833V3.333A.833.833 0 012.5 2.5h4.167A3.333 3.333 0 0110 5.833 3.333 3.333 0 0113.333 2.5H17.5a.833.833 0 01.833.833v10.834A.833.833 0 0117.5 15h-5a2.5 2.5 0 00-2.5 2.5A2.5 2.5 0 007.5 15h-5zM5 10h1.667M5 6.667h1.667"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
