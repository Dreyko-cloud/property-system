import { DollarSign, TrendingUp, AlertTriangle, Clock, Bell, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useEffect } from 'react';

interface Payment {
  id: string;
  tenant: string;
  unit: string;
  amount: number;
  billingMonth: string;
  paymentDate: string | null;
  status: string;
  created_at: string;
}

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const currentMonth = payments;
  const totalCollected = currentMonth.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = currentMonth.filter(p => p.status === 'Pending').length;
  const overduePayments = payments.filter(p => p.status === 'Overdue').length;
  const collectionRate =
  currentMonth.length === 0
    ? 0
    : Math.round(
        (currentMonth.filter(p => p.status === 'Paid').length /
          currentMonth.length) *
          100
      );

  useEffect(() => {
  const loadPayments = async () => {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setPayments(data || []);
  };

  loadPayments();
}, []);

  const recordPayment = async (id: string) => {
  const { error } = await supabase
    .from('payments')
    .update({
      status: 'Paid',
      paymentDate: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error(error);
    return;
  }

  // Update UI instantly
  setPayments(prev =>
    prev.map(p =>
      p.id === id
        ? { ...p, status: 'Paid', paymentDate: new Date().toISOString() }
        : p
    )
  );
};


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Pending': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'Overdue': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payments</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Track and manage rent payments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Collected This Month</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">KES{totalCollected.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
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
              <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Overdue Payments</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{overduePayments}</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Collection Rate</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{collectionRate}%</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Tenant</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Unit</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Billing Month</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Payment Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {payment.tenant}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {payment.unit}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                    ${payment.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {payment.billingMonth}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {payment.status !== 'Paid' && (
                        <>
                          <button
                            className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors"
                            title="Send Reminder"
                          >
                            <Bell className="w-4 h-4" />
                            Remind
                          </button>
                          <button
  onClick={() => recordPayment(payment.id)}
  className="flex items-center gap-1 text-green-600 ..."
>
                            <CheckCircle className="w-4 h-4" />
                            Record
                          </button>
                        </>
                      )}
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
