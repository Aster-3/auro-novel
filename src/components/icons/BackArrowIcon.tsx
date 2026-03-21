import Svg, { Path } from "react-native-svg";

export const BackArrowIcon = ({
  color = "#0b1457",
  size = 24,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size * 1.286} viewBox="0 0 24 24" fill="none">
    <Path
      d="M13 9a1 1 0 01-1-1V5.061a1 1 0 00-1.811-.75l-6.835 6.836a1.208 1.208 0 000 1.707l6.835 6.835a1 1 0 001.811-.75V16a1 1 0 011-1h2a1 1 0 001-1v-4a1 1 0 00-1-1h-2zM20 9v6"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
