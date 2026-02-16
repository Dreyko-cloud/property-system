import { Eye, RefreshCw } from 'lucide-react';
import { ReminderForm } from '../components/ReminderForm';

function Reminders() {
  const reminderHistory = [
    {
      date: '2024-02-15',
      recipients: 'All Tenants (89)',
      type: 'Due Today',
      status: 'Sent',
      opened: 67,
    },
    {
      date: '2024-02-10',
      recipients: 'Overdue Tenants (12)',
      type: 'Overdue Payment',
      status: 'Sent',
      opened: 10,
    },
    {
      date: '2024-02-05',
      recipients: 'All Tenants (89)',
      type: 'Upcoming Payment',
      status: 'Sent',
      opened: 78,
    },
    {
      date: '2024-01-31',
      recipients: 'Specific Tenants (5)',
      type: 'Due Today',
      status: 'Sent',
      opened: 5,
    },
    {
      date: '2024-01-25',
      recipients: 'Overdue Tenants (8)',
      type: 'Overdue Payment',
      status: 'Sent',
      opened: 7,
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Reminders</h1>

      <div className="mb-8">
        <ReminderForm />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Reminder History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Recipients
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Opened
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {reminderHistory.map((reminder, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {reminder.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {reminder.recipients}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {reminder.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                      {reminder.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {reminder.opened} opened
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-all duration-200">
                        <Eye size={18} />
                      </button>
                      <button className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all duration-200">
                        <RefreshCw size={18} />
                      </button>
                    </div>
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
export default Reminders;