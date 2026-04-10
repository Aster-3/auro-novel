import Svg, { Path } from "react-native-svg";

export const NotRecommendIcon = ({
  color = "#FFFFFF",
  size = 14,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none">
    <Path
      d="M5.5 19.427l.594-2.573c.135-.604-.104-1.448-.542-1.885l-2.583-2.584c-1.521-1.52-1.032-3.062 1.093-3.416l3.323-.552c.552-.094 1.22-.584 1.47-1.094l1.832-3.667c.99-1.99 2.615-1.99 3.615 0l1.833 3.667c.115.24.334.469.573.667M20.938 8.969c2.125.354 2.625 1.896 1.093 3.416l-2.583 2.584c-.438.437-.677 1.281-.542 1.885l.74 3.198c.583 2.531-.76 3.51-3 2.188l-3.115-1.844c-.562-.334-1.49-.334-2.062 0L8.354 22.24M22.917 2.083L2.083 22.917"
      stroke={color}
      strokeWidth={1.856}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
