import Svg, { Path } from "react-native-svg";

export const OptionsIcon = ({
  color = "#030937",
  size = 20,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.126 6A4.002 4.002 0 0117 7a4 4 0 01-7.874 1H2V6h7.126zm-5 10A4.002 4.002 0 0112 17a4 4 0 01-7.874 1H2v-2h2.126zM14 18v-2h8v2h-8zm-6 1a2 2 0 100-4 2 2 0 000 4zM19 8V6h3v2h-3zm-6 1a2 2 0 100-4 2 2 0 000 4z"
      fill={color}
      stroke={color}
      strokeWidth={0.00064}
    />
  </Svg>
);
