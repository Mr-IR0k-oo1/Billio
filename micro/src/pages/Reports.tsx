import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { TrendingUp, Users, FileText, DollarSign, Download } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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

const COLORS = ['#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

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
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reports/export?type=${type}`, {
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
    return <div>Loading...</div>;
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
    <div>
      <div className="page-header">
        <h1>Reports & Analytics</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => handleExport('invoices')} className="btn-ghost">
            <Download size={18} style={{ marginRight: '8px' }} />
            Export Invoices
          </button>
          <button onClick={() => handleExport('clients')} className="btn-ghost">
            <Download size={18} style={{ marginRight: '8px' }} />
            Export Clients
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="stats-grid">
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            <DollarSign size={20} />
            <span>Total Revenue</span>
          </div>
          <h2 style={{ fontSize: '2rem', color: 'var(--success-color)' }}>${totalRevenue.toFixed(2)}</h2>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            <FileText size={20} />
            <span>Total Invoices</span>
          </div>
          <h2 style={{ fontSize: '2rem' }}>
            {stats.invoice_stats.reduce((sum, item) => sum + parseInt(item.count.toString()), 0)}
          </h2>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            <Users size={20} />
            <span>Active Clients</span>
          </div>
          <h2 style={{ fontSize: '2rem' }}>{stats.client_stats.active_clients}</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
            of {stats.client_stats.total_clients} total
          </p>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            <TrendingUp size={20} />
            <span>Overdue Amount</span>
          </div>
          <h2 style={{ fontSize: '2rem', color: overdueAmount > 0 ? 'var(--error-color)' : 'var(--success-color)' }}>
            ${overdueAmount.toFixed(2)}
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
            {stats.overdue_stats.overdue_count || 0} invoices
          </p>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="glass-card" style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>Revenue Trend</h3>
          <select value={period} onChange={(e) => setPeriod(e.target.value)} style={{ width: 'auto' }}>
            <option value="30days">Last 30 Days</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
          </select>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="period" stroke="var(--text-secondary)" />
            <YAxis stroke="var(--text-secondary)" />
            <Tooltip 
              contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
              formatter={(value: number) => `$${value.toFixed(2)}`}
            />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={2} name="Total Revenue" />
            <Line type="monotone" dataKey="collected" stroke="#10b981" strokeWidth={2} name="Collected" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '24px' }}>
        {/* Invoice Status Distribution */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '20px' }}>Invoice Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={invoiceStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {invoiceStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number, name: string, props: any) => [
                `${value} invoices ($${props.payload.amount.toFixed(2)})`,
                name
              ]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Invoice Status Breakdown */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '20px' }}>Status Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stats.invoice_stats.map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px',
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${STATUS_COLORS[item.status] || COLORS[index % COLORS.length]}`
                }}
              >
                <div>
                  <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{item.status}</span>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {item.count} invoice{parseInt(item.count.toString()) !== 1 ? 's' : ''}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 600, color: 'var(--accent-color)' }}>
                    ${parseFloat(item.total_amount).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
