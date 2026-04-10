import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

export const DoubleDateIcon = ({
  color = "#1C274C",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <G
      clipPath="url(#clip0_477_628)"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M8 1.333v1.334M10.484 14.007a1.333 1.333 0 01-1.15.66H2.666a1.334 1.334 0 01-1.334-1.334V6.667a1.333 1.333 0 011.334-1.334M12 1.333v1.334M1.333 8.667h1.334M5.333 5.333h9.334" />
      <Path d="M13.333 2H6.667c-.737 0-1.334.597-1.334 1.333V10c0 .736.597 1.333 1.334 1.333h6.666c.737 0 1.334-.597 1.334-1.333V3.333c0-.736-.597-1.333-1.334-1.333z" />
    </G>
    <Defs>
      <ClipPath id="clip0_477_628">
        <Path fill="#fff" d="M0 0H16V16H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
