import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export default function StatCard({ title, value, icon: Icon, trend }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-primary-light rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{title}</p>
          <p className="text-2xl font-bold text-primary dark:text-white">{value}</p>
          {trend && (
            <p
              className={`text-sm mt-2 ${
                trend.isPositive
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        <div className="bg-gold/10 dark:bg-gold/20 p-3 rounded-lg">
          <Icon className="w-6 h-6 text-gold" />
        </div>
      </div>
    </div>
  );
}
