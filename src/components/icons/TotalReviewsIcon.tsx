import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

export const TotalReviewsIcon = ({
  color = "#1C274C",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <G
      clipPath="url(#clip0_477_608)"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M9.333 6A1.333 1.333 0 018 7.333H4L1.333 10V2.667a1.333 1.333 0 011.334-1.334H8a1.333 1.333 0 011.333 1.334V6zM12 6h1.333a1.333 1.333 0 011.334 1.333v7.334L12 12H8a1.334 1.334 0 01-1.333-1.333V10" />
    </G>
    <Defs>
      <ClipPath id="clip0_477_608">
        <Path fill="#fff" d="M0 0H16V16H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
