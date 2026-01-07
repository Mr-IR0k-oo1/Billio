import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Plus, Edit2, Trash2, Repeat, Play, Pause, Calendar } from 'lucide-react';
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
    <div>
      <div className="page-header">
        <h1>Recurring Invoices</h1>
        <Link to="/recurring/new" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <Plus size={18} />
          Create Recurring
        </Link>
      </div>

      <div className="glass-card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Client</th>
                <th>Frequency</th>
                <th>Next Run</th>
                <th>Last Run</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>Loading...</td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    No recurring invoices setup yet.
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td style={{ fontWeight: 600 }}>{invoice.client_name}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Repeat size={14} className="text-muted" />
                        {getIntervalLabel(invoice)}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={14} className="text-muted" />
                        {format(new Date(invoice.next_run), 'MMM dd, yyyy')}
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {invoice.last_run ? format(new Date(invoice.last_run), 'MMM dd, yyyy') : 'Never'}
                    </td>
                    <td style={{ fontWeight: 600 }}>${parseFloat(invoice.total.toString()).toFixed(2)}</td>
                    <td>
                      <span className={`badge badge-${invoice.status === 'active' ? 'paid' : 'draft'}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => toggleStatus(invoice.id, invoice.status)}
                          title={invoice.status === 'active' ? 'Pause' : 'Resume'}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: invoice.status === 'active' ? 'var(--warning-color)' : 'var(--success-color)' }}
                        >
                          {invoice.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                        <Link to={`/recurring/${invoice.id}`} style={{ color: 'var(--accent-color)' }}>
                          <Edit2 size={16} />
                        </Link>
                        <button onClick={() => handleDelete(invoice.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--error-color)' }}>
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
