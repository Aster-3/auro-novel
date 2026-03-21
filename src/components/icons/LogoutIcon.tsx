import Svg, { Path } from "react-native-svg";

export const LogoutIcon = ({
  color = "#BB0303",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M17.5 14H2.333m0 0l4.084-3.5M2.333 14l4.084 3.5"
      stroke={color}
      strokeWidth={1.92}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10.502 8.167c.014-2.538.127-3.912 1.023-4.809C12.55 2.333 14.2 2.333 17.5 2.333h1.167c3.3 0 4.95 0 5.975 1.025 1.025 1.026 1.025 2.675 1.025 5.975v9.334c0 3.3 0 4.95-1.025 5.974-.897.897-2.271 1.01-4.809 1.024m-9.33-5.832c.013 2.538.126 3.912 1.022 4.809.748.748 1.83.95 3.642 1.005"
      stroke={color}
      strokeWidth={1.92}
      strokeLinecap="round"
    />
  </Svg>
);
