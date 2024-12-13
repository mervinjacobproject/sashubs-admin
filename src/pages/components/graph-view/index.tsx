import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface LineChartComponentProps {
  chartData: any[];  // The data for the chart
  lineColor: string; // The color of the line
  height: number;    // The height of the chart
}

const LineChartComponent: React.FC<LineChartComponentProps> = ({ chartData, lineColor, height }) => {
  return (
    <ResponsiveContainer width={100} height={height}>
      <LineChart data={chartData}>
        <Line type="monotone" dataKey="value" stroke={lineColor} strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;
