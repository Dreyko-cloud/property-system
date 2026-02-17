import { Building2, Plus, Search, DollarSign, Key, Home } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Unit {
  id: string;
  unit_number: string;
  floor: string;
  bedrooms: number;
  bathrooms: number;
  monthly_rent: number;
  status: 'Occupied' | 'Vacant' | 'Maintenance';
  tenant_name?: string;
  created_at: string;
}

const emptyForm = {
  floor: '',
  unit_number: '',
  bedrooms: '',
  bathrooms: '',
  monthly_rent: '',
  status: 'Vacant' as const,
};

export default function Units() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── Load units ─────────────────────────────────────────────────────────────
  const loadUnits = async () => {
    const { data, error } = await supabase
      .from('units')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Load units error:', error);
      return;
    }
    setUnits(data || []);
  };

  useEffect(() => {
    loadUnits();
  }, []);

  // ─── Stats ───────────────────────────────────────────────────────────────────
  const totalUnits = units.length;
  const occupiedUnits = units.filter(u => u.status === 'Occupied').length;
  const vacantUnits = units.filter(u => u.status === 'Vacant').length;
  const monthlyRevenue = units
    .filter(u => u.status === 'Occupied')
    .reduce((sum, u) => sum + (u.monthly_rent || 0), 0);

  // ─── Filtering ───────────────────────────────────────────────────────────────
  const filteredUnits = units.filter(unit => {
    const matchesSearch =
      unit.unit_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.tenant_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || unit.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // ─── Form handlers ───────────────────────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.floor || !form.unit_number || !form.bedrooms || !form.bathrooms || !form.monthly_rent) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    const { error: insertError } = await supabase.from('units').insert([
      {
        floor: form.floor,
        unit_number: form.unit_number,
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        monthly_rent: Number(form.monthly_rent),
        status: form.status,
      },
    ]);

    setLoading(false);

    if (insertError) {
      console.error('Insert error:', insertError);
      setError(insertError.message);
      return;
    }

    setForm(emptyForm);
    setShowAddForm(false);
    await loadUnits();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Occupied':    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Vacant':      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Maintenance': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      default:            return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Units</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your property units</p>
        </div>
        <button
          onClick={() => { setShowAddForm(!showAddForm); setError(null); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Unit
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Units</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{totalUnits}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Occupied Units</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{occupiedUnits}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <Key className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Vacant Units</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{vacantUnits}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Home className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Revenue</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                KES {monthlyRevenue.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Add Unit Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Add New Unit</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Floor <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="floor"
                  value={form.floor}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Unit Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="unit_number"
                  value={form.unit_number}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="101"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bedrooms <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={form.bedrooms}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bathrooms <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={form.bathrooms}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Monthly Rent (KES) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="monthly_rent"
                  value={form.monthly_rent}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="25000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="Occupied">Occupied</option>
                  <option value="Vacant">Vacant</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding...' : 'Add Unit'}
              </button>
              <button
                type="button"
                onClick={() => { setShowAddForm(false); setError(null); setForm(emptyForm); }}
                className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Units Grid */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search units or tenants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option>All</option>
            <option>Occupied</option>
            <option>Vacant</option>
            <option>Maintenance</option>
          </select>
        </div>

        {filteredUnits.length === 0 ? (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-10">
            No units found. Add one to get started.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUnits.map((unit) => (
              <div
                key={unit.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Unit {unit.unit_number}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Floor {unit.floor}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(unit.status)}`}>
                    {unit.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {unit.bedrooms} bed • {unit.bathrooms} bath
                  </p>
                  {unit.tenant_name && (
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Tenant:</span> {unit.tenant_name}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    KES {(unit.monthly_rent || 0).toLocaleString()}/mo
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}