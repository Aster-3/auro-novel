import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

export const StatusIcon = ({
  color = "#00CE78",
  size = 10,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 12 12" fill="none">
    <G clipPath="url(#clip0_8_857)">
      <Path
        d="M10.5 6a4.5 4.5 0 11-1-2.829"
        stroke={color}
        strokeOpacity={1}
        strokeWidth={1.92}
        strokeLinecap="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_8_857">
        <Path fill="#fff" d="M0 0H12V12H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
