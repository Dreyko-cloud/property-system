import { Plus, CheckCircle, AlertCircle, Clock, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Payment {
  id: string;
  tenant_name: string;
  unit: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  payment_date: string;
  notes?: string;
  created_at: string;
}


interface Tenant {
  id: string;
  name: string;
  unit: string;
}

const emptyForm = {
  tenant_name: '', unit: '', amount: '', status: 'Paid' as const,
  payment_date: new Date().toISOString().split('T')[0], notes: '',
};

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadData = async () => {
    const { data: paymentsData } = await supabase
      .from('payments').select('*').order('payment_date', { ascending: false });
    const { data: tenantsData } = await supabase
      .from('tenants').select('id, name, unit').order('name', { ascending: true });
    setPayments(paymentsData || []);
    setTenants(tenantsData || []);
  };

  useEffect(() => { loadData(); }, []);

  // When tenant is selected, auto-fill their unit
  const handleTenantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = tenants.find(t => t.name === e.target.value);
    setForm(prev => ({
      ...prev,
      tenant_name: e.target.value,
      unit: selected?.unit || '',
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.tenant_name || !form.amount || !form.payment_date) {
      setError('Tenant, amount and date are required.');
      return;
    }
    setLoading(true);
    const { error: insertError } = await supabase.from('payments').insert([{
      tenant_name: form.tenant_name,
      unit: form.unit,
      amount: Number(form.amount),
      status: form.status,
      payment_date: form.payment_date,
      notes: form.notes || null,
    }]);
    setLoading(false);
    if (insertError) { setError(insertError.message); return; }
    setForm(emptyForm);
    setShowAddForm(false);
    await loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this payment record?')) return;
    setDeletingId(id);
    await supabase.from('payments').delete().eq('id', id);
    setDeletingId(null);
    await loadData();
  };

  const totalPaid = payments.filter(p => p.status === 'Paid').reduce((s, p) => s + (p.amount || 0), 0);
  const totalPending = payments.filter(p => p.status === 'Pending').reduce((s, p) => s + (p.amount || 0), 0);
  const totalOverdue = payments.filter(p => p.status === 'Overdue').reduce((s, p) => s + (p.amount || 0), 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Overdue': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payments</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track and record rent payments</p>
        </div>
        <button onClick={() => { setShowAddForm(!showAddForm); setError(null); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" /> Record Payment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Total Collected', value: totalPaid, icon: CheckCircle, color: 'green' },
          { label: 'Pending', value: totalPending, icon: Clock, color: 'yellow' },
          { label: 'Overdue', value: totalOverdue, icon: AlertCircle, color: 'red' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">KES {value.toLocaleString()}</p>
              </div>
              <div className={`p-3 bg-${color}-100 dark:bg-${color}-900 rounded-lg`}>
                <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Payment Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Record New Payment</h2>
          {error && <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-sm rounded-lg">{error}</div>}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tenant <span className="text-red-500">*</span></label>
              <select name="tenant_name" value={form.tenant_name} onChange={handleTenantChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="">Select tenant</option>
                {tenants.map(t => <option key={t.id} value={t.name}>{t.name} — Unit {t.unit}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unit</label>
              <input type="text" name="unit" value={form.unit} onChange={handleChange} placeholder="Auto-filled"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount (KES) <span className="text-red-500">*</span></label>
              <input type="number" name="amount" value={form.amount} onChange={handleChange} min="0" placeholder="25000"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
              <select name="status" value={form.status} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payment Date <span className="text-red-500">*</span></label>
              <input type="date" name="payment_date" value={form.payment_date} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes</label>
              <input type="text" name="notes" value={form.notes} onChange={handleChange} placeholder="Optional"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div className="md:col-span-2 flex gap-3 pt-2">
              <button type="submit" disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                {loading ? 'Saving...' : 'Save Payment'}
              </button>
              <button type="button" onClick={() => { setShowAddForm(false); setError(null); setForm(emptyForm); }}
                className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Payments Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {['Tenant','Unit','Amount','Date','Status','Notes',''].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {payments.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">No payments yet. Record one to get started.</td></tr>
              ) : payments.map(payment => (
                <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{payment.tenant_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{payment.unit}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">KES {(payment.amount || 0).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString('en-KE') : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{payment.notes || '—'}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDelete(payment.id)} disabled={deletingId === payment.id}
                      className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-40">
                      <Trash2 className="w-4 h-4" />
                    </button>
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