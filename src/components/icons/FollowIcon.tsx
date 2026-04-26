import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

export const FollowIcon = ({
  color = "#09244B",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <G clipPath="url(#clip0_549_589)">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.583 8a2.917 2.917 0 012.917 2.917v1.166a.583.583 0 11-1.167 0v-1.166a1.75 1.75 0 00-1.75-1.75H3.917a1.75 1.75 0 00-1.75 1.75v1.166a.583.583 0 11-1.167 0v-1.166A2.917 2.917 0 013.917 8h4.666zm2.334-3.5c.322 0 .583.261.583.583v.584h.583a.583.583 0 110 1.166H11.5v.584a.583.583 0 01-1.167 0v-.584H9.75a.583.583 0 110-1.166h.583v-.584c0-.322.261-.583.584-.583zM6.25 1a2.917 2.917 0 110 5.833A2.917 2.917 0 016.25 1zm0 1.167a1.75 1.75 0 100 3.5 1.75 1.75 0 000-3.5z"
        fill={color}
      />
    </G>
    <Defs>
      <ClipPath id="clip0_549_589">
        <Path fill="#fff" d="M0 0H14V14H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
