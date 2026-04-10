import Svg, { Path } from "react-native-svg";

export const WithdrawlIcon = ({
  color = "#1C274C",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M15.556 9.167c1.57-.233 2.777-1.629 2.777-3.317 0-1.85-1.45-3.35-3.24-3.35H4.907c-1.79 0-3.24 1.5-3.24 3.35 0 1.688 1.207 3.084 2.777 3.317"
      stroke={color}
      strokeWidth={1.12}
    />
    <Path
      d="M10 5v5.833m0 0l1.667-1.944M10 10.833L8.333 8.89"
      stroke={color}
      strokeWidth={1.12}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4.167 8.333c0-1.571 0-2.357.488-2.845S5.929 5 7.5 5h5c1.571 0 2.357 0 2.845.488s.488 1.274.488 2.845v5c0 1.572 0 2.357-.488 2.845-.488.489-1.274.489-2.845.489h-5c-1.571 0-2.357 0-2.845-.489-.488-.488-.488-1.273-.488-2.845v-5z"
      stroke={color}
      strokeWidth={1.12}
    />
    <Path
      d="M4.167 14.167h11.666"
      stroke={color}
      strokeWidth={1.12}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
