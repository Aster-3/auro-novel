import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";

export const AuthorIcon = ({
  color = "#070000",
  size = 10,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <G
      clipPath="url(#clip0_49_1473)"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M7.583 12.25h4.667M12.351 3.974a1.644 1.644 0 10-2.325-2.326L2.241 9.435a1.167 1.167 0 00-.291.484l-.771 2.539a.291.291 0 00.363.362l2.54-.77c.182-.055.349-.155.484-.29l7.785-7.786z" />
    </G>
    <Defs>
      <ClipPath id="clip0_49_1473">
        <Path fill="#fff" d="M0 0H14V14H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
