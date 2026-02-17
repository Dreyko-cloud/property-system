import { DollarSign, TrendingUp, AlertCircle, FileDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ChartCard, SimpleBarChart, SimpleLineChart, DonutChart } from '../components/ChartCard';

interface MonthlyData {
  label: string;
  value: number;
}

function Reports() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [expectedRevenue, setExpectedRevenue] = useState(0);
  const [collectionRate, setCollectionRate] = useState(0);
  const [outstandingBalance, setOutstandingBalance] = useState(0);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [occupancyData, setOccupancyData] = useState([
    { label: 'Occupied', value: 0, color: '#10b981' },
    { label: 'Vacant', value: 0, color: '#ef4444' },
    { label: 'Maintenance', value: 0, color: '#f59e0b' },
  ]);

  useEffect(() => {
    const loadReports = async () => {
      // Payments data
      const { data: payments } = await supabase.from('payments').select('*');
      const allPayments = payments || [];

      const paid = allPayments.filter(p => p.status === 'Paid');
      const pending = allPayments.filter(p => p.status === 'Pending');

      const revenue = paid.reduce((sum, p) => sum + (p.amount || 0), 0);
      const outstanding = pending.reduce((sum, p) => sum + (p.amount || 0), 0);
      const expected = revenue + outstanding;

      setTotalRevenue(revenue);
      setOutstandingBalance(outstanding);
      setExpectedRevenue(expected);
      setCollectionRate(expected > 0 ? Math.round((revenue / expected) * 100 * 10) / 10 : 0);

      // Monthly breakdown (last 6 months)
      const months: MonthlyData[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const label = d.toLocaleString('default', { month: 'short' });
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        const monthStr = `${year}-${String(month).padStart(2, '0')}`;

        const total = paid
          .filter(p => p.payment_date?.startsWith(monthStr))
          .reduce((sum, p) => sum + (p.amount || 0), 0);

        months.push({ label, value: total });
      }
      setMonthlyData(months);

      // Units for occupancy
      const { data: units } = await supabase.from('units').select('status');
      const allUnits = units || [];
      const occupied = allUnits.filter(u => u.status === 'Occupied').length;
      const vacant = allUnits.filter(u => u.status === 'Vacant').length;
      const maintenance = allUnits.filter(u => u.status === 'Maintenance').length;

      setOccupancyData([
        { label: 'Occupied', value: occupied, color: '#10b981' },
        { label: 'Vacant', value: vacant, color: '#ef4444' },
        { label: 'Maintenance', value: maintenance, color: '#f59e0b' },
      ]);
    };

    loadReports();
  }, []);

  const summaryCards = [
    {
      label: 'Total Revenue',
      value: `KES ${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500 dark:bg-green-600',
    },
    {
      label: 'Expected Revenue',
      value: `KES ${expectedRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-blue-500 dark:bg-blue-600',
    },
    {
      label: 'Collection Rate',
      value: `${collectionRate}%`,
      icon: TrendingUp,
      color: 'bg-purple-500 dark:bg-purple-600',
    },
    {
      label: 'Outstanding Balance',
      value: `KES ${outstandingBalance.toLocaleString()}`,
      icon: AlertCircle,
      color: 'bg-orange-500 dark:bg-orange-600',
    },
  ];

  const comparisonData = [
    { label: 'Expected', value: expectedRevenue, color: 'bg-blue-500 dark:bg-blue-600' },
    { label: 'Collected', value: totalRevenue, color: 'bg-green-500 dark:bg-green-600' },
  ];

  const totalUnitsCount = occupancyData.reduce((sum, d) => sum + d.value, 0);
  const occupancyRate = totalUnitsCount > 0
    ? Math.round((occupancyData[0].value / totalUnitsCount) * 100)
    : 0;

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
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{card.value}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Monthly Revenue Trend">
          <SimpleLineChart data={monthlyData} height={250} />
        </ChartCard>

        <ChartCard title="Expected vs Collected (KES)">
          <SimpleBarChart data={comparisonData} height={250} />
        </ChartCard>
      </div>

      <ChartCard title="Occupancy Rate" className="mb-6">
        <DonutChart data={occupancyData} centerText={`${occupancyRate}%`} />
      </ChartCard>
    </div>
  );
}

export default Reports;