import { Users, UserPlus, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Tenant {
  id: string;
  name: string;
  unit: string;
  phone: string;
  email: string;
  leaseStart: string;
  status: string;
  created_at: string;
}

interface Unit {
  id: string;
  unit_number: string;
}

export default function Tenants() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    unit: '',
    leaseStart: '',
    notes: '',
  });

  // ─── Load tenants + units ───────────────────────────────────────────────────
  const loadData = async () => {
    const { data: tenantsData, error: tenantsError } = await supabase
      .from('tenants')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: unitsData, error: unitsError } = await supabase
      .from('units')
      .select('*')
      .order('unit_number', { ascending: true });

    if (tenantsError) console.error('Tenants error:', tenantsError);
    if (unitsError) console.error('Units error:', unitsError);

    setTenants(tenantsData || []);
    setUnits(unitsData || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  // ─── Stats ──────────────────────────────────────────────────────────────────
  const totalTenants = tenants.length;
  const activeLeases = tenants.filter(t => t.status === 'Active').length;
  const pendingPayments = tenants.filter(t => t.status === 'Pending').length;
  const occupancyRate = units.length > 0
    ? Math.round((activeLeases / units.length) * 100)
    : 0;

  // ─── Form handlers ──────────────────────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.phone || !form.email || !form.unit || !form.leaseStart) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    const { error: insertError } = await supabase
      .from('tenants')
      .insert([
        {
          name: form.name,
          phone: form.phone,
          email: form.email,
          unit: form.unit,
          leaseStart: form.leaseStart,
          notes: form.notes || null,
          status: 'Active',
        },
      ]);

    setLoading(false);

    if (insertError) {
      console.error('Insert error:', insertError);
      setError(insertError.message);
      return;
    }

    // Reset form, close modal, refresh list
    setForm({ name: '', phone: '', email: '', unit: '', leaseStart: '', notes: '' });
    setShowAddModal(false);
    await loadData();
  };

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':   return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Pending':  return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'Inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default:         return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tenants</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your tenants and leases</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          Add Tenant
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Tenants</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{totalTenants}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Leases</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{activeLeases}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Payments</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{pendingPayments}</p>
            </div>
            <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-lg">
              <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Occupancy Rate</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{occupancyRate}%</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Unit</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Phone</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Lease Start</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {tenants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    No tenants yet. Add one to get started.
                  </td>
                </tr>
              ) : (
                tenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{tenant.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{tenant.unit}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{tenant.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{tenant.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {tenant.leaseStart ? new Date(tenant.leaseStart).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(tenant.status)}`}>
                        {tenant.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Tenant Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add New Tenant</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-sm rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assigned Unit <span className="text-red-500">*</span>
                </label>
                <select
                  name="unit"
                  value={form.unit}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select a unit</option>
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.unit_number}>
                      Unit {unit.unit_number}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lease Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="leaseStart"
                  value={form.leaseStart}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Additional notes..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding...' : 'Add Tenant'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setError(null);
                    setForm({ name: '', phone: '', email: '', unit: '', leaseStart: '', notes: '' });
                  }}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}