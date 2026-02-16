import { Home, TrendingUp, Users, DollarSign } from 'lucide-react';

function Dashboard() {
  const stats = [
    { label: 'Total Properties', value: '24', icon: Home, change: '+2', color: 'blue' },
    { label: 'Total Tenants', value: '89', icon: Users, change: '+5', color: 'green' },
    { label: 'Monthly Revenue', value: '$45,230', icon: DollarSign, change: '+12%', color: 'purple' },
    { label: 'Occupancy Rate', value: '94%', icon: TrendingUp, change: '+3%', color: 'orange' },
  ];

  const recentPayments = [
    { tenant: 'John Smith', property: 'Apt 101', amount: '$1,200', status: 'Paid', date: '2024-02-15' },
    { tenant: 'Sarah Johnson', property: 'Apt 205', amount: '$1,500', status: 'Paid', date: '2024-02-14' },
    { tenant: 'Mike Wilson', property: 'House 12', amount: '$2,200', status: 'Pending', date: '2024-02-16' },
    { tenant: 'Emily Brown', property: 'Apt 304', amount: '$1,350', status: 'Paid', date: '2024-02-13' },
  ];

  const colorMap = {
    blue: 'bg-blue-500 dark:bg-blue-600',
    green: 'bg-green-500 dark:bg-green-600',
    purple: 'bg-purple-500 dark:bg-purple-600',
    orange: 'bg-orange-500 dark:bg-orange-600',
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Dashboard</h1>

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
                <span className="text-sm font-medium text-green-600 dark:text-green-400">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Payments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tenant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentPayments.map((payment, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {payment.tenant}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {payment.property}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-semibold">
                    {payment.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {payment.date}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;