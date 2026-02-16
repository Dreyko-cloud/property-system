import { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function ChartCard({ title, children, className = '' }: ChartCardProps) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 ${className}`}
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

interface SimpleBarChartProps {
  data: { label: string; value: number; color?: string }[];
  height?: number;
}

export function SimpleBarChart({ data, height = 200 }: SimpleBarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              ${item.value.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                item.color || 'bg-blue-500 dark:bg-blue-600'
              }`}
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

interface SimpleLineChartProps {
  data: { label: string; value: number }[];
  height?: number;
}

export function SimpleLineChart({ data, height = 200 }: SimpleLineChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue;

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((item.value - minValue) / range) * 100;
    return `${x},${y}`;
  });

  return (
    <div className="space-y-4">
      <div className="relative" style={{ height: `${height}px` }}>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
          style={{ overflow: 'visible' }}
        >
          <polyline
            points={points.join(' ')}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-blue-500 dark:text-blue-400"
            vectorEffect="non-scaling-stroke"
          />
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - ((item.value - minValue) / range) * 100;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="0.8"
                fill="currentColor"
                className="text-blue-600 dark:text-blue-500"
              />
            );
          })}
        </svg>
      </div>
      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
        {data.map((item, index) => (
          <span key={index}>{item.label}</span>
        ))}
      </div>
    </div>
  );
}

interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  centerText?: string;
}

export function DonutChart({ data, centerText }: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -90;

  const segments = data.map((item) => {
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (currentAngle * Math.PI) / 180;

    const x1 = 50 + 40 * Math.cos(startRad);
    const y1 = 50 + 40 * Math.sin(startRad);
    const x2 = 50 + 40 * Math.cos(endRad);
    const y2 = 50 + 40 * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    return {
      path: `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`,
      color: item.color,
      label: item.label,
      value: item.value,
      percentage: ((item.value / total) * 100).toFixed(0),
    };
  });

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {segments.map((segment, index) => (
            <path key={index} d={segment.path} fill={segment.color} className="transition-opacity hover:opacity-80" />
          ))}
          <circle cx="50" cy="50" r="25" fill="currentColor" className="text-white dark:text-gray-800" />
        </svg>
        {centerText && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{centerText}</span>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 w-full">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }} />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {segment.label} ({segment.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
