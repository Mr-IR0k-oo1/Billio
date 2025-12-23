import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Plus, Download, Mail, Filter, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Invoice {
  id: number;
  client_name: string;
  created_at: string;
  due_date: string;
  total: string | number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
}

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const data = await api.get('/invoices');
      setInvoices(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadPdf = async (id: number) => {
    try {
      const blob = await api.getPdf(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${id}.pdf`;
      a.click();
    } catch (err) {
      alert('Failed to download PDF');
    }
  };

  const handleSendEmail = async (id: number) => {
    if (!confirm('Send this invoice to the client?')) return;
    try {
      await api.post(`/invoices/${id}/send`, {});
      alert('Invoice sent successfully!');
      fetchInvoices();
    } catch (err) {
      alert('Failed to send invoice');
    }
  };

  const filteredInvoices = filter === 'all' 
    ? invoices 
    : invoices.filter(inv => inv.status === filter);

  return (
    <div>
      <div className="page-header">
        <h1>Invoices</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Filter size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-secondary)' }} />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              style={{ paddingLeft: '36px', background: 'var(--glass)', border: '1px solid var(--glass-border)' }}
            >
              <option value="all">All Invoices</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <Link to="/invoices/new" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <Plus size={18} /> New Invoice
          </Link>
        </div>
      </div>

      <div className="glass-card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Client</th>
                <th>Date</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv) => (
                <tr key={inv.id}>
                  <td style={{ fontWeight: 600 }}>#{inv.id.toString().padStart(4, '0')}</td>
                  <td>{inv.client_name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{new Date(inv.created_at).toLocaleDateString()}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{new Date(inv.due_date).toLocaleDateString()}</td>
                  <td style={{ fontWeight: 600 }}>${parseFloat(inv.total.toString()).toFixed(2)}</td>
                  <td>
                    <span className={`badge badge-${inv.status}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <Link to={`/invoices/${inv.id}`} title="Edit" style={{ color: 'var(--text-secondary)' }}>
                        <Edit2 size={16} />
                      </Link>
                      <button onClick={() => handleDownloadPdf(inv.id)} title="Download PDF" style={{ color: 'var(--text-secondary)', background: 'none' }}>
                        <Download size={16} />
                      </button>
                      <button onClick={() => handleSendEmail(inv.id)} title="Send via Email" style={{ color: 'var(--accent-color)', background: 'none' }}>
                        <Mail size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>
                    No invoices found.
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
