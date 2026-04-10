import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

export const ReplyIcon = ({
  color = "#1C274C",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <G clipPath="url(#clip0_483_683)">
      <Path
        d="M1.995 10.895c.098.247.12.518.062.778l-.71 2.193a.666.666 0 00.824.779l2.276-.666c.245-.048.499-.027.732.062a6.667 6.667 0 10-3.184-3.146z"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_483_683">
        <Path fill="#fff" d="M0 0H16V16H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
