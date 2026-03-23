import Svg, { Path } from "react-native-svg";

export const CashIcon = ({
  color = "#1C274C",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 30 30" fill="none">
    <Path
      d="M23.333 13.75c2.356-.348 4.167-2.443 4.167-4.975C27.5 6 25.324 3.75 22.639 3.75H7.36C4.676 3.75 2.5 6 2.5 8.775c0 2.532 1.81 4.627 4.167 4.975"
      stroke={color}
      strokeWidth={1.92}
    />
    <Path
      d="M15 7.5v8.75m0 0l2.5-2.917M15 16.25l-2.5-2.917"
      stroke={color}
      strokeWidth={1.92}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6.25 12.5c0-2.357 0-3.536.732-4.268C7.714 7.5 8.893 7.5 11.25 7.5h7.5c2.357 0 3.535 0 4.268.732.732.732.732 1.911.732 4.268V20c0 2.357 0 3.535-.732 4.268-.733.732-1.911.732-4.268.732h-7.5c-2.357 0-3.536 0-4.268-.732-.732-.733-.732-1.911-.732-4.268v-7.5z"
      stroke={color}
      strokeWidth={1.92}
    />
    <Path
      d="M6.25 21.25h17.5"
      stroke={color}
      strokeWidth={1.92}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
