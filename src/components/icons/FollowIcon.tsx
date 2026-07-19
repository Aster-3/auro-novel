import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

export const FollowIcon = ({
  color = "#09244B",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 21 21" fill="none">
    <Path
      d="M5.25 3.5a8.742 8.742 0 015.25-1.75c4.83 0 8.75 3.92 8.75 8.75s-3.92 8.75-8.75 8.75-8.75-3.92-8.75-8.75c0-1.584.42-3.071 1.164-4.358L10.5 10.5"
      stroke={color}
      strokeWidth={1.3}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5.976 7.84a5.18 5.18 0 00-.726 2.66 5.254 5.254 0 005.25 5.25 5.254 5.254 0 005.25-5.25 5.254 5.254 0 00-5.25-5.25c-.796 0-1.557.175-2.231.499"
      stroke={color}
      strokeWidth={1.3}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
