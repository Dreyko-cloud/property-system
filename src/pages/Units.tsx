import { Building2, Plus, Search, DollarSign, Key, Home, Trash2 } from 'lucide-react';
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
  floor: '', unit_number: '', bedrooms: '', bathrooms: '', monthly_rent: '', status: 'Vacant' as const,
};

export default function Units() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadUnits = async () => {
    const { data, error } = await supabase.from('units').select('*').order('unit_number', { ascending: true });
    if (error) { console.error(error); return; }
    setUnits(data || []);
  };

  useEffect(() => { loadUnits(); }, []);

  const totalUnits = units.length;
  const occupiedUnits = units.filter(u => u.status === 'Occupied').length;
  const vacantUnits = units.filter(u => u.status === 'Vacant').length;
  const monthlyRevenue = units.filter(u => u.status === 'Occupied').reduce((sum, u) => sum + (u.monthly_rent || 0), 0);

  const filteredUnits = units.filter(unit => {
    const matchesSearch =
      unit.unit_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.tenant_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || unit.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.floor || !form.unit_number || !form.bedrooms || !form.bathrooms || !form.monthly_rent) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    const { error: insertError } = await supabase.from('units').insert([{
      floor: form.floor,
      unit_number: form.unit_number,
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      monthly_rent: Number(form.monthly_rent),
      status: form.status,
    }]);
    setLoading(false);
    if (insertError) { setError(insertError.message); return; }
    setForm(emptyForm);
    setShowAddForm(false);
    await loadUnits();
  };

  const handleDelete = async (unit: Unit) => {
    if (unit.status === 'Occupied') {
      alert('Cannot delete an occupied unit. Remove the tenant first.');
      return;
    }
    if (!confirm(`Delete Unit ${unit.unit_number}?`)) return;
    setDeletingId(unit.id);
    await supabase.from('units').delete().eq('id', unit.id);
    setDeletingId(null);
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

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Units</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your property units</p>
        </div>
        <button onClick={() => { setShowAddForm(!showAddForm); setError(null); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" /> Add Unit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Units', value: totalUnits, icon: Building2, color: 'blue' },
          { label: 'Occupied', value: occupiedUnits, icon: Key, color: 'green' },
          { label: 'Vacant', value: vacantUnits, icon: Home, color: 'blue' },
          { label: 'Monthly Revenue', value: `KSh ${monthlyRevenue.toLocaleString()}`, icon: DollarSign, color: 'green' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p></div>
              <div className={`p-3 bg-${color}-100 dark:bg-${color}-900 rounded-lg`}>
                <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Add New Unit</h2>
          {error && <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-sm rounded-lg">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Floor', name: 'floor', type: 'text', placeholder: '1' },
                { label: 'Unit Number', name: 'unit_number', type: 'text', placeholder: '101' },
                { label: 'Bedrooms', name: 'bedrooms', type: 'number', placeholder: '2' },
                { label: 'Bathrooms', name: 'bathrooms', type: 'number', placeholder: '1' },
                { label: 'Monthly Rent (KSh)', name: 'monthly_rent', type: 'number', placeholder: '25000' },
              ].map(({ label, name, type, placeholder }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {label} <span className="text-red-500">*</span>
                  </label>
                  <input type={type} name={name} value={form[name as keyof typeof emptyForm]}
                    onChange={handleChange} placeholder={placeholder} min={type === 'number' ? '0' : undefined}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                <select name="status" value={form.status} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="Vacant">Vacant</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                {loading ? 'Adding...' : 'Add Unit'}
              </button>
              <button type="button" onClick={() => { setShowAddForm(false); setError(null); setForm(emptyForm); }}
                className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Search units or tenants..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option>All</option><option>Occupied</option><option>Vacant</option><option>Maintenance</option>
          </select>
        </div>

        {filteredUnits.length === 0 ? (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-10">No units found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUnits.map((unit) => (
              <div key={unit.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-md transition-shadow relative">
                <button onClick={() => handleDelete(unit)} disabled={deletingId === unit.id}
                  className="absolute top-3 right-3 p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-40">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex items-start justify-between mb-3 pr-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Unit {unit.unit_number}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Floor {unit.floor}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(unit.status)}`}>
                    {unit.status}
                  </span>
                </div>
                <div className="space-y-1 mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{unit.bedrooms} bed • {unit.bathrooms} bath</p>
                  {unit.tenant_name ? (
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Tenant:</span> {unit.tenant_name}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 dark:text-gray-500 italic">No tenant assigned</p>
                  )}
                </div>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    KSh {(unit.monthly_rent || 0).toLocaleString()}/mo
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