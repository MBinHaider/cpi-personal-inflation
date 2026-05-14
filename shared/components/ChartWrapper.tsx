import { ResponsiveContainer } from 'recharts';

interface ChartWrapperProps {
  children: React.ReactElement;
  height?: number;
  className?: string;
}

export function ChartWrapper({ children, height = 300, className }: ChartWrapperProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}
