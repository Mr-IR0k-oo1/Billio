import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Plus, Download, Mail, Filter, Search, CheckCircle2, Clock, AlertCircle, Hash, Activity, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    const token = localStorage.getItem('token');
    const isDemo = token?.startsWith('demo-token-');

    if (isDemo) {
      const mockInvoices: Invoice[] = [
        { id: 101, client_name: 'Acme Corp', created_at: new Date().toISOString(), due_date: new Date().toISOString(), total: 4500.00, status: 'paid' },
        { id: 102, client_name: 'Global Tech', created_at: new Date().toISOString(), due_date: new Date(Date.now() + 86400000 * 5).toISOString(), total: 1200.50, status: 'sent' },
        { id: 103, client_name: 'Stark Industries', created_at: new Date().toISOString(), due_date: new Date(Date.now() - 86400000 * 2).toISOString(), total: 8900.00, status: 'overdue' },
        { id: 104, client_name: 'Wayne Ent.', created_at: new Date().toISOString(), due_date: new Date(Date.now() + 86400000 * 10).toISOString(), total: 3200.00, status: 'draft' },
        { id: 105, client_name: 'Oscorp', created_at: new Date().toISOString(), due_date: new Date(Date.now() - 86400000 * 15).toISOString(), total: 560.00, status: 'paid' },
      ];
      setInvoices(mockInvoices);
      return;
    }

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
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto space-y-10 pb-20"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
        <div>
          <h1 className="text-5xl font-black tracking-tight text-white mb-2">
            Ledger <span className="premium-gradient-text">Registry</span>
          </h1>
          <p className="text-muted-foreground text-sm font-medium flex items-center gap-2">
            <Activity size={14} className="text-blue-500" />
            Managing <span className="text-white font-bold">{filteredInvoices.length}</span> documents in the current registry view.
          </p>
        </div>
        <Link to="/invoices/new" className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-black uppercase tracking-widest transition-all no-underline text-white flex items-center gap-2 shadow-xl shadow-blue-900/20">
          <Plus size={18} />
          <span>Genesis Invoice</span>
        </Link>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row gap-6">
        <div className="relative flex-grow group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-muted-foreground group-focus-within:text-blue-500 transition-colors" size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Search by counterparty identity or mandate ID..."
            className="pl-12 w-full bg-white/5 border-white/10 rounded-2xl py-4 focus:ring-2 ring-blue-500/20 transition-all text-sm font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <div className="relative min-w-[200px] group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Filter className="text-muted-foreground group-focus-within:text-blue-500 transition-colors" size={18} />
            </div>
            <select 
              className="pl-12 w-full bg-white/5 border-white/10 rounded-2xl py-4 appearance-none focus:ring-2 ring-blue-500/20 transition-all text-sm font-black uppercase tracking-widest"
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">Universe</option>
              <option value="draft">Drafts</option>
              <option value="sent">Transmitted</option>
              <option value="paid">Settled</option>
              <option value="overdue">Defaulted</option>
            </select>
          </div>
          <button 
            onClick={() => {setFilter('all'); setSearch('');}}
            className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white hover:bg-white/10 transition-all"
          >
            Reset
          </button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="glass-card !p-0 overflow-hidden relative border-white/5">
        <div className="table-container m-0">
          <table className="w-full">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="pl-10 py-5 text-left text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black">Mandate</th>
                <th className="py-5 text-left text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black">Counterparty</th>
                <th className="py-5 text-left text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black">Timeline</th>
                <th className="py-5 text-left text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black">Amount</th>
                <th className="py-5 text-left text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black">State</th>
                <th className="pr-10 py-5 text-right text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black">Terminal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {filteredInvoices.map((inv, idx) => (
                  <motion.tr 
                    key={inv.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.02 }}
                    className="group hover:bg-white/[0.01] transition-colors cursor-pointer"
                  >
                    <td className="pl-10 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-blue-500/50 border border-white/10">
                          <Hash size={14} />
                        </div>
                        <span className="font-mono text-xs font-black text-white/50 tracking-widest">
                          {inv.id.toString().padStart(4, '0')}
                        </span>
                      </div>
                    </td>
                    <td className="py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center text-xs font-black border border-white/5">
                          {inv.client_name.charAt(0)}
                        </div>
                        <span className="font-bold text-white tracking-tight">{inv.client_name}</span>
                      </div>
                    </td>
                    <td className="py-6 text-sm text-muted-foreground">
                      <div className="flex flex-col">
                        <span className="text-white/80 font-bold">{new Date(inv.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        <span className="text-[10px] uppercase tracking-tighter opacity-50">Issued</span>
                      </div>
                    </td>
                    <td className="py-6 text-sm">
                      <div className="inline-flex items-center px-3 py-1 bg-white/5 border border-white/5 rounded-lg font-black text-white group-hover:border-white/10 transition-all">
                        ${parseFloat(inv.total.toString()).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td className="py-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border badge-${inv.status}`}>
                        {inv.status === 'paid' && <CheckCircle2 size={10} />}
                        {inv.status === 'sent' && <Clock size={10} />}
                        {inv.status === 'overdue' && <AlertCircle size={10} />}
                        {inv.status}
                      </span>
                    </td>
                    <td className="pr-10 py-6">
                      <div className="flex justify-end items-center gap-2">
                        <Link to={`/invoices/${inv.id}`} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-muted-foreground hover:text-white hover:bg-blue-600 hover:border-blue-500 transition-all">
                          <Eye size={16} />
                        </Link>
                        <button onClick={() => handleDownloadPdf(inv.id)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-muted-foreground hover:text-white hover:bg-blue-600 hover:border-blue-500 transition-all">
                          <Download size={16} />
                        </button>
                        <button onClick={() => handleSendEmail(inv.id)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-blue-400/50 hover:text-white hover:bg-blue-600 hover:border-blue-500 transition-all">
                          <Mail size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-muted-foreground py-32">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center border border-white/5 mb-2 relative">
                        <Search size={40} className="opacity-10" />
                        <div className="absolute inset-0 bg-blue-500/5 blur-2xl rounded-full" />
                      </div>
                      <h3 className="text-xl font-black text-white tracking-tight">No matching mandates</h3>
                      <p className="max-w-[320px] mx-auto text-sm leading-relaxed opacity-60 font-medium">Your search query or filter selection yielded zero results in the current ledger registry.</p>
                      <button 
                        onClick={() => {setFilter('all'); setSearch('');}}
                        className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-blue-400 hover:bg-white/10 transition-all mt-4"
                      >
                        Reset Universal Filters
                      </button>
                    </motion.div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
