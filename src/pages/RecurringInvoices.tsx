import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Plus, Edit2, Trash2, Repeat, Play, Pause, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

interface RecurringInvoice {
  id: number;
  client_name: string;
  interval: string;
  interval_count: number;
  start_date: string;
  next_run: string;
  last_run: string | null;
  status: 'active' | 'paused' | 'completed';
  total: number;
}

export default function RecurringInvoices() {
  const [invoices, setInvoices] = useState<RecurringInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecurring();
  }, []);

  const fetchRecurring = async () => {
    try {
      const data = await api.get('/recurring');
      setInvoices(data);
    } catch (err) {
      console.error('Failed to fetch recurring invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this recurring profile?')) return;
    try {
      await api.delete(`/recurring/${id}`);
      setInvoices(invoices.filter(i => i.id !== id));
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const toggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    try {
      await api.put(`/recurring/${id}`, { status: newStatus });
      fetchRecurring();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const getIntervalLabel = (invoice: RecurringInvoice) => {
    const { interval, interval_count } = invoice;
    if (interval_count === 1) return `Every ${interval}`;
    return `Every ${interval_count} ${interval}s`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="page-header">
        <div>
          <h1>Subscription Billing</h1>
          <p className="text-muted-foreground text-sm mt-1">Automated recurring billing cycles for your steady revenue streams</p>
        </div>
        <Link to="/recurring/new" className="btn-cta flex items-center gap-2 no-underline">
          <Plus size={18} />
          <span>New Subscription</span>
        </Link>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Partner Client</th>
                <th>Billing Cycle</th>
                <th>Next Execution</th>
                <th>Last Run</th>
                <th>Cycle Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-20">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                      <p className="text-muted-foreground text-sm">Synchronizing billing engine...</p>
                    </div>
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <div className="empty-state-icon">
                        <Repeat size={32} />
                      </div>
                      <h3 className="text-xl font-bold mb-2">No active subscriptions</h3>
                      <p className="text-muted-foreground max-w-sm mx-auto mb-8">
                        Automate your regular billing by setting up recurring invoice profiles for your long-term clients.
                      </p>
                      <Link to="/recurring/new" className="btn-secondary no-underline inline-flex items-center gap-2">
                        <Plus size={18} /> Design First Subscription
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="group">
                    <td>
                      <div className="flex flex-col">
                        <span className="font-bold text-white">{invoice.client_name}</span>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Service Retainer</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-sm text-foreground/80 font-medium">
                        <Repeat size={14} className="text-blue-400" />
                        {getIntervalLabel(invoice)}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-sm text-foreground/80 font-medium">
                        <Calendar size={14} className="text-blue-400" />
                        {format(new Date(invoice.next_run), 'MMM dd, yyyy')}
                      </div>
                    </td>
                    <td className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        {invoice.last_run ? format(new Date(invoice.last_run), 'MMM dd, yyyy') : 'Pending Initial'}
                      </div>
                    </td>
                    <td className="font-bold text-foreground/90">
                      ${parseFloat(invoice.total.toString()).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td>
                      <span className={`badge badge-${invoice.status === 'active' ? 'paid' : 'draft'} inline-flex items-center gap-1.5`}>
                        {invoice.status === 'active' ? <Play size={10} fill="currentColor" /> : <Pause size={10} fill="currentColor" />}
                        {invoice.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => toggleStatus(invoice.id, invoice.status)}
                          className={`p-2 rounded-lg transition-colors ${
                            invoice.status === 'active' ? 'hover:bg-amber-500/10 text-amber-500' : 'hover:bg-emerald-500/10 text-emerald-500'
                          }`}
                          title={invoice.status === 'active' ? 'Suspend Cycle' : 'Resume Cycle'}
                        >
                          {invoice.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                        <Link 
                          to={`/recurring/${invoice.id}`} 
                          className="p-2 hover:bg-white/5 rounded-lg text-blue-400 transition-colors"
                          title="Modify Subscription"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(invoice.id)} 
                          className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 transition-colors"
                          title="Terminate Subscription"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
