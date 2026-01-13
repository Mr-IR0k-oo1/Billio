import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Plus, Trash2, Save, Send, Sparkles, Loader2, LayoutTemplate, Eye, X, Calendar, User, FileText, CheckCircle2, Info, Receipt, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MinimalistTemplate } from '../components/templates/MinimalistTemplate';
import { ProfessionalTemplate } from '../components/templates/ProfessionalTemplate';
import { ModernMinimalTemplate } from '../components/templates/ModernMinimalTemplate';
import { InstitutionalTemplate } from '../components/templates/InstitutionalTemplate';
import { SaaSTemplate } from '../components/templates/SaaSTemplate';
import { CreativeAgencyTemplate } from '../components/templates/CreativeAgencyTemplate';
import { DeveloperTemplate } from '../components/templates/DeveloperTemplate';
import { GlobalTemplate } from '../components/templates/GlobalTemplate';
import { CompactTemplate } from '../components/templates/CompactTemplate';
import { PremiumTemplate } from '../components/templates/PremiumTemplate';
import { SubscriptionTemplate } from '../components/templates/SubscriptionTemplate';
import { ComplianceTemplate } from '../components/templates/ComplianceTemplate';

interface LineItem {
  id?: number;
  description: string;
  quantity: number;
  unit_price: number;
}

interface Client {
  id: number;
  name: string;
  email: string;
  address: string;
}

