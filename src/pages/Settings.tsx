import { useState } from 'react';
import { SettingsSection } from '../components/SettingsSection';
import { Check } from 'lucide-react';

function Settings() {
  const [profile, setProfile] = useState({
    name: 'John Manager',
    email: 'john@propertyhub.com',
    phone: '+1 (555) 123-4567',
  });

  const [preferences, setPreferences] = useState({
    preferredMethod: 'both',
    emailNotifications: true,
    smsNotifications: true,
    paymentReminders: true,
    maintenanceAlerts: true,
  });

  const [payment, setPayment] = useState({
    instructions: 'Please make payments via bank transfer to:\n\nBank: Example Bank\nAccount Name: PropertyHub LLC\nAccount Number: 1234567890\nRouting Number: 987654321\n\nOr use the online payment portal at: https://payments.propertyhub.com',
    defaultDueDay: '1',
  });

  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const getPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return { strength: 0, label: '' };
    if (pwd.length < 6) return { strength: 25, label: 'Weak', color: 'bg-red-500' };
    if (pwd.length < 10) return { strength: 50, label: 'Fair', color: 'bg-orange-500' };
    if (pwd.length < 14) return { strength: 75, label: 'Good', color: 'bg-yellow-500' };
    return { strength: 100, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(password.new);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>

      <div className="space-y-6">
        <SettingsSection title="Profile" description="Manage your personal information">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-all"
              />
            </div>
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition-all duration-200">
              Save Changes
            </button>
          </div>
        </SettingsSection>

        <SettingsSection
          title="Communication Preferences"
          description="Choose how you want to receive notifications"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preferred Method
              </label>
              <select
                value={preferences.preferredMethod}
                onChange={(e) => setPreferences({ ...preferences, preferredMethod: e.target.value })}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-all"
              >
                <option value="email">Email Only</option>
                <option value="sms">SMS Only</option>
                <option value="both">Both Email and SMS</option>
              </select>
            </div>

            <div className="space-y-3 pt-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Notification Toggles</p>

              <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all">
                <span className="text-sm text-gray-700 dark:text-gray-300">Email Notifications</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={preferences.emailNotifications}
                    onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 rounded-full peer peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500 transition-all">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </div>
                </div>
              </label>

              <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all">
                <span className="text-sm text-gray-700 dark:text-gray-300">SMS Notifications</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={preferences.smsNotifications}
                    onChange={(e) => setPreferences({ ...preferences, smsNotifications: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 rounded-full peer peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500 transition-all">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </div>
                </div>
              </label>

              <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all">
                <span className="text-sm text-gray-700 dark:text-gray-300">Payment Reminders</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={preferences.paymentReminders}
                    onChange={(e) => setPreferences({ ...preferences, paymentReminders: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 rounded-full peer peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500 transition-all">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </div>
                </div>
              </label>

              <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all">
                <span className="text-sm text-gray-700 dark:text-gray-300">Maintenance Alerts</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={preferences.maintenanceAlerts}
                    onChange={(e) => setPreferences({ ...preferences, maintenanceAlerts: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 rounded-full peer peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500 transition-all">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                  </div>
                </div>
              </label>
            </div>

            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition-all duration-200">
              Save Preferences
            </button>
          </div>
        </SettingsSection>

        <SettingsSection title="Payment Settings" description="Configure payment information for your tenants">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Instructions
              </label>
              <textarea
                value={payment.instructions}
                onChange={(e) => setPayment({ ...payment, instructions: e.target.value })}
                rows={8}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-all resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Due Day (Day of Month)
              </label>
              <select
                value={payment.defaultDueDay}
                onChange={(e) => setPayment({ ...payment, defaultDueDay: e.target.value })}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-all"
              >
                {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition-all duration-200">
              Save Payment Settings
            </button>
          </div>
        </SettingsSection>

        <SettingsSection title="Security" description="Update your password and security settings">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={password.current}
                onChange={(e) => setPassword({ ...password, current: e.target.value })}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
              <input
                type="password"
                value={password.new}
                onChange={(e) => setPassword({ ...password, new: e.target.value })}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-all"
              />
              {password.new && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Password Strength</span>
                    <span className="text-xs font-medium text-gray-900 dark:text-white">{passwordStrength.label}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={password.confirm}
                onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-all"
              />
              {password.confirm && password.new === password.confirm && (
                <div className="flex items-center gap-2 mt-2 text-green-600 dark:text-green-400">
                  <Check size={16} />
                  <span className="text-sm">Passwords match</span>
                </div>
              )}
            </div>
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg transition-all duration-200">
              Change Password
            </button>
          </div>
        </SettingsSection>
      </div>
    </div>
  );
}
export default Settings;