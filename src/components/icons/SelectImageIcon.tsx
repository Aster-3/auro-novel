import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

export const SelectImageIcon = ({
  color = "#1C274C",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <G
      clipPath="url(#clip0_292_298)"
      stroke={color}
      strokeWidth={1.52}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M1.5 4.5a3 3 0 013-3M22.5 4.5a3 3 0 00-3-3M22.5 19.5a3 3 0 01-3 3M1.5 19.5a3 3 0 003 3M22.5 13.5v3M22.5 7.5v3M1.5 13.5v3M1.5 7.5v3M10.5 1.5h-3M16.5 1.5h-3M10.5 22.5h-3M16.5 22.5h-3M9 12h6M12 9v6" />
    </G>
    <Defs>
      <ClipPath id="clip0_292_298">
        <Path fill="#fff" d="M0 0H24V24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
