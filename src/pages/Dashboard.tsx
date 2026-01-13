import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Plus, Users, FileText, TrendingUp, ArrowUpRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Invoice {
  id: number;
  client_name: string;
  total: string | number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  due_date: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalClients: 0,
    revenue: 0,
    recentInvoices: [] as Invoice[]
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const isDemo = token?.startsWith('demo-token-');

      if (isDemo) {
        // Mock data for demo mode
        const mockInvoices: Invoice[] = [
          { id: 1, client_name: 'Acme Corp', total: 4500.00, status: 'paid', due_date: new Date().toISOString() },
          { id: 2, client_name: 'Global Tech', total: 1200.50, status: 'sent', due_date: new Date(Date.now() + 86400000 * 5).toISOString() },
          { id: 3, client_name: 'Stark Industries', total: 8900.00, status: 'overdue', due_date: new Date(Date.now() - 86400000 * 2).toISOString() },
          { id: 4, client_name: 'Wayne Ent.', total: 3200.00, status: 'draft', due_date: new Date(Date.now() + 86400000 * 10).toISOString() },
          { id: 5, client_name: 'Oscorp', total: 560.00, status: 'paid', due_date: new Date(Date.now() - 86400000 * 15).toISOString() },
        ];
        
        setStats({
          totalInvoices: 24,
          totalClients: 8,
          revenue: 18360.50,
          recentInvoices: mockInvoices
        });
        return;
      }

      try {
        const invoices: Invoice[] = await api.get('/invoices');
        const clients = await api.get('/clients');
        
        const total = invoices.reduce((acc: number, inv: Invoice) => acc + parseFloat(inv.total.toString()), 0);
        
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
        <div>
          <h1 className="premium-gradient-text">Dashboard</h1>
          <p className="text-muted-foreground/50 text-xs mt-1 uppercase tracking-widest font-bold">Business Overview</p>
        </div>
        <Link to="/invoices/new" className="btn-cta text-sm flex items-center gap-2 no-underline py-2">
          <Plus size={18} />
          <span>New Invoice</span>
        </Link>
      </div>

      <div className="stats-grid">
        <div className="glass-card group hover:border-blue-500/30 transition-all duration-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
              <FileText size={24} />
            </div>
            <span className="text-[10px] font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Total</span>
          </div>
          <p className="text-muted-foreground text-sm font-medium">Total Invoices</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h2 className="text-3xl font-bold">{stats.totalInvoices}</h2>
            <span className="text-green-500 text-xs font-bold">+12%</span>
          </div>
        </div>

        <div className="glass-card group hover:border-violet-500/30 transition-all duration-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-500">
              <Users size={24} />
            </div>
            <span className="text-[10px] font-bold text-violet-400 bg-violet-400/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Active</span>
          </div>
          <p className="text-muted-foreground text-sm font-medium">Total Clients</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h2 className="text-3xl font-bold">{stats.totalClients}</h2>
            <span className="text-green-500 text-xs font-bold">+4%</span>
          </div>
        </div>

        <div className="glass-card group hover:border-emerald-500/30 transition-all duration-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
              <TrendingUp size={24} />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Revenue</span>
          </div>
          <p className="text-muted-foreground text-sm font-medium">Total Revenue</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h2 className="text-3xl font-bold text-white">${stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
            <ArrowUpRight className="text-green-500" size={16} />
          </div>
        </div>
      </div>

      <div className="glass-card p-0 overflow-hidden">
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
          <h3 className="text-lg font-bold">Recent Invoices</h3>
          <Link to="/invoices" className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">View All</Link>
        </div>
        <div className="table-container m-0">
          <table>
            <thead>
              <tr>
                <th className="pl-8">Client</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th className="pr-8 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentInvoices.map((invoice) => (
                <tr key={invoice.id} className="group hover:bg-white/[0.02]">
                  <td className="pl-8 font-medium">{invoice.client_name}</td>
                  <td>
                    <span className={`badge badge-${invoice.status} flex items-center gap-1.5 w-fit`}>
                      {invoice.status === 'paid' && <CheckCircle2 size={12} />}
                      {invoice.status === 'sent' && <Clock size={12} />}
                      {invoice.status === 'overdue' && <AlertCircle size={12} />}
                      {invoice.status}
                    </span>
                  </td>
                  <td className="text-muted-foreground">{new Date(invoice.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td className="font-bold text-white">${parseFloat(invoice.total.toString()).toFixed(2)}</td>
                  <td className="pr-8 text-right">
                    <Link to={`/invoices/${invoice.id}`} className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-white hover:bg-white/10 transition-all">
                      <ArrowUpRight size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
              {stats.recentInvoices.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted-foreground py-16">
                    <div className="flex flex-col items-center gap-2">
                      <FileText size={32} className="opacity-20" />
                      <p>No invoices yet. Create your first one!</p>
                      <Link to="/invoices/new" className="text-blue-400 hover:underline text-sm font-medium mt-2">Get Started</Link>
                    </div>
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
