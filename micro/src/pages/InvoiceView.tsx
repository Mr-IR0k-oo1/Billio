import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Edit2, Send, CheckCircle, ArrowLeft, Printer } from 'lucide-react';
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
        // In a real app we might fetch client details separately or they come with the invoice
        // For now, let's assume the invoice object has client info attached or we fetch it
        // based on the response structure I saw earlier, the invoice endpoint joins client data
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
      toast.success('Invoice sent successfully');
      fetchInvoice(); // Update status
    } catch (err) {
      toast.error('Failed to send invoice');
    }
  };

  const handleMarkPaid = async () => {
    try {
      // Assuming we have an endpoint or we just update status
      // Using the update endpoint for now or payment recording
      await api.post(`/invoices/${id}/payments`, {
        amount: invoice.total,
        payment_method: 'Manual',
        payment_date: new Date().toISOString().split('T')[0],
        notes: 'Marked as paid manually'
      });
      toast.success('Invoice marked as paid');
      fetchInvoice();
    } catch (err) {
      toast.error('Failed to mark as paid');
    }
  };

  const handleDownload = async () => {
    try {
      window.print(); // Simple browser print for now
    } catch (err) {
      toast.error('Failed to download');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!invoice) return <div>Invoice not found</div>;

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
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '40px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link to="/invoices" className="btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', paddingLeft: 0 }}>
          <ArrowLeft size={18} /> Back to Invoices
        </Link>
      </div>

      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h1>Invoice #{data.id}</h1>
          <span className={`badge badge-${invoice.status}`}>
            {invoice.status}
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to={`/invoices/${id}/edit`} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <Edit2 size={18} /> Edit
          </Link>
          <button onClick={handleDownload} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Printer size={18} /> Print/PDF
          </button>
          {invoice.status !== 'paid' && (
            <>
              <button onClick={handleSend} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Send size={18} /> Send
              </button>
              <button onClick={handleMarkPaid} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={18} /> Mark Paid
              </button>
            </>
          )}
        </div>
      </div>

      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '40px', background: 'white', color: 'black' }}>
          <TemplateComponent data={data} client={client || { name: 'Unknown Client', email: '', address: '' }} />
        </div>
      </div>
    </div>
  );
}
