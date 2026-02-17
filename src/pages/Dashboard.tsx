import { Home, TrendingUp, Users, DollarSign } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Payment {
  id: string;
  tenant_name: string;
  unit: string;
  amount: number;
  status: string;
  payment_date: string;
}

function Dashboard() {
  const [totalUnits, setTotalUnits] = useState(0);
  const [totalTenants, setTotalTenants] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [occupancyRate, setOccupancyRate] = useState(0);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);

  // ─── Auth guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        window.location.href = '/login';
      }
    };
    checkUser();
  }, []);

  // ─── Load dashboard data ─────────────────────────────────────────────────────
  useEffect(() => {
    const loadDashboard = async () => {
      // Units
      const { data: unitsData } = await supabase.from('units').select('*');
      const units = unitsData || [];
      const occupied = units.filter(u => u.status === 'Occupied');
      setTotalUnits(units.length);
      setOccupancyRate(units.length > 0 ? Math.round((occupied.length / units.length) * 100) : 0);
      setMonthlyRevenue(occupied.reduce((sum, u) => sum + (u.monthly_rent || 0), 0));

      // Tenants
      const { data: tenantsData } = await supabase.from('tenants').select('id');
      setTotalTenants((tenantsData || []).length);

      // Recent payments
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('*')
        .order('payment_date', { ascending: false })
        .limit(5);
      setRecentPayments(paymentsData || []);
    };

    loadDashboard();
  }, []);

  const stats = [
    { label: 'Total Units', value: totalUnits.toString(), icon: Home, change: '', color: 'blue' },
    { label: 'Total Tenants', value: totalTenants.toString(), icon: Users, change: '', color: 'green' },
    { label: 'Monthly Revenue', value: `KES ${monthlyRevenue.toLocaleString()}`, icon: DollarSign, change: '', color: 'purple' },
    { label: 'Occupancy Rate', value: `${occupancyRate}%`, icon: TrendingUp, change: '', color: 'orange' },
  ];

  const colorMap = {
    blue:   'bg-blue-500 dark:bg-blue-600',
    green:  'bg-green-500 dark:bg-green-600',
    purple: 'bg-purple-500 dark:bg-purple-600',
    orange: 'bg-orange-500 dark:bg-orange-600',
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${colorMap[stat.color as keyof typeof colorMap]} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Payments */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Payments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tenant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Unit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentPayments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    No payments recorded yet.
                  </td>
                </tr>
              ) : (
                recentPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {payment.tenant_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {payment.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-semibold">
                      KES {(payment.amount || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {payment.payment_date
                        ? new Date(payment.payment_date).toLocaleDateString('en-KE')
                        : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          payment.status === 'Paid'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;