import Svg, { Path } from "react-native-svg";

export const WithdrawlHisotoryIcon = ({
  color = "#1C274C",
  size = 16,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M17.44 10c0 3.507 0 5.261-1.09 6.35-1.089 1.09-2.843 1.09-6.35 1.09-3.507 0-5.261 0-6.35-1.09-1.09-1.089-1.09-2.843-1.09-6.35 0-3.507 0-5.261 1.09-6.35C4.738 2.56 6.492 2.56 10 2.56"
      stroke={color}
      strokeWidth={1.12}
      strokeLinecap="round"
    />
    <Path
      d="M13.091 3.627l1.754 1.52c1.208 1.046 1.811 1.57 1.811 2.249 0 .68-.603 1.202-1.81 2.249l-1.755 1.52c-.53.46-.796.69-1.013.59-.218-.099-.218-.45-.218-1.152V9.468c-2.232 0-4.65 1.037-5.58 2.764 0-5.527 3.307-6.909 5.58-6.909V4.189c0-.703 0-1.054.218-1.153.217-.1.482.13 1.013.59z"
      stroke={color}
      strokeWidth={1.12}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