export default function InvoiceEditor({ isEstimate = false }: { isEstimate?: boolean }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const typeLabel = isEstimate ? 'Estimate' : 'Invoice';
  const apiEndpoint = isEstimate ? '/estimates' : '/invoices';

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiNotes, setAiNotes] = useState('');
  
  const [formData, setFormData] = useState({
    client_id: '',
    status: 'draft',
    due_date: new Date(Date.now() + (isEstimate ? 30 : 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    issue_date: new Date().toISOString().split('T')[0],
    items: [] as LineItem[],
    subtotal: 0,
    tax_rate: 0,
    tax_amount: 0,
    discount: 0,
    notes: '',
    terms: '',
    template_type: 'minimalist' as 'minimalist' | 'professional' | 'modern' | 'institutional' | 'saas' | 'agency' | 'developer' | 'global' | 'compact' | 'premium' | 'subscription' | 'compliance'
  });

  const [selectedTemplate, setSelectedTemplate] = useState<'minimalist' | 'professional' | 'modern' | 'institutional' | 'saas' | 'agency' | 'developer' | 'global' | 'compact' | 'premium' | 'subscription' | 'compliance'>('compliance');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchClients();
    fetchProducts();
    if (isEdit) fetchDocument();
  }, [id, isEstimate]);

  const fetchClients = async () => {
    try {
      const data = await api.get('/clients');
      setClients(data);
    } catch (err) {
      console.error('Failed to fetch clients');
    }
  };

  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    const isDemo = token?.startsWith('demo-token-');
    if (isDemo) {
      setProducts([
        { id: 1, name: 'Web Development', unit_price: 150.00, description: 'High-quality React/Next.js development services' },
        { id: 2, name: 'UI/UX Design', unit_price: 120.00, description: 'Custom interface and user experience design' },
        { id: 3, name: 'SEO Optimization', unit_price: 85.00, description: 'Comprehensive search engine optimization audit and implementation' },
      ]);
      return;
    }
    try {
      const data = await api.get('/products');
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products');
    }
  };

  const fetchDocument = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const isDemo = token?.startsWith('demo-token-');

    if (isDemo) {
      const mockDocument = {
        client_id: 1,
        status: 'draft',
        due_date: new Date(Date.now() + 86400000 * 7).toISOString(),
        issue_date: new Date().toISOString(),
        items: [
          { description: 'Premium Web Development', quantity: 20, unit_price: 150.00 },
          { description: 'UI/UX Design Phase 1', quantity: 1, unit_price: 1200.00 }
        ],
        subtotal: 4200.00,
        tax_rate: 10,
        tax_amount: 420.00,
        discount: 0,
        notes: 'Demo mode document',
        terms: 'Standard net 30 terms',
        template_type: 'professional'
      };
      
      setFormData({
        client_id: mockDocument.client_id.toString(),
        status: mockDocument.status,
        due_date: mockDocument.due_date.split('T')[0],
        issue_date: mockDocument.issue_date.split('T')[0],
        items: mockDocument.items,
        subtotal: mockDocument.subtotal,
        tax_rate: mockDocument.tax_rate,
        tax_amount: mockDocument.tax_amount,
        discount: mockDocument.discount,
        notes: mockDocument.notes,
        terms: mockDocument.terms,
        template_type: mockDocument.template_type as any
      });
      setSelectedTemplate(mockDocument.template_type as any);
      setLoading(false);
      return;
    }

    try {
      const data = await api.get(`${apiEndpoint}/${id}`);
      setFormData({
        client_id: data.client_id?.toString() || '',
        status: data.status,
        due_date: new Date(data.expiry_date || data.due_date).toISOString().split('T')[0],
        issue_date: new Date(data.issue_date).toISOString().split('T')[0],
        items: data.items.map((it: any) => ({ ...it, unit_price: parseFloat(it.unit_price), quantity: parseFloat(it.quantity) })),
        subtotal: parseFloat(data.subtotal || 0),
        tax_rate: parseFloat(data.tax_rate || 0),
        tax_amount: parseFloat(data.tax_amount || 0),
        discount: parseFloat(data.discount || 0),
        notes: data.notes || '',
        terms: data.terms || '',
        template_type: (data.template_type as any) || 'minimalist'
      });
      setSelectedTemplate((data.template_type as any) || 'minimalist');
    } catch (err) {
      console.error(err);
      navigate(isEstimate ? '/estimates' : '/invoices');
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, unit_price: 0 }]
    });
  };

  const removeItem = (index: number) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData({ ...formData, items: newItems });
  };

  const updateItem = (index: number, field: keyof LineItem, value: any) => {
    const newItems = [...formData.items];
    (newItems[index] as any)[field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((acc: number, item: LineItem) => acc + (item.quantity * item.unit_price), 0);
  };

  const totals = (() => {
    const subtotal = calculateSubtotal();
    const discountAmount = formData.discount;
    const taxAmount = (subtotal - discountAmount) * (formData.tax_rate / 100);
    const total = subtotal - discountAmount + taxAmount;
    return { subtotal, discountAmount, taxAmount, total };
  })();

  const handleSave = async () => {
    if (!formData.client_id) {
      alert('Please select a client');
      return;
    }
    
    setLoading(true);
    try {
      const payload = {
        ...formData,
        client_id: parseInt(formData.client_id),
        subtotal: totals.subtotal,
        tax_amount: totals.taxAmount,
        total: totals.total,
        template_type: selectedTemplate,
        [isEstimate ? 'expiry_date' : 'due_date']: formData.due_date,
      };

      if (isEdit) {
        await api.put(`${apiEndpoint}/${id}`, payload);
      } else {
        await api.post(apiEndpoint, payload);
      }
      navigate(isEstimate ? '/estimates' : '/invoices');
    } catch (err: any) {
      alert(err.response?.data?.error || `Failed to save ${typeLabel}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAiDescribe = async () => {
    if (!aiNotes.trim()) return;
    setAiLoading(true);
    try {
      const res = await api.post('/ai/describe-line-items', { notes: aiNotes });
      if (res.items) {
        const newItems = res.items.map((item: any) => ({
          description: item.description,
          quantity: item.quantity || 1,
          unit_price: item.unit_price || 0
        }));
        setFormData({ ...formData, items: [...formData.items, ...newItems] });
        setAiNotes('');
      }
    } catch (err) {
      alert('AI failed to process notes. Make sure OpenAI API key is set.');
    } finally {
      setAiLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="max-w-6xl mx-auto pb-20"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="page-header mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${isEstimate ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'}`}>
              Professional {typeLabel}
            </span>
            {isEdit && <span className="text-muted-foreground font-mono text-xs">#{id}</span>}
          </div>
          <h1 className="text-4xl font-black">{isEdit ? `Refine ${typeLabel}` : `Generate ${typeLabel}`}</h1>
          <p className="text-muted-foreground text-sm mt-1">Configure your project details and financial terms below.</p>
        </div>
        <div className="flex gap-4">
          <button 
            className="btn-secondary px-8 py-3 text-sm font-bold tracking-tight hover:bg-white/5 transition-all" 
            onClick={() => navigate(isEstimate ? '/estimates' : '/invoices')}
          >
            Cancel
          </button>
          <button 
            className={`btn-cta flex items-center gap-3 px-8 py-3 text-sm font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] ${isEstimate ? 'shadow-amber-500/10' : 'shadow-blue-500/10'}`} 
            onClick={handleSave} 
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Confirm & Save
          </button>
        </div>
      </div>

      {showPreview && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6 md:p-12 animate-in fade-in duration-300">
          <div className="glass-card w-full max-w-5xl h-full flex flex-col p-0 overflow-hidden shadow-2xl border-white/10">
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <Eye size={20} className="text-blue-400" />
                <h3 className="font-bold">{typeLabel} Preview</h3>
              </div>
              <button 
                onClick={() => setShowPreview(false)} 
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 text-muted-foreground hover:text-white transition-all"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 md:p-16 bg-[#0a0a0a] flex justify-center">
              <div className="w-full max-w-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                {(() => {
                  const client = clients.find(c => c.id === parseInt(formData.client_id));
                  const data = {
                    id: id || 'DRAFT',
                    date: new Date().toLocaleDateString(),
                    due_date: formData.due_date,
                    items: formData.items,
                    total: totals.total
                  };
                  const mockClient = { name: 'Client Name', email: 'email@example.com', address: '123 Client St' };
                  
                  switch(selectedTemplate) {
                    case 'minimalist': return <MinimalistTemplate data={data} client={client || mockClient} />;
                    case 'professional': return <ProfessionalTemplate data={data} client={client || mockClient} />;
                    case 'modern': return <ModernMinimalTemplate data={data} client={client || mockClient} />;
                    case 'institutional': return <InstitutionalTemplate data={data} client={client || mockClient} />;
                    case 'saas': return <SaaSTemplate data={data} client={client || mockClient} />;
                    case 'agency': return <CreativeAgencyTemplate data={data} client={client || mockClient} />;
                    case 'developer': return <DeveloperTemplate data={data} client={client || mockClient} />;
                    case 'global': return <GlobalTemplate data={data} client={client || mockClient} />;
                    case 'compact': return <CompactTemplate data={data} client={client || mockClient} />;
                    case 'premium': return <PremiumTemplate data={data} client={client || mockClient} />;
                    case 'subscription': return <SubscriptionTemplate data={data} client={client || mockClient} />;
                    case 'compliance': return <ComplianceTemplate data={data} client={client || mockClient} />;
                  }
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <motion.div variants={itemVariants} className="glass-card !p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors duration-500" />
            
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shadow-inner">
                <User size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Counterparty</h3>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-0.5">Recipient Information</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="flex items-center gap-2">
                  <User size={14} className="text-blue-400" /> Client
                </label>
                <select 
                  value={formData.client_id} 
                  onChange={e => setFormData({ ...formData, client_id: e.target.value })}
                  required
                >
                  <option value="">Select a client</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              
              <div className="form-group">
                <label className="flex items-center gap-2">
                  <FileText size={14} className="text-blue-400" /> Status
                </label>
                <select 
                  value={formData.status} 
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  disabled
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value={isEstimate ? 'accepted' : 'overdue'}>{isEstimate ? 'Accepted' : 'Overdue'}</option>
                </select>
              </div>

              <div className="form-group">
                <label className="flex items-center gap-2">
                  <Calendar size={14} className="text-blue-400" /> {typeLabel} Date
                </label>
                <input 
                  type="date" 
                  value={formData.issue_date} 
                  onChange={e => setFormData({ ...formData, issue_date: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="flex items-center gap-2">
                  <Calendar size={14} className="text-blue-400" /> {isEstimate ? 'Expiry' : 'Due'} Date
                </label>
                <input 
                  type="date" 
                  value={formData.due_date} 
                  onChange={e => setFormData({ ...formData, due_date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group col-span-1 md:col-span-2">
                <label className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Document Notes (Visible to Client)
                </label>
                <textarea 
                  placeholder="Terms, bank details, or project summary..."
                  className="w-full h-24 bg-white/[0.02] border-white/5 focus:border-blue-500/30 transition-all rounded-xl p-4 text-sm"
                  value={formData.terms}
                  onChange={e => setFormData({ ...formData, terms: e.target.value })}
                />
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card !p-0 overflow-hidden relative group">
            <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white/[0.01]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-inner">
                  <Receipt size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Line Items</h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mt-0.5">Service & Product Breakdown</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <select 
                  className="text-xs py-2 px-4 w-56 bg-white/5 border-white/10 rounded-xl focus:ring-blue-500/20 cursor-pointer"
                  onChange={(e) => {
                    const product = products.find(p => p.id === parseInt(e.target.value));
                    if (product) {
                      setFormData({
                        ...formData,
                        items: [...formData.items, { 
                          description: product.name, 
                          quantity: 1, 
                          unit_price: product.unit_price 
                        }]
                      });
                    }
                    e.target.value = "";
                  }}
                >
                  <option value="">Quick Add from Catalog...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - ${p.unit_price}</option>
                  ))}
                </select>
                <button 
                  className="btn-secondary !bg-blue-500/10 !text-blue-400 !border-blue-500/20 py-2 px-4 text-xs flex items-center gap-2 hover:!bg-blue-500/20 transition-all font-bold rounded-xl" 
                  onClick={addItem}
                >
                  <Plus size={16} /> New Item
                </button>
              </div>
            </div>
            
            <div className="table-container m-0">
              <table className="w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-white/[0.03]">
                    <th className="pl-8 py-5 text-left text-[10px] uppercase tracking-widest text-muted-foreground font-black border-b border-white/5">Description of Service</th>
                    <th className="w-24 py-5 text-center text-[10px] uppercase tracking-widest text-muted-foreground font-black border-b border-white/5">Qty</th>
                    <th className="w-32 py-5 text-left text-[10px] uppercase tracking-widest text-muted-foreground font-black border-b border-white/5">Rate</th>
                    <th className="w-32 py-5 text-left text-[10px] uppercase tracking-widest text-muted-foreground font-black border-b border-white/5">Total</th>
                    <th className="w-16 pr-8 py-5 border-b border-white/5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence initial={false}>
                    {formData.items.map((item, idx) => (
                      <motion.tr 
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10, height: 0 }}
                        className="group hover:bg-white/[0.01] transition-colors"
                      >
                        <td className="pl-8 py-4">
                          <input 
                            type="text" 
                            placeholder="Describe work performed..." 
                            className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium text-white placeholder:text-white/10"
                            value={item.description}
                            onChange={e => updateItem(idx, 'description', e.target.value)}
                          />
                        </td>
                        <td className="py-4">
                          <div className="flex justify-center">
                            <input 
                              type="number" 
                              className="w-16 bg-white/5 border-none focus:ring-1 focus:ring-blue-500/30 rounded-lg text-sm text-center py-1.5"
                              value={item.quantity}
                              onChange={e => updateItem(idx, 'quantity', parseFloat(e.target.value))}
                            />
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="relative">
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                            <input 
                              type="number" 
                              step="0.01"
                              className="w-full pl-3 bg-transparent border-none focus:ring-0 text-sm font-medium"
                              value={item.unit_price}
                              onChange={e => updateItem(idx, 'unit_price', parseFloat(e.target.value))}
                            />
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="text-sm font-bold text-white">
                            ${(item.quantity * item.unit_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="pr-8 py-4 text-right">
                          <button 
                            onClick={() => removeItem(idx)} 
                            className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  {formData.items.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-muted-foreground py-24 bg-white/[0.01]">
                        <div className="flex flex-col items-center gap-4 opacity-20">
                          <Plus size={48} />
                          <p className="text-sm font-medium tracking-widest uppercase">Awaiting line items...</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          <div className="p-8 flex flex-col md:flex-row justify-between items-start gap-12 bg-white/[0.02]">
            <div className="w-full md:max-w-md space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Info size={16} />
                  </div>
                  <h4 className="font-bold text-sm">Financial Overrides</h4>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-2 block">Fixed Discount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                      <input 
                        type="number" 
                        step="0.01"
                        className="pl-8 w-full h-12 bg-white/5 border-white/5 focus:bg-white/10 transition-all rounded-xl text-sm"
                        value={formData.discount}
                        onChange={e => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-2 block">Value Added Tax</label>
                    <div className="relative">
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">%</span>
                      <input 
                        type="number" 
                        step="0.1"
                        className="pr-8 w-full h-12 bg-white/5 border-white/5 focus:bg-white/10 transition-all rounded-xl text-sm"
                        value={formData.tax_rate}
                        onChange={e => setFormData({ ...formData, tax_rate: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-72 space-y-4">
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 space-y-4 shadow-2xl">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-medium">Subtotal</span>
                  <span className="font-bold text-white">${totals.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                {formData.discount > 0 && (
                  <div className="flex justify-between items-center text-xs text-red-400">
                    <span className="font-medium">Total Discount</span>
                    <span className="font-bold">-${totals.discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-medium">Tax ({formData.tax_rate}%)</span>
                  <span className="font-bold text-white">${totals.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-muted-foreground text-[10px] font-black mb-1 uppercase tracking-[0.2em]">Grand Total</p>
                  <h2 className={`text-4xl font-black ${isEstimate ? 'text-amber-500' : 'text-blue-500'} tracking-tighter`}>
                    ${totals.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </h2>
                </div>
              </div>
            </div>
          </div>
          </motion.div>
        </div>

        <div className="space-y-10">
          <motion.div variants={itemVariants} className="glass-card relative overflow-hidden bg-gradient-to-br from-violet-600/10 via-transparent to-transparent border-violet-500/20 shadow-2xl shadow-violet-500/5 !p-8">
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
              <Sparkles size={80} className="text-violet-400" />
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-violet-100">AI Intelligent Draft</h3>
                <p className="text-[10px] text-violet-400/80 uppercase font-black tracking-widest">Natural Language Processing</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-6">
              Save time! Write a brief summary of your work and our AI will break it down into professional line items.
            </p>
            <textarea 
              placeholder="e.g. Developed a brand identity, including logo design, color palette, and 10 social media templates."
              className="w-full h-32 text-xs bg-black/40 border-white/5 mb-4 focus:border-violet-500/50"
              value={aiNotes}
              onChange={e => setAiNotes(e.target.value)}
            />
            <button 
              className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-900/20 disabled:opacity-50"
              onClick={handleAiDescribe}
              disabled={aiLoading || !aiNotes.trim()}
            >
              {aiLoading ? <Loader2 className="animate-spin" size={16} /> : <><Sparkles size={14} /> Generate Items</>}
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card !p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                <LayoutTemplate size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold">Visual Identity</h3>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Template Selection</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {(['minimalist', 'professional', 'modern', 'institutional', 'saas', 'agency', 'developer', 'global', 'compact', 'premium', 'subscription', 'compliance'] as const).map(style => (
                <button 
                  key={style}
                  onClick={() => setSelectedTemplate(style)}
                  className={`w-full p-5 rounded-2xl border flex items-center justify-between transition-all duration-300 group ${
                    selectedTemplate === style 
                    ? 'bg-blue-500/10 border-blue-500/40 text-white ring-1 ring-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
                    : 'bg-white/[0.01] border-white/5 text-muted-foreground hover:bg-white/[0.04] hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full transition-all duration-500 ${selectedTemplate === style ? 'bg-blue-400 scale-150 shadow-[0_0_10px_rgba(96,165,250,0.8)]' : 'bg-white/10 group-hover:bg-white/30'}`} />
                    <span className="capitalize font-bold tracking-tight">{style} Edition</span>
                  </div>
                  {selectedTemplate === style && <CheckCircle2 size={18} className="text-blue-400" />}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card !p-8 shadow-2xl bg-white/[0.02]">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                <CreditCard size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold">Quick Actions</h3>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Execution Panel</p>
              </div>
            </div>
            <div className="space-y-4">
              <button 
                className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-3 group"
                onClick={() => setShowPreview(true)}
              >
                <Eye size={18} className="text-blue-400 group-hover:scale-110 transition-transform" /> 
                Review PDF View
              </button>
              <button 
                className="w-full py-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-sm font-black hover:bg-blue-500/20 text-blue-400 transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-500/5 group"
              >
                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
                Dispatch {typeLabel}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}


