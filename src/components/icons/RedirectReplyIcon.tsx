import Svg, { Path } from "react-native-svg";

export const RedirectReplyIcon = ({
  color = "#1C274C",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21.775 15.62c.3-.3.3-.787 0-1.087L15.62 8.379a.77.77 0 10-1.088 1.088l4.84 4.84H8.924a5.385 5.385 0 01-5.385-5.384V2.77A.77.77 0 002 2.77v6.154c0 3.824 3.1 6.923 6.923 6.923h10.45l-4.84 4.84a.77.77 0 001.088 1.089l6.154-6.154z"
      fill={color}
      stroke={color}
      strokeWidth={0.00064}
    />
  </Svg>
);
