import { DollarSign, TrendingUp, AlertCircle, FileDown } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ChartCard, SimpleBarChart, SimpleLineChart, DonutChart } from '../components/ChartCard';

interface MonthlyData { label: string; value: number; }

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth(); // 0-indexed

function Reports() {
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [expectedRevenue, setExpectedRevenue] = useState(0);
  const [collectionRate, setCollectionRate] = useState(0);
  const [outstandingBalance, setOutstandingBalance] = useState(0);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [occupancyData, setOccupancyData] = useState([
    { label: 'Occupied', value: 0, color: '#10b981' },
    { label: 'Vacant', value: 0, color: '#ef4444' },
    { label: 'Maintenance', value: 0, color: '#f59e0b' },
  ]);

  useEffect(() => {
    const loadReports = async () => {
      const { data: payments } = await supabase.from('payments').select('*');
      const allPayments = payments || [];

      // Filter by selected month/year
      const monthStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
      const filtered = allPayments.filter(p => p.payment_date?.startsWith(monthStr));

      const paid = filtered.filter(p => p.status === 'Paid');
      const pending = filtered.filter(p => p.status === 'Pending' || p.status === 'Overdue');

      const revenue = paid.reduce((sum, p) => sum + (p.amount || 0), 0);
      const outstanding = pending.reduce((sum, p) => sum + (p.amount || 0), 0);
      const expected = revenue + outstanding;

      setTotalRevenue(revenue);
      setOutstandingBalance(outstanding);
      setExpectedRevenue(expected);
      setCollectionRate(expected > 0 ? Math.round((revenue / expected) * 1000) / 10 : 0);

      // Last 6 months trend
      const months: MonthlyData[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(selectedYear, selectedMonth - i, 1);
        const label = MONTHS[d.getMonth()];
        const mStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const total = allPayments
          .filter(p => p.status === 'Paid' && p.payment_date?.startsWith(mStr))
          .reduce((sum, p) => sum + (p.amount || 0), 0);
        months.push({ label, value: total });
      }
      setMonthlyData(months);

      // Units occupancy
      const { data: units } = await supabase.from('units').select('status');
      const allUnits = units || [];
      setOccupancyData([
        { label: 'Occupied',    value: allUnits.filter(u => u.status === 'Occupied').length,    color: '#10b981' },
        { label: 'Vacant',      value: allUnits.filter(u => u.status === 'Vacant').length,      color: '#ef4444' },
        { label: 'Maintenance', value: allUnits.filter(u => u.status === 'Maintenance').length, color: '#f59e0b' },
      ]);
    };
    loadReports();
  }, [selectedMonth, selectedYear]);

  const summaryCards = [
    { label: 'Total Collected',     value: `KES ${totalRevenue.toLocaleString()}`,      icon: DollarSign,  color: 'bg-green-500' },
    { label: 'Expected Revenue',    value: `KES ${expectedRevenue.toLocaleString()}`,   icon: TrendingUp,  color: 'bg-blue-500' },
    { label: 'Collection Rate',     value: `${collectionRate}%`,                         icon: TrendingUp,  color: 'bg-purple-500' },
    { label: 'Outstanding Balance', value: `KES ${outstandingBalance.toLocaleString()}`,icon: AlertCircle, color: 'bg-orange-500' },
  ];

  const comparisonData = [
    { label: 'Expected',  value: expectedRevenue, color: 'bg-blue-500' },
    { label: 'Collected', value: totalRevenue,     color: 'bg-green-500' },
  ];

  const totalUnitsCount = occupancyData.reduce((sum, d) => sum + d.value, 0);
  const occupancyRate = totalUnitsCount > 0 ? Math.round((occupancyData[0].value / totalUnitsCount) * 100) : 0;

  // ─── Export functions ─────────────────────────────────────────────────────────
  const getExportRows = () => {
    const monthLabel = `${MONTHS[selectedMonth]} ${selectedYear}`;
    return [
      ['Report Period', monthLabel],
      ['Total Collected', `KES ${totalRevenue.toLocaleString()}`],
      ['Expected Revenue', `KES ${expectedRevenue.toLocaleString()}`],
      ['Outstanding Balance', `KES ${outstandingBalance.toLocaleString()}`],
      ['Collection Rate', `${collectionRate}%`],
      [],
      ['Month', 'Revenue (KES)'],
      ...monthlyData.map(m => [m.label, m.value]),
    ];
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Payment Report — ${MONTHS[selectedMonth]} ${selectedYear}`, 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [['Metric', 'Value']],
      body: [
        ['Total Collected', `KES ${totalRevenue.toLocaleString()}`],
        ['Expected Revenue', `KES ${expectedRevenue.toLocaleString()}`],
        ['Outstanding Balance', `KES ${outstandingBalance.toLocaleString()}`],
        ['Collection Rate', `${collectionRate}%`],
      ],
    });
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['Month', 'Revenue (KES)']],
      body: monthlyData.map(m => [m.label, m.value.toLocaleString()]),
    });
    doc.save(`report-${MONTHS[selectedMonth]}-${selectedYear}.pdf`);
  };

  const exportExcel = () => {
    const rows = getExportRows();
    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, `report-${MONTHS[selectedMonth]}-${selectedYear}.xlsx`);
  };

  const years = [currentYear - 1, currentYear, currentYear + 1];

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Month + Year filter */}
          <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500">
            {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
          <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500">
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <button onClick={exportPDF} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">
            <FileDown size={16} /> PDF
          </button>
          <button onClick={exportExcel} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
            <FileDown size={16} /> Excel
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Showing data for <span className="font-semibold text-gray-700 dark:text-gray-300">{MONTHS[selectedMonth]} {selectedYear}</span>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.color} p-3 rounded-lg`}><Icon className="text-white" size={24} /></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{card.value}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="6-Month Revenue Trend">
          <SimpleLineChart data={monthlyData} height={250} />
        </ChartCard>
        <ChartCard title={`Expected vs Collected — ${MONTHS[selectedMonth]}`}>
          <SimpleBarChart data={comparisonData} height={250} />
        </ChartCard>
      </div>

      <ChartCard title="Occupancy Rate" className="mb-6">
        <DonutChart data={occupancyData} centerText={`${occupancyRate}%`} />
      </ChartCard>
    </div>
  );
}

export default Reports;