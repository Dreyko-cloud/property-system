import { useState } from 'react';
import { Send, Eye } from 'lucide-react';

export function ReminderForm() {
  const [formData, setFormData] = useState({
    recipients: 'all',
    reminderType: 'due-today',
    message: 'Dear Tenant,\n\nThis is a friendly reminder that your rent payment is due today. Please ensure payment is made by the end of the day to avoid any late fees.\n\nThank you for your prompt attention to this matter.',
    includePaymentLink: true,
  });

  const recipientOptions = [
    { value: 'all', label: 'All Tenants' },
    { value: 'overdue', label: 'Overdue Tenants Only' },
    { value: 'specific', label: 'Specific Tenants' },
  ];

  const reminderTypes = [
    { value: 'upcoming', label: 'Upcoming Payment' },
    { value: 'due-today', label: 'Due Today' },
    { value: 'overdue', label: 'Overdue Payment' },
  ];

  const handleSubmit = (e: React.FormEvent, action: 'preview' | 'send') => {
    e.preventDefault();
    if (action === 'preview') {
      alert('Preview functionality - Message preview would be displayed here');
    } else {
      alert('Send functionality - Reminder would be sent to selected recipients');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Send Reminder</h2>

      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Recipients
          </label>
          <select
            value={formData.recipients}
            onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
            className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-all"
          >
            {recipientOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Reminder Type
          </label>
          <select
            value={formData.reminderType}
            onChange={(e) => setFormData({ ...formData, reminderType: e.target.value })}
            className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-all"
          >
            {reminderTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Message Preview
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={8}
            className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-all resize-none"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="includePaymentLink"
            checked={formData.includePaymentLink}
            onChange={(e) => setFormData({ ...formData, includePaymentLink: e.target.checked })}
            className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 transition-all"
          />
          <label htmlFor="includePaymentLink" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Include Payment Link
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'preview')}
            className="flex items-center gap-2 px-6 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
          >
            <Eye size={18} />
            Preview
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'send')}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition-all duration-200"
          >
            <Send size={18} />
            Send Reminder
          </button>
        </div>
      </form>
    </div>
  );
}
