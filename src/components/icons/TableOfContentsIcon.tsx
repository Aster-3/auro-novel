import Svg, { Path } from "react-native-svg";

export const TableOfContentsIcon = ({
  color = "#09244B",
  size = 22,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 27 27" fill="none">
    <Path
      d="M10.152 5.848H24.5M10.152 13.5h8.609m-8.609 7.652H24.5"
      stroke={color}
      strokeWidth={1.92}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4.413 7.76a1.913 1.913 0 100-3.825 1.913 1.913 0 000 3.826zm0 7.653a1.913 1.913 0 100-3.827 1.913 1.913 0 000 3.827zm0 7.652a1.913 1.913 0 100-3.826 1.913 1.913 0 000 3.826z"
      fill={color}
    />
  </Svg>
);
