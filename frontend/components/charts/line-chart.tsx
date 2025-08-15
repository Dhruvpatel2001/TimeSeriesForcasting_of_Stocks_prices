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
import type { ScaleType} from 'recharts/types/util/types';

// Dynamically extract exact types from components to prevent any mismatch
type CurveType = React.ComponentProps<typeof Line>['type'];

interface LineChartProps {
  data: any[];
  lines: {
    dataKey: string;
    name: string;
    color: string;
  }[];
  xAxisDataKey: string;
}

interface CustomXAxisProps {
  dataKey: string;
  scale?: ScaleType;
  padding?: { left: number; right: number };
  allowDecimals?: boolean;
  allowDataOverflow?: boolean;
  allowDuplicatedCategory?: boolean;
  hide?: boolean;
  mirror?: boolean;
  orientation?: "top" | "bottom";
  reversed?: boolean;
  tickCount?: number;
  [key: string]: any; // allow passthrough
}

const CustomXAxis = ({
  dataKey,
  scale = "point" as ScaleType,
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
}: CustomXAxisProps) => (
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

interface CustomYAxisProps {
  width?: number;
  padding?: { top: number; bottom: number };
  allowDecimals?: boolean;
  allowDataOverflow?: boolean;
  hide?: boolean;
  mirror?: boolean;
  orientation?: "left" | "right";
  reversed?: boolean;
  tickCount?: number;
  [key: string]: any;
}

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
}: CustomYAxisProps) => (
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

interface CustomLineProps {
  dataKey: string;
  name?: string;
  stroke: string;
  type?: "monotone" | "linear" | "step" | "stepBefore" | "stepAfter" | "basis" | "basisOpen" | "basisClosed" | "bundle" | "cardinal" | "cardinalOpen" | "cardinalClosed" | "catmullRom" | "catmullRomOpen" | "catmullRomClosed" | "natural";
  activeDot?: object;
  connectNulls?: boolean;
  dot?: boolean;
  isAnimationActive?: boolean;
  animationBegin?: number;
  animationDuration?: number;
  animationEasing?: "ease" | "ease-in" | "ease-out" | "ease-in-out" | "linear";
  [key: string]: any;
}

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
}: CustomLineProps) => (
  <Line
    dataKey={dataKey}
    name={name}
    stroke={stroke}
    type={type as CurveType}
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
  console.log('LineChart render:', { data, lines, xAxisDataKey });
  console.log('Data length:', data?.length);
  console.log('Data sample:', data?.slice(0, 2));
  
  if (!data || data.length === 0) {
    console.log('LineChart: No data provided');
    return <div>No chart data available</div>;
  }
  
  return (
    <div style={{ width: '100%', height: '100%', border: '1px solid blue' }}>
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
    </div>
  );
}


