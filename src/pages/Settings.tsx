import { useState, useEffect } from 'react';
import { SettingsSection } from '../components/SettingsSection';
import { Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

function Settings() {
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [preferences, setPreferences] = useState({
    preferredMethod: 'both',
    emailNotifications: true,
    smsNotifications: true,
    paymentReminders: true,
    maintenanceAlerts: true,
  });
  const [prefSaving, setPrefSaving] = useState(false);
  const [prefMsg, setPrefMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [payment, setPayment] = useState({
    instructions: '',
    defaultDueDay: '1',
  });
  const [paymentSaving, setPaymentSaving] = useState(false);
  const [paymentMsg, setPaymentMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [password, setPassword] = useState({ current: '', new: '', confirm: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // ─── Load current user settings ──────────────────────────────────────────────
  useEffect(() => {
    const loadSettings = async () => {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      if (!user) return;

      setProfile({
        name: user.user_metadata?.full_name || '',
        email: user.email || '',
        phone: user.user_metadata?.phone || '',
      });

      // Load settings from a settings table (if you have one)
      const { data: settingsData } = await supabase
        .from('settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (settingsData) {
        if (settingsData.preferences) setPreferences(settingsData.preferences);
        if (settingsData.payment_instructions) {
          setPayment(prev => ({ ...prev, instructions: settingsData.payment_instructions }));
        }
        if (settingsData.default_due_day) {
          setPayment(prev => ({ ...prev, defaultDueDay: String(settingsData.default_due_day) }));
        }
      }
    };

    loadSettings();
  }, []);

  // ─── Save profile ─────────────────────────────────────────────────────────────
  const saveProfile = async () => {
    setProfileSaving(true);
    setProfileMsg(null);

    const { error } = await supabase.auth.updateUser({
      data: { full_name: profile.name, phone: profile.phone },
    });

    setProfileSaving(false);
    setProfileMsg(error
      ? { type: 'error', text: error.message }
      : { type: 'success', text: 'Profile updated successfully.' }
    );
  };

  // ─── Save preferences ─────────────────────────────────────────────────────────
  const savePreferences = async () => {
    setPrefSaving(true);
    setPrefMsg(null);

    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id;
    if (!userId) return;

    const { error } = await supabase.from('settings').upsert({
      user_id: userId,
      preferences,
    }, { onConflict: 'user_id' });

    setPrefSaving(false);
    setPrefMsg(error
      ? { type: 'error', text: error.message }
      : { type: 'success', text: 'Preferences saved.' }
    );
  };

  // ─── Save payment settings ────────────────────────────────────────────────────
  const savePaymentSettings = async () => {
    setPaymentSaving(true);
    setPaymentMsg(null);

    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id;
    if (!userId) return;

    const { error } = await supabase.from('settings').upsert({
      user_id: userId,
      payment_instructions: payment.instructions,
      default_due_day: Number(payment.defaultDueDay),
    }, { onConflict: 'user_id' });

    setPaymentSaving(false);
    setPaymentMsg(error
      ? { type: 'error', text: error.message }
      : { type: 'success', text: 'Payment settings saved.' }
    );
  };

  // ─── Change password ──────────────────────────────────────────────────────────
  const changePassword = async () => {
    setPwMsg(null);

    if (password.new !== password.confirm) {
      setPwMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (password.new.length < 6) {
      setPwMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    setPwSaving(true);

    const { error } = await supabase.auth.updateUser({ password: password.new });

    setPwSaving(false);

    if (error) {
      setPwMsg({ type: 'error', text: error.message });
    } else {
      setPwMsg({ type: 'success', text: 'Password changed successfully.' });
      setPassword({ current: '', new: '', confirm: '' });
    }
  };

  const getPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return { strength: 0, label: '' };
    if (pwd.length < 6)  return { strength: 25, label: 'Weak',   color: 'bg-red-500' };
    if (pwd.length < 10) return { strength: 50, label: 'Fair',   color: 'bg-orange-500' };
    if (pwd.length < 14) return { strength: 75, label: 'Good',   color: 'bg-yellow-500' };
    return { strength: 100, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(password.new);

  const Feedback = ({ msg }: { msg: { type: 'success' | 'error'; text: string } | null }) =>
    msg ? (
      <p className={`text-sm mt-2 ${msg.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
        {msg.text}
      </p>
    ) : null;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>

      <div className="space-y-6">
        {/* Profile */}
        <SettingsSection title="Profile" description="Manage your personal information">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed here.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              onClick={saveProfile}
              disabled={profileSaving}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              {profileSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <Feedback msg={profileMsg} />
          </div>
        </SettingsSection>

        {/* Communication Preferences */}
        <SettingsSection title="Communication Preferences" description="Choose how you want to receive notifications">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preferred Method</label>
              <select
                value={preferences.preferredMethod}
                onChange={(e) => setPreferences({ ...preferences, preferredMethod: e.target.value })}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="email">Email Only</option>
                <option value="sms">SMS Only</option>
                <option value="both">Both Email and SMS</option>
              </select>
            </div>

            <div className="space-y-3 pt-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Notification Toggles</p>
              {([
                ['emailNotifications', 'Email Notifications'],
                ['smsNotifications', 'SMS Notifications'],
                ['paymentReminders', 'Payment Reminders'],
                ['maintenanceAlerts', 'Maintenance Alerts'],
              ] as [keyof typeof preferences, string][]).map(([key, label]) => (
                <label key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={preferences[key] as boolean}
                      onChange={(e) => setPreferences({ ...preferences, [key]: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 rounded-full peer peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500 transition-all">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <button
              onClick={savePreferences}
              disabled={prefSaving}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              {prefSaving ? 'Saving...' : 'Save Preferences'}
            </button>
            <Feedback msg={prefMsg} />
          </div>
        </SettingsSection>

        {/* Payment Settings */}
        <SettingsSection title="Payment Settings" description="Configure payment information for your tenants">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payment Instructions</label>
              <textarea
                value={payment.instructions}
                onChange={(e) => setPayment({ ...payment, instructions: e.target.value })}
                rows={8}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="e.g. M-Pesa Paybill: 123456, Account: Unit Number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Default Due Day (Day of Month)</label>
              <select
                value={payment.defaultDueDay}
                onChange={(e) => setPayment({ ...payment, defaultDueDay: e.target.value })}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            <button
              onClick={savePaymentSettings}
              disabled={paymentSaving}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              {paymentSaving ? 'Saving...' : 'Save Payment Settings'}
            </button>
            <Feedback msg={paymentMsg} />
          </div>
        </SettingsSection>

        {/* Security */}
        <SettingsSection title="Security" description="Update your password">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
              <input
                type="password"
                value={password.new}
                onChange={(e) => setPassword({ ...password, new: e.target.value })}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={password.confirm}
                onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {password.confirm && password.new === password.confirm && (
                <div className="flex items-center gap-2 mt-2 text-green-600 dark:text-green-400">
                  <Check size={16} />
                  <span className="text-sm">Passwords match</span>
                </div>
              )}
            </div>
            <button
              onClick={changePassword}
              disabled={pwSaving}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              {pwSaving ? 'Changing...' : 'Change Password'}
            </button>
            <Feedback msg={pwMsg} />
          </div>
        </SettingsSection>
      </div>
    </div>
  );
}

export default Settings;