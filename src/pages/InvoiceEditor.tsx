import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Plus, Trash2, Save, Send, Sparkles, Loader2, LayoutTemplate, Eye, X, Calendar, User, FileText, Briefcase, CheckCircle2 } from 'lucide-react';
import { MinimalistTemplate } from '../components/templates/MinimalistTemplate';
import { ProfessionalTemplate } from '../components/templates/ProfessionalTemplate';
import { CreativeTemplate } from '../components/templates/CreativeTemplate';

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
  const [aiLoading, setAiLoading] = useState(false);
  const [aiNotes, setAiNotes] = useState('');
  
  const [formData, setFormData] = useState({
    client_id: '',
    status: 'draft',
    due_date: new Date(Date.now() + (isEstimate ? 30 : 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    issue_date: new Date().toISOString().split('T')[0],
    items: [] as LineItem[],
    notes: '',
    terms: ''
  });

  const [selectedTemplate, setSelectedTemplate] = useState<'minimalist' | 'professional' | 'creative'>('minimalist');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchClients();
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

  const fetchDocument = async () => {
    setLoading(true);
    try {
      const data = await api.get(`${apiEndpoint}/${id}`);
      setFormData({
        client_id: data.client_id?.toString() || '',
        status: data.status,
        due_date: new Date(data.expiry_date || data.due_date).toISOString().split('T')[0],
        issue_date: new Date(data.issue_date).toISOString().split('T')[0],
        items: data.items.map((it: any) => ({ ...it, unit_price: parseFloat(it.unit_price), quantity: parseFloat(it.quantity) })),
        notes: data.notes || '',
        terms: data.terms || ''
      });
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

  const calculateTotal = () => {
    return formData.items.reduce((acc: number, item: LineItem) => acc + (item.quantity * item.unit_price), 0);
  };

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
        total: calculateTotal(),
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

  return (
    <div className="max-w-6xl mx-auto">
      <div className="page-header">
        <div>
          <h1>{isEdit ? `Edit ${typeLabel} #${id}` : `Create New ${typeLabel}`}</h1>
          <p className="text-muted-foreground text-sm mt-1">Design and customize your professional {typeLabel.toLowerCase()}</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary px-6" onClick={() => navigate(isEstimate ? '/estimates' : '/invoices')}>Cancel</button>
          <button className="btn-cta flex items-center gap-2" onClick={handleSave} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Save {typeLabel}
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
                    total: calculateTotal()
                  };
                  const mockClient = { name: 'Client Name', email: 'email@example.com', address: '123 Client St' };
                  
                  switch(selectedTemplate) {
                    case 'minimalist': return <MinimalistTemplate data={data} client={client || mockClient} />;
                    case 'professional': return <ProfessionalTemplate data={data} client={client || mockClient} />;
                    case 'creative': return <CreativeTemplate data={data} client={client || mockClient} />;
                  }
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                <Briefcase size={16} />
              </div>
              <h3 className="text-lg font-bold">General Details</h3>
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
            </div>
          </div>

          <div className="glass-card">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500">
                  <FileText size={16} />
                </div>
                <h3 className="text-lg font-bold">Line Items</h3>
              </div>
              <button 
                className="btn-secondary py-2 text-xs flex items-center gap-2 hover:bg-white/10" 
                onClick={addItem}
              >
                <Plus size={14} /> Add Manual Item
              </button>
            </div>
            
            <div className="table-container -mx-8">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/[0.02]">
                    <th className="pl-8">Description</th>
                    <th className="w-24">Qty</th>
                    <th className="w-32">Price</th>
                    <th className="w-32">Total</th>
                    <th className="w-16 pr-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.01]">
                      <td className="pl-8">
                        <input 
                          type="text" 
                          placeholder="What services were provided?" 
                          className="w-full h-10 text-sm bg-transparent border-none focus:bg-white/5"
                          value={item.description}
                          onChange={e => updateItem(idx, 'description', e.target.value)}
                        />
                      </td>
                      <td>
                        <input 
                          type="number" 
                          className="w-full h-10 text-sm bg-transparent border-none focus:bg-white/5 text-center"
                          value={item.quantity}
                          onChange={e => updateItem(idx, 'quantity', parseFloat(e.target.value))}
                        />
                      </td>
                      <td>
                        <input 
                          type="number" 
                          step="0.01"
                          className="w-full h-10 text-sm bg-transparent border-none focus:bg-white/5"
                          value={item.unit_price}
                          onChange={e => updateItem(idx, 'unit_price', parseFloat(e.target.value))}
                        />
                      </td>
                      <td className="font-bold text-white text-sm">
                        ${(item.quantity * item.unit_price).toFixed(2)}
                      </td>
                      <td className="pr-8 text-right">
                        <button 
                          onClick={() => removeItem(idx)} 
                          className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {formData.items.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-muted-foreground py-16 bg-white/[0.01]">
                        <div className="flex flex-col items-center gap-2 opacity-40">
                          <Plus size={32} />
                          <p className="text-sm">No items added yet</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-8 flex flex-col md:flex-row justify-between items-end gap-6 pt-8 border-t border-white/5">
              <div className="w-full md:max-w-md pt-4">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 block">Notes & Terms</label>
                <textarea 
                  placeholder="Additional notes for your client..."
                  className="w-full h-32 text-sm bg-white/2"
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <div className="text-right pb-4">
                <p className="text-muted-foreground text-sm font-medium mb-1 uppercase tracking-tighter">Amount Due</p>
                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                  ${calculateTotal().toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-card relative overflow-hidden bg-gradient-to-br from-violet-600/10 to-transparent border-violet-500/20">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles size={64} className="text-violet-400" />
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={20} className="text-violet-400" />
              <h3 className="font-bold text-violet-100">AI Line Item Generator</h3>
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
          </div>

          <div className="glass-card">
            <div className="flex items-center gap-2 mb-6">
              <LayoutTemplate size={20} className="text-blue-400" />
              <h3 className="font-bold">Visual Theme</h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {(['minimalist', 'professional', 'creative'] as const).map(style => (
                <button 
                  key={style}
                  onClick={() => setSelectedTemplate(style)}
                  className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${
                    selectedTemplate === style 
                    ? 'bg-blue-500/10 border-blue-500/50 text-white ring-1 ring-blue-500/20' 
                    : 'bg-white/[0.02] border-white/5 text-muted-foreground hover:bg-white/[0.05]'
                  }`}
                >
                  <span className="capitalize font-medium">{style}</span>
                  {selectedTemplate === style && <CheckCircle2 size={16} className="text-blue-400" />}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card">
            <h3 className="font-bold mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                className="w-full py-3 rounded-xl bg-white/5 border border-white/5 text-sm font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                onClick={() => setShowPreview(true)}
              >
                <Eye size={18} className="text-blue-400" /> Preview PDF
              </button>
              <button 
                className="w-full py-3 rounded-xl bg-blue-500/5 border border-blue-500/10 text-sm font-medium hover:bg-blue-500/10 text-blue-400 transition-all flex items-center justify-center gap-2"
              >
                <Send size={18} /> Send to Client
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


