import { Building2, Plus, Search, DollarSign, Key, Home } from 'lucide-react';
import { useState } from 'react';

interface Unit {
  id: number;
  floor: string;
  unitNumber: string;
  bedrooms: number;
  bathrooms: number;
  monthlyRent: number;
  status: 'Occupied' | 'Vacant' | 'Maintenance';
  tenantName?: string;
}

const mockUnits: Unit[] = [
  { id: 1, floor: '1', unitNumber: '101', bedrooms: 2, bathrooms: 1, monthlyRent: 1200, status: 'Occupied', tenantName: 'John Smith' },
  { id: 2, floor: '1', unitNumber: '102', bedrooms: 1, bathrooms: 1, monthlyRent: 950, status: 'Vacant' },
  { id: 3, floor: '2', unitNumber: '201', bedrooms: 3, bathrooms: 2, monthlyRent: 1800, status: 'Occupied', tenantName: 'Sarah Johnson' },
  { id: 4, floor: '2', unitNumber: '202', bedrooms: 2, bathrooms: 1, monthlyRent: 1200, status: 'Maintenance' },
  { id: 5, floor: '3', unitNumber: '301', bedrooms: 2, bathrooms: 2, monthlyRent: 1500, status: 'Occupied', tenantName: 'Mike Davis' },
  { id: 6, floor: '3', unitNumber: '302', bedrooms: 1, bathrooms: 1, monthlyRent: 900, status: 'Vacant' },
];

export default function Units() {
  const [units] = useState<Unit[]>(mockUnits);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showAddForm, setShowAddForm] = useState(false);

  const totalUnits = units.length;
  const occupiedUnits = units.filter(u => u.status === 'Occupied').length;
  const vacantUnits = units.filter(u => u.status === 'Vacant').length;
  const monthlyRevenue = units
    .filter(u => u.status === 'Occupied')
    .reduce((sum, u) => sum + u.monthlyRent, 0);

  const filteredUnits = units.filter(unit => {
    const matchesSearch = unit.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         unit.tenantName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || unit.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Occupied': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Vacant': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Maintenance': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Units</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your property units</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Unit
        </button>
      </div>

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
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">${monthlyRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Add New Unit</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Floor
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Unit Number
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="101"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bedrooms
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bathrooms
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Monthly Rent
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="1200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>Occupied</option>
                  <option>Vacant</option>
                  <option>Maintenance</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Unit
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUnits.map((unit) => (
            <div
              key={unit.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Unit {unit.unitNumber}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Floor {unit.floor}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(unit.status)}`}>
                  {unit.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <span>{unit.bedrooms} bed • {unit.bathrooms} bath</span>
                </div>
                {unit.tenantName && (
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Tenant:</span> {unit.tenantName}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  ${unit.monthlyRent.toLocaleString()}/mo
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
