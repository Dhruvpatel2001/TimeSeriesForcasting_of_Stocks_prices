'use client';

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface LineChartProps {
  data: any[];
  lines: {
    dataKey: string;
    name: string;
    color: string;
  }[];
  xAxisDataKey: string;
}

// Custom components with default parameters instead of defaultProps
const CustomXAxis = ({
  dataKey,
  scale = "point",
  padding = { left: 10, right: 10 },
  allowDecimals = true,
  allowDataOverflow = false,
  allowDuplicatedCategory = true,
  hide = false,
  mirror = false,
  orientation = "bottom",
  reversed = false,
  tickCount = 5,
  ...props
}) => (
  <XAxis
    dataKey={dataKey}
    scale={scale}
    padding={padding}
    allowDecimals={allowDecimals}
    allowDataOverflow={allowDataOverflow}
    allowDuplicatedCategory={allowDuplicatedCategory}
    hide={hide}
    mirror={mirror}
    orientation={orientation}
    reversed={reversed}
    tickCount={tickCount}
    {...props}
  />
);

const CustomYAxis = ({
  width = 60,
  padding = { top: 20, bottom: 20 },
  allowDecimals = true,
  allowDataOverflow = false,
  hide = false,
  mirror = false,
  orientation = "left",
  reversed = false,
  tickCount = 5,
  ...props
}) => (
  <YAxis
    width={width}
    padding={padding}
    allowDecimals={allowDecimals}
    allowDataOverflow={allowDataOverflow}
    hide={hide}
    mirror={mirror}
    orientation={orientation}
    reversed={reversed}
    tickCount={tickCount}
    {...props}
  />
);

const CustomLine = ({
  dataKey,
  name,
  stroke,
  type = "monotone",
  activeDot = { r: 8 },
  connectNulls = false,
  dot = true,
  isAnimationActive = true,
  animationBegin = 0,
  animationDuration = 1500,
  animationEasing = "ease",
  ...props
}) => (
  <Line
    dataKey={dataKey}
    name={name}
    stroke={stroke}
    type={type}
    activeDot={activeDot}
    connectNulls={connectNulls}
    dot={dot}
    isAnimationActive={isAnimationActive}
    animationBegin={animationBegin}
    animationDuration={animationDuration}
    animationEasing={animationEasing}
    {...props}
  />
);

export function LineChart({ data, lines, xAxisDataKey }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <CustomXAxis dataKey={xAxisDataKey} />
        <CustomYAxis />
        <Tooltip />
        <Legend />
        {lines.map((line) => (
          <CustomLine
            key={line.dataKey}
            dataKey={line.dataKey}
            name={line.name}
            stroke={line.color}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}