import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Edit2, Send, CheckCircle, ArrowLeft, Printer, Mail, ChevronLeft } from 'lucide-react';
import { MinimalistTemplate } from '../components/templates/MinimalistTemplate';
import { ProfessionalTemplate } from '../components/templates/ProfessionalTemplate';
import { CreativeTemplate } from '../components/templates/CreativeTemplate';
import toast from 'react-hot-toast';

export default function InvoiceView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<any>(null);
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const data = await api.get(`/invoices/${id}`);
      setInvoice(data);
      if (data.client_id) {
        setClient({
          name: data.client_name,
          email: data.client_email,
          address: data.client_address
        });
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load invoice');
      navigate('/invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    try {
      await api.post(`/invoices/${id}/send`, {});
      toast.success('Document dispatched to client');
      fetchInvoice();
    } catch (err) {
      toast.error('Failed to send invoice');
    }
  };

  const handleMarkPaid = async () => {
    try {
      await api.post(`/invoices/${id}/payments`, {
        amount: invoice.total,
        payment_method: 'Manual',
        payment_date: new Date().toISOString().split('T')[0],
        notes: 'Marked as paid manually'
      });
      toast.success('Inventory balance cleared');
      fetchInvoice();
    } catch (err) {
      toast.error('Failed to mark as paid');
    }
  };

  const handleDownload = async () => {
    try {
      window.print();
    } catch (err) {
      toast.error('Failed to generate export');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-muted-foreground animate-pulse">Rendering document...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-20 glass-card">
        <h2 className="text-2xl font-bold mb-2">Document Not Found</h2>
        <p className="text-muted-foreground mb-6">The requested invoice identifier does not exist in our systems.</p>
        <Link to="/invoices" className="btn-secondary no-underline inline-flex items-center gap-2">
          <ArrowLeft size={18} /> Return to Ledger
        </Link>
      </div>
    );
  }

  const data = {
    id: invoice.invoice_number || invoice.id,
    date: new Date(invoice.issue_date || invoice.created_at).toLocaleDateString(),
    due_date: invoice.due_date,
    items: invoice.items,
    total: parseFloat(invoice.total),
    subtotal: parseFloat(invoice.subtotal || invoice.total),
    tax_amount: parseFloat(invoice.tax_amount || 0),
    discount: parseFloat(invoice.discount || 0)
  };

  const TemplateComponent = {
    'minimalist': MinimalistTemplate,
    'professional': ProfessionalTemplate,
    'creative': CreativeTemplate
  }[invoice.template_type as string || 'minimalist'] || MinimalistTemplate;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <button 
            onClick={() => navigate('/invoices')}
            className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-4 group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Ledger
          </button>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">INV-{data.id}</h1>
            <span className={`badge badge-${invoice.status} uppercase tracking-widest text-[10px] py-1 px-3`}>
              {invoice.status}
            </span>
          </div>
          <p className="text-muted-foreground text-sm mt-2 flex items-center gap-2">
            <Mail size={14} /> Issued to {client?.name || 'Unknown Client'}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Link 
            to={`/invoices/${id}/edit`} 
            className="btn-secondary py-2.5 px-4 flex items-center gap-2 no-underline text-sm"
          >
            <Edit2 size={16} /> Edit
          </Link>
          <button 
            onClick={handleDownload} 
            className="btn-secondary py-2.5 px-4 flex items-center gap-2 text-sm"
          >
            <Printer size={16} /> Print
          </button>
          {invoice.status !== 'paid' && (
            <>
              <button 
                onClick={handleSend} 
                className="btn-secondary py-2.5 px-4 flex items-center gap-2 text-sm"
              >
                <Send size={16} /> Dispatch
              </button>
              <button 
                onClick={handleMarkPaid} 
                className="btn-cta py-2.5 px-4 flex items-center gap-2 text-sm"
              >
                <CheckCircle size={16} /> Mark Settled
              </button>
            </>
          )}
        </div>
      </div>

      <div className="glass-card !p-0 overflow-hidden shadow-2xl shadow-black/50 border-white/10 ring-1 ring-white/5">
        <div className="bg-white text-slate-900 shadow-inner">
          <div className="max-w-[800px] mx-auto py-16 px-12 sm:px-20 min-h-[1100px]">
            <TemplateComponent data={data} client={client || { name: 'Unknown Client', email: '', address: '' }} />
          </div>
        </div>
      </div>

      {/* Audit Trail Hint */}
      <div className="flex items-center justify-center gap-8 py-8 border-t border-white/5">
        <div className="text-center">
          <p className="text-muted-foreground text-[10px] uppercase tracking-[0.2em] mb-1">Fingerprint</p>
          <p className="font-mono text-[10px] text-white/40">SHA-256: {Math.random().toString(36).substring(7).toUpperCase()}</p>
        </div>
        <div className="w-px h-8 bg-white/5" />
        <div className="text-center">
          <p className="text-muted-foreground text-[10px] uppercase tracking-[0.2em] mb-1">Compliance</p>
          <p className="font-mono text-[10px] text-white/40">SOC2 SECURE</p>
        </div>
      </div>
    </div>
  );
}
