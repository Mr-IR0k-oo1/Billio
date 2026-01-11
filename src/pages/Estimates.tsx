import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Plus, Edit2, Trash2, FileText, CheckCircle, XCircle, Clock, Search, Filter, ArrowRight, FileCheck } from 'lucide-react';
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
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="page-header">
        <div>
          <h1>Estimates & Proposals</h1>
          <p className="text-muted-foreground text-sm mt-1">Convert opportunities into professional project agreements</p>
        </div>
        <Link to="/estimates/new" className="btn-cta flex items-center gap-2 no-underline">
          <Plus size={18} />
          <span>New Proposal</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search proposals or clients..."
            className="pl-12 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative min-w-[200px]">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-12 w-full appearance-none"
          >
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

      {/* Estimates Content */}
      <div className="glass-card overflow-hidden">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Identifier</th>
                <th>Project Client</th>
                <th>Issue Date</th>
                <th>Valid Until</th>
                <th>Proposed Total</th>
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
                      <p className="text-muted-foreground text-sm">Retrieving proposals...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredEstimates.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <div className="empty-state-icon">
                        <FileCheck size={32} />
                      </div>
                      <h3 className="text-xl font-bold mb-2">No proposals found</h3>
                      <p className="text-muted-foreground max-w-sm mx-auto mb-8">
                        {search || statusFilter 
                          ? "Adjust your filters to see more results." 
                          : "Start your next project by creating a professional proposal for your clients."}
                      </p>
                      {!search && !statusFilter && (
                        <Link to="/estimates/new" className="btn-secondary no-underline inline-flex items-center gap-2">
                          <Plus size={18} /> Generate First Proposal
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEstimates.map((estimate) => {
                  const StatusIcon = STATUS_ICONS[estimate.status] || FileText;
                  return (
                    <tr key={estimate.id} className="group">
                      <td className="font-bold text-white">#{estimate.estimate_number}</td>
                      <td>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{estimate.client_name}</span>
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Premium Client</span>
                        </div>
                      </td>
                      <td className="text-muted-foreground">{format(new Date(estimate.issue_date), 'MMM dd, yyyy')}</td>
                      <td className="text-muted-foreground">{format(new Date(estimate.expiry_date), 'MMM dd, yyyy')}</td>
                      <td className="font-bold text-foreground/90">${parseFloat(estimate.total.toString()).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td>
                        <span className={`badge badge-${estimate.status} inline-flex items-center gap-1.5`}>
                          <StatusIcon size={12} />
                          {estimate.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {estimate.status !== 'converted' ? (
                            <>
                              <Link 
                                to={`/estimates/${estimate.id}`}
                                className="p-2 hover:bg-white/5 rounded-lg text-blue-400 transition-colors"
                                title="Modify Proposal"
                              >
                                <Edit2 size={16} />
                              </Link>
                              {estimate.status === 'accepted' && (
                                <button
                                  onClick={() => handleConvert(estimate.id)}
                                  className="p-2 hover:bg-emerald-500/10 rounded-lg text-emerald-400 transition-colors"
                                  title="Elevate to Invoice"
                                >
                                  <ArrowRight size={16} />
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(estimate.id)}
                                className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 transition-colors"
                                title="Archive Proposal"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          ) : (
                            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-widest">
                              Converted
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
