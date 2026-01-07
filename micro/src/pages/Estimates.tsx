import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Plus, Edit2, Trash2, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

interface Estimate {
  id: number;
  client_name: string;
  estimate_number: string;
  issue_date: string;
  expiry_date: string;
  total: string | number;
  status: 'draft' | 'sent' | 'accepted' | 'declined' | 'expired' | 'converted';
}

const STATUS_ICONS: Record<string, any> = {
  accepted: CheckCircle,
  declined: XCircle,
  draft: Edit2,
  sent: FileText,
  expired: Clock,
  converted: CheckCircle
};

const STATUS_COLORS: Record<string, string> = {
  accepted: 'var(--success-color)',
  declined: 'var(--error-color)',
  draft: 'var(--text-secondary)',
  sent: 'var(--accent-color)',
  expired: 'var(--text-secondary)',
  converted: 'var(--success-color)'
};

export default function Estimates() {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchEstimates();
  }, []);

  const fetchEstimates = async () => {
    setLoading(true);
    try {
      const data = await api.get('/estimates');
      setEstimates(data);
    } catch (err) {
      console.error('Failed to fetch estimates', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this estimate?')) return;
    
    try {
      await api.delete(`/estimates/${id}`);
      setEstimates(estimates.filter(e => e.id !== id));
    } catch (err) {
      alert('Failed to delete estimate');
    }
  };

  const handleConvert = async (id: number) => {
    if (!confirm('Convert this estimate to an invoice?')) return;
    
    try {
      await api.post(`/estimates/${id}/convert`, {});
      alert('Estimate successfully converted to invoice!');
      fetchEstimates(); // Refresh to update status
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to convert estimate');
    }
  };

  const filteredEstimates = estimates.filter(estimate => {
    const matchesSearch = !search || 
      estimate.client_name?.toLowerCase().includes(search.toLowerCase()) ||
      estimate.estimate_number?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || estimate.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="page-header">
        <h1>Estimates</h1>
        <Link to="/estimates/new" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <Plus size={18} />
          Create Estimate
        </Link>
      </div>

      {/* Filters */}
      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '16px' }}>
          <input
            type="text"
            placeholder="Search by client or estimate number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="accepted">Accepted</option>
            <option value="declined">Declined</option>
            <option value="expired">Expired</option>
            <option value="converted">Converted</option>
          </select>
        </div>
      </div>

      {/* Estimates Table */}
      <div className="glass-card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Estimate #</th>
                <th>Client</th>
                <th>Issue Date</th>
                <th>Expiry Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>
                    Loading estimates...
                  </td>
                </tr>
              ) : filteredEstimates.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    {search || statusFilter ? 'No estimates match your filters' : 'No estimates yet. Create your first one!'}
                  </td>
                </tr>
              ) : (
                filteredEstimates.map((estimate) => {
                  const StatusIcon = STATUS_ICONS[estimate.status] || FileText;
                  return (
                    <tr key={estimate.id}>
                      <td style={{ fontWeight: 600 }}>{estimate.estimate_number}</td>
                      <td>{estimate.client_name}</td>
                      <td>{format(new Date(estimate.issue_date), 'MMM dd, yyyy')}</td>
                      <td>{format(new Date(estimate.expiry_date), 'MMM dd, yyyy')}</td>
                      <td style={{ fontWeight: 600 }}>${parseFloat(estimate.total.toString()).toFixed(2)}</td>
                      <td>
                        <span 
                          className={`badge badge-${estimate.status}`}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '6px', 
                            width: 'fit-content',
                            color: STATUS_COLORS[estimate.status]
                          }}
                        >
                          <StatusIcon size={14} />
                          {estimate.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {estimate.status !== 'converted' && (
                            <>
                              <Link 
                                to={`/estimates/${estimate.id}`}
                                style={{ color: 'var(--accent-color)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                              >
                                <Edit2 size={16} />
                                Edit
                              </Link>
                              {estimate.status === 'accepted' && (
                                <button
                                  onClick={() => handleConvert(estimate.id)}
                                  style={{ 
                                    background: 'none', 
                                    border: 'none', 
                                    color: 'var(--success-color)', 
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}
                                >
                                  <CheckCircle size={16} />
                                  Convert
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(estimate.id)}
                                style={{ 
                                  background: 'none', 
                                  border: 'none', 
                                  color: 'var(--error-color)', 
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                <Trash2 size={16} />
                                Delete
                              </button>
                            </>
                          )}
                          {estimate.status === 'converted' && (
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                              Converted to Invoice
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
