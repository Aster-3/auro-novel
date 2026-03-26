import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

export const TagIcon = ({
  color = "#1C274C",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <Path
      d="M3.304 11.645L6.7 15.042a3.585 3.585 0 005.063 0l3.292-3.292a3.585 3.585 0 000-5.063l-3.405-3.39a3.563 3.563 0 00-2.7-1.042l-3.75.18a2.898 2.898 0 00-2.767 2.752l-.18 3.75a3.603 3.603 0 001.05 2.708z"
      stroke={color}
      strokeWidth={1.1}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7.301 9.17a1.875 1.875 0 100-3.75 1.875 1.875 0 000 3.75z"
      stroke={color}
      strokeWidth={1.1}
      strokeLinecap="round"
    />
    <Path
      d="M9.926 12.92l3-3"
      stroke={color}
      strokeWidth={1.1}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
