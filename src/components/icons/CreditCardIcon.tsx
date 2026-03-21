import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

export const CreditCardIcon = ({
  color = "#1C274C",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <G clipPath="url(#clip0_147_222)" stroke={color} strokeWidth={0.00064}>
      <Path
        d="M24.5 5.25h-21A1.75 1.75 0 001.75 7v14a1.75 1.75 0 001.75 1.75h21A1.75 1.75 0 0026.25 21V7a1.75 1.75 0 00-1.75-1.75zm0 1.75v2.625h-21V7h21zm-21 14v-9.625h21V21h-21z"
        fill={color}
      />
      <Path d="M14 17.5H5.25v1.75H14V17.5z" fill={color} />
      <Path d="M28 0H0v28h28V0z" />
    </G>
    <Defs>
      <ClipPath id="clip0_147_222">
        <Path fill="#fff" d="M0 0H28V28H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
