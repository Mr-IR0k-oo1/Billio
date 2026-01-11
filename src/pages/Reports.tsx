import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { TrendingUp, Users, FileText, DollarSign, Download, PieChart as PieChartIcon, BarChart3, ArrowUpRight } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface DashboardStats {
  invoice_stats: Array<{ status: string; count: number; total_amount: string }>;
  revenue_stats: Array<{ month: string; revenue: string; collected: string }>;
  client_stats: { total_clients: number; active_clients: number };
  overdue_stats: { overdue_count: number; overdue_amount: string };
}

interface RevenueData {
  period: string;
  revenue: number;
  collected: number;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280'];

const STATUS_COLORS: Record<string, string> = {
  paid: '#10b981',
  sent: '#3b82f6',
  draft: '#6b7280',
  overdue: '#ef4444',
  partially_paid: '#f59e0b',
  cancelled: '#9ca3af'
};

export default function Reports() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [period, setPeriod] = useState('6months');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  useEffect(() => {
    fetchRevenueData();
  }, [period]);

  const fetchDashboardStats = async () => {
    try {
      const data = await api.get('/reports/dashboard-stats');
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenueData = async () => {
    try {
      const data = await api.get(`/reports/revenue?period=${period}`);
      const formatted = data.map((item: any) => ({
        period: format(new Date(item.period), 'MMM yyyy'),
        revenue: parseFloat(item.revenue || 0),
        collected: parseFloat(item.collected || 0)
      }));
      setRevenueData(formatted);
    } catch (err) {
      console.error('Failed to fetch revenue data', err);
    }
  };

  const handleExport = async (type: 'invoices' | 'clients' | 'products') => {
    try {
      const apiUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/reports/export?type=${type}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_export.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('Failed to export data', err);
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-muted-foreground animate-pulse">Analyzing financial data...</p>
        </div>
      </div>
    );
  }

  // Prepare pie chart data
  const invoiceStatusData = stats.invoice_stats.map(item => ({
    name: item.status,
    value: parseInt(item.count.toString()),
    amount: parseFloat(item.total_amount)
  }));

  // Calculate totals
  const totalRevenue = stats.invoice_stats.reduce((sum, item) => sum + parseFloat(item.total_amount), 0);
  const overdueAmount = parseFloat(stats.overdue_stats.overdue_amount || '0');

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="page-header">
        <div>
          <h1>Reports & Intelligence</h1>
          <p className="text-muted-foreground text-sm mt-1">Advanced financial analytics and performance tracking</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => handleExport('invoices')} className="btn-secondary flex items-center gap-2">
            <Download size={18} />
            <span>Export Invoices</span>
          </button>
          <button onClick={() => handleExport('clients')} className="btn-secondary flex items-center gap-2">
            <Download size={18} />
            <span>Export Clients</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="stats-grid">
        <div className="glass-card group hover:border-emerald-500/30 transition-all duration-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
              <DollarSign size={24} />
            </div>
            <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-full">
              <ArrowUpRight size={12} /> 14%
            </div>
          </div>
          <p className="text-muted-foreground text-sm font-medium">Total Revenue</p>
          <h2 className="text-3xl font-bold mt-1">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
        </div>

        <div className="glass-card group hover:border-blue-500/30 transition-all duration-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
              <FileText size={24} />
            </div>
          </div>
          <p className="text-muted-foreground text-sm font-medium">Total Invoices</p>
          <h2 className="text-3xl font-bold mt-1">
            {stats.invoice_stats.reduce((sum, item) => sum + parseInt(item.count.toString()), 0)}
          </h2>
        </div>

        <div className="glass-card group hover:border-purple-500/30 transition-all duration-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
              <Users size={24} />
            </div>
          </div>
          <p className="text-muted-foreground text-sm font-medium">Client Base</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h2 className="text-3xl font-bold">{stats.client_stats.active_clients}</h2>
            <span className="text-muted-foreground text-xs">active / {stats.client_stats.total_clients} total</span>
          </div>
        </div>

        <div className="glass-card group hover:border-red-500/30 transition-all duration-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
              <TrendingUp size={24} />
            </div>
          </div>
          <p className="text-muted-foreground text-sm font-medium">Pending Collections</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h2 className={`text-3xl font-bold ${overdueAmount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              ${overdueAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h2>
            <span className="text-muted-foreground text-xs">{stats.overdue_stats.overdue_count || 0} invoices</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-2 glass-card">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                <BarChart3 size={20} />
              </div>
              <h3 className="text-xl font-bold">Revenue Velocity</h3>
            </div>
            <select 
              value={period} 
              onChange={(e) => setPeriod(e.target.value)} 
              className="w-full md:w-auto text-sm py-2"
            >
              <option value="30days">Last 30 Days</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="12months">Last 12 Months</option>
            </select>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="period" 
                  stroke="rgba(255,255,255,0.4)" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.4)" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(23, 23, 23, 0.95)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '12px',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  itemStyle={{ fontSize: '12px' }}
                  labelStyle={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '12px' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2, fill: '#171717' }} 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  name="Gross Revenue" 
                />
                <Line 
                  type="monotone" 
                  dataKey="collected" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2, fill: '#171717' }} 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  name="Total Collected" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Invoice Status Distribution */}
        <div className="glass-card">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 border border-purple-500/20">
              <PieChartIcon size={20} />
            </div>
            <h3 className="text-xl font-bold">Status Profile</h3>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={invoiceStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {invoiceStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ 
                    background: 'rgba(23, 23, 23, 0.95)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '12px',
                  }}
                  formatter={(value: number, name: string, props: any) => [
                    `${value} invoices ($${props.payload.amount.toLocaleString()})`,
                    name.charAt(0).toUpperCase() + name.slice(1)
                  ]} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3 mt-6">
            {stats.invoice_stats.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: STATUS_COLORS[item.status] || COLORS[index % COLORS.length] }} 
                  />
                  <span className="text-sm font-medium capitalize text-foreground/80">{item.status}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">${parseFloat(item.total_amount).toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.count} items</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
