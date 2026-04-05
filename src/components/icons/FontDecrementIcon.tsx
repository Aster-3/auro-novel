import Svg, { Path } from "react-native-svg";

export const FontDecrementIcon = ({
  color = "#09244B",
}: {
  color?: string;
}) => (
  <Svg width={16} height={10} viewBox="0 0 15 10" fill="none">
    <Path
      d="M0 9.953v-.861l.738-.103L4.218 0h1.155l3.418 8.99.731.102v.861H6.665v-.861l.752-.13-.656-1.832H2.775L2.1 8.962l.752.13v.861H0zm3.192-3.951h3.159L4.888 1.955l-.082-.226h-.041l-.082.226-1.49 4.047zm7.868.273V5.223h3.343v1.052H11.06z"
      fill={color}
    />
  </Svg>
);
