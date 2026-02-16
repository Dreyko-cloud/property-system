interface Activity {
  id: number;
  tenant: string;
  unit: string;
  action: string;
  amount?: string;
  date: string;
  status: 'completed' | 'pending' | 'overdue';
}

const mockActivities: Activity[] = [
  {
    id: 1,
    tenant: 'Sarah Johnson',
    unit: 'Unit A-101',
    action: 'Rent Payment',
    amount: 'KES 45,000',
    date: '2024-02-14',
    status: 'completed',
  },
  {
    id: 2,
    tenant: 'Michael Chen',
    unit: 'Unit B-205',
    action: 'Rent Payment',
    amount: 'KES 38,500',
    date: '2024-02-13',
    status: 'completed',
  },
  {
    id: 3,
    tenant: 'Emily Davis',
    unit: 'Unit C-301',
    action: 'Maintenance Request',
    date: '2024-02-12',
    status: 'pending',
  },
  {
    id: 4,
    tenant: 'James Wilson',
    unit: 'Unit A-103',
    action: 'Rent Payment',
    amount: 'KES 45,000',
    date: '2024-02-10',
    status: 'overdue',
  },
  {
    id: 5,
    tenant: 'Lisa Anderson',
    unit: 'Unit B-207',
    action: 'Lease Renewal',
    date: '2024-02-09',
    status: 'completed',
  },
];

const statusStyles = {
  completed: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
  pending: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400',
  overdue: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400',
};

export default function ActivityTable() {
  return (
    <div className="bg-white dark:bg-primary-light rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-primary dark:text-white">Recent Activity</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-primary">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Tenant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Unit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {mockActivities.map((activity) => (
              <tr key={activity.id} className="hover:bg-gray-50 dark:hover:bg-primary transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-primary dark:text-white">
                    {activity.tenant}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600 dark:text-gray-400">{activity.unit}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600 dark:text-gray-400">{activity.action}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-primary dark:text-white">
                    {activity.amount || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600 dark:text-gray-400">{activity.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs font-medium rounded-full ${
                      statusStyles[activity.status]
                    }`}
                  >
                    {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
