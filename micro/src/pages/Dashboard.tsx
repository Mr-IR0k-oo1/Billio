import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Plus, Users, FileText, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalClients: 0,
    revenue: 0,
    recentInvoices: [] as any[]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const invoices = await api.get('/invoices');
        const clients = await api.get('/clients');
        
        const total = invoices.reduce((acc: number, inv: any) => acc + parseFloat(inv.total), 0);
        
        setStats({
          totalInvoices: invoices.length,
          totalClients: clients.length,
          revenue: total,
          recentInvoices: invoices.slice(0, 5)
        });
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <Link to="/invoices/new" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <Plus size={18} />
          Create Invoice
        </Link>
      </div>

      <div className="stats-grid">
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            <FileText size={20} />
            <span>Total Invoices</span>
          </div>
          <h2 style={{ fontSize: '2rem' }}>{stats.totalInvoices}</h2>
        </div>
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            <Users size={20} />
            <span>Active Clients</span>
          </div>
          <h2 style={{ fontSize: '2rem' }}>{stats.totalClients}</h2>
        </div>
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            <TrendingUp size={20} />
            <span>Total Revenue</span>
          </div>
          <h2 style={{ fontSize: '2rem', color: 'var(--success-color)' }}>${stats.revenue.toFixed(2)}</h2>
        </div>
      </div>

      <div className="glass-card">
        <h3>Recent Invoices</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Client</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.client_name}</td>
                  <td>
                    <span className={`badge badge-${invoice.status}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td>{new Date(invoice.due_date).toLocaleDateString()}</td>
                  <td>${parseFloat(invoice.total).toFixed(2)}</td>
                  <td>
                    <Link to={`/invoices/${invoice.id}`} style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>Edit</Link>
                  </td>
                </tr>
              ))}
              {stats.recentInvoices.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>
                    No invoices yet. Create your first one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
