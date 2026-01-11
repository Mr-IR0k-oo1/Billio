import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Plus, Download, Mail, Filter, Edit2, Search, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
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
  const [search, setSearch] = useState('');

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

  const filteredInvoices = invoices.filter(inv => {
    const matchesFilter = filter === 'all' || inv.status === filter;
    const matchesSearch = inv.client_name.toLowerCase().includes(search.toLowerCase()) || 
                          inv.id.toString().includes(search);
    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      <div className="page-header items-start md:items-center">
        <div>
          <h1>Invoices</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage and track all your billing documents</p>
        </div>
        <Link to="/invoices/new" className="btn-cta text-sm flex items-center gap-2 no-underline py-2">
          <Plus size={18} />
          <span>New Invoice</span>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Search by client or invoice ID..."
            className="pl-12 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative min-w-[200px]">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <select 
            className="pl-12 w-full"
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      <div className="glass-card p-0 overflow-hidden">
        <div className="table-container m-0">
          <table>
            <thead>
              <tr>
                <th className="pl-8">Invoice #</th>
                <th>Client</th>
                <th>Date</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th className="pr-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="group hover:bg-white/[0.02]">
                  <td className="pl-8">
                    <span className="font-mono text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded">
                      #{inv.id.toString().padStart(4, '0')}
                    </span>
                  </td>
                  <td className="font-medium text-white">{inv.client_name}</td>
                  <td className="text-muted-foreground">{new Date(inv.created_at).toLocaleDateString()}</td>
                  <td className="text-muted-foreground">{new Date(inv.due_date).toLocaleDateString()}</td>
                  <td className="font-bold text-white">${parseFloat(inv.total.toString()).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td>
                    <span className={`badge badge-${inv.status} flex items-center gap-1.5 w-fit`}>
                      {inv.status === 'paid' && <CheckCircle2 size={12} />}
                      {inv.status === 'sent' && <Clock size={12} />}
                      {inv.status === 'overdue' && <AlertCircle size={12} />}
                      {inv.status}
                    </span>
                  </td>
                  <td className="pr-8">
                    <div className="flex justify-end gap-1">
                      <Link to={`/invoices/${inv.id}`} title="Edit" className="p-2 text-muted-foreground hover:text-white hover:bg-white/10 rounded-lg transition-all">
                        <Edit2 size={16} />
                      </Link>
                      <button onClick={() => handleDownloadPdf(inv.id)} title="Download PDF" className="p-2 text-muted-foreground hover:text-white hover:bg-white/10 rounded-lg transition-all">
                        <Download size={16} />
                      </button>
                      <button onClick={() => handleSendEmail(inv.id)} title="Send via Email" className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all">
                        <Mail size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-muted-foreground py-20">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
                        <Search size={32} className="opacity-20" />
                      </div>
                      <p className="text-lg font-medium text-white">No invoices found</p>
                      <p className="max-w-[300px] mx-auto text-sm">We couldn't find any invoices matching your current filters or search query.</p>
                      <button 
                        onClick={() => {setFilter('all'); setSearch('');}}
                        className="text-blue-400 hover:underline text-sm font-medium mt-2"
                      >
                        Clear all filters
                      </button>
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
