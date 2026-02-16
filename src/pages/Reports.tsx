import { DollarSign, TrendingUp, AlertCircle, FileDown } from 'lucide-react';
import { ChartCard, SimpleBarChart, SimpleLineChart, DonutChart } from '../components/ChartCard';

function Reports() {
  const summaryCards = [
    {
      label: 'Total Revenue',
      value: '$128,450',
      change: '+12.5%',
      icon: DollarSign,
      color: 'bg-green-500 dark:bg-green-600',
    },
    {
      label: 'Expected Revenue',
      value: '$135,000',
      change: '+8.2%',
      icon: TrendingUp,
      color: 'bg-blue-500 dark:bg-blue-600',
    },
    {
      label: 'Collection Rate',
      value: '95.1%',
      change: '+2.3%',
      icon: TrendingUp,
      color: 'bg-purple-500 dark:bg-purple-600',
    },
    {
      label: 'Outstanding Balance',
      value: '$6,550',
      change: '-15.4%',
      icon: AlertCircle,
      color: 'bg-orange-500 dark:bg-orange-600',
    },
  ];

  const monthlyRevenueData = [
    { label: 'Jan', value: 98000 },
    { label: 'Feb', value: 105000 },
    { label: 'Mar', value: 112000 },
    { label: 'Apr', value: 108000 },
    { label: 'May', value: 118000 },
    { label: 'Jun', value: 128450 },
  ];

  const comparisonData = [
    { label: 'Expected', value: 135000, color: 'bg-blue-500 dark:bg-blue-600' },
    { label: 'Collected', value: 128450, color: 'bg-green-500 dark:bg-green-600' },
  ];

  const occupancyData = [
    { label: 'Occupied', value: 85, color: '#10b981' },
    { label: 'Vacant', value: 9, color: '#ef4444' },
    { label: 'Maintenance', value: 6, color: '#f59e0b' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200">
            <FileDown size={18} />
            Export PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition-all duration-200">
            <FileDown size={18} />
            Export Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
                <span
                  className={`text-sm font-medium ${
                    card.change.startsWith('+')
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {card.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{card.value}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Monthly Revenue Trend">
          <SimpleLineChart data={monthlyRevenueData} height={250} />
        </ChartCard>

        <ChartCard title="Expected vs Collected">
          <SimpleBarChart data={comparisonData} height={250} />
        </ChartCard>
      </div>

      <ChartCard title="Occupancy Rate" className="mb-6">
        <DonutChart data={occupancyData} centerText="94%" />
      </ChartCard>
    </div>
  );
}
export default Reports;