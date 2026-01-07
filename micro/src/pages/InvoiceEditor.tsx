import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Plus, Trash2, Save, Send, Sparkles, Loader2, LayoutTemplate, Eye, X } from 'lucide-react';
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

export default function InvoiceEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiNotes, setAiNotes] = useState('');
  
  const [formData, setFormData] = useState({
    client_id: '',
    status: 'draft',
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [] as LineItem[]
  });

  const [selectedTemplate, setSelectedTemplate] = useState<'minimalist' | 'professional' | 'creative'>('minimalist');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchClients();
    if (isEdit) fetchInvoice();
  }, [id]);

  const fetchClients = async () => {
    const data = await api.get('/clients');
    setClients(data);
  };

  const fetchInvoice = async () => {
    setLoading(true);
    try {
      const data = await api.get(`/invoices/${id}`);
      setFormData({
        client_id: data.client_id.toString(),
        status: data.status,
        due_date: new Date(data.due_date).toISOString().split('T')[0],
        items: data.items.map((it: any) => ({ ...it, unit_price: parseFloat(it.unit_price), quantity: parseFloat(it.quantity) }))
      });
    } catch (err) {
      console.error(err);
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
    setLoading(true);
    try {
      const payload = {
        ...formData,
        client_id: parseInt(formData.client_id),
        total: calculateTotal(),
        user_id: 1 // Mock
      };

      if (isEdit) {
        await api.put(`/invoices/${id}`, payload);
      } else {
        await api.post('/invoices', payload);
      }
      navigate('/invoices');
    } catch (err) {
      alert('Failed to save invoice');
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
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="page-header">
        <h1>{isEdit ? `Edit Invoice #${id}` : 'Create New Invoice'}</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-ghost" onClick={() => navigate('/invoices')}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Save Draft
          </button>
        </div>
      </div>

      {showPreview && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 50, 
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px'
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '800px', height: '90vh', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Invoice Preview</h3>
              <button onClick={() => setShowPreview(false)} className="btn-ghost" style={{ padding: '8px' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '40px', background: '#f8fafc', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '100%', maxWidth: '700px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                {(() => {
                  const client = clients.find(c => c.id === parseInt(formData.client_id));
                  const data = {
                    id: id || 'DRAFT',
                    date: new Date().toLocaleDateString(),
                    due_date: formData.due_date,
                    items: formData.items,
                    total: calculateTotal()
                  };
                   // Fallback client if not selected
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-card">
            <h3>Invoice Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '20px' }}>
              <div className="form-group">
                <label>Client</label>
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
                <label>Due Date</label>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3>Line Items</h3>
              <button className="btn-ghost" onClick={addItem} style={{ padding: '4px 12px', fontSize: '0.9rem' }}>
                <Plus size={16} /> Add Item
              </button>
            </div>
            
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th style={{ width: '100px' }}>Qty</th>
                    <th style={{ width: '150px' }}>Price</th>
                    <th style={{ width: '120px' }}>Total</th>
                    <th style={{ width: '50px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <input 
                          type="text" 
                          placeholder="What was done?" 
                          style={{ width: '100%' }}
                          value={item.description}
                          onChange={e => updateItem(idx, 'description', e.target.value)}
                        />
                      </td>
                      <td>
                        <input 
                          type="number" 
                          style={{ width: '100%' }}
                          value={item.quantity}
                          onChange={e => updateItem(idx, 'quantity', parseFloat(e.target.value))}
                        />
                      </td>
                      <td>
                        <input 
                          type="number" 
                          step="0.01"
                          style={{ width: '100%' }}
                          value={item.unit_price}
                          onChange={e => updateItem(idx, 'unit_price', parseFloat(e.target.value))}
                        />
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        ${(item.quantity * item.unit_price).toFixed(2)}
                      </td>
                      <td>
                        <button onClick={() => removeItem(idx)} style={{ color: 'var(--error-color)', background: 'none' }}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {formData.items.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>
                        No items yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '20px', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Amount</p>
                <h2 style={{ fontSize: '2rem', color: 'var(--accent-color)' }}>${calculateTotal().toFixed(2)}</h2>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-card" style={{ border: '1px solid #7c3aed33', background: 'rgba(124, 58, 237, 0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Sparkles size={20} style={{ color: '#7c3aed' }} />
              <h3 style={{ color: '#7c3aed' }}>AI Assistant</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Describe the work performed and the AI will generate professional line items.
            </p>
            <textarea 
              placeholder="e.g. Spent 5 hours on logo design and 2 hours on brand colors"
              style={{ width: '100%', height: '120px', resize: 'none', background: 'rgba(0,0,0,0.2)' }}
              value={aiNotes}
              onChange={e => setAiNotes(e.target.value)}
            />
            <button 
              className="btn-primary" 
              style={{ width: '100%', marginTop: '12px', background: '#7c3aed' }}
              onClick={handleAiDescribe}
              disabled={aiLoading || !aiNotes.trim()}
            >
              {aiLoading ? <Loader2 className="animate-spin" size={18} /> : 'Describe This'}
            </button>
          </div>

          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <LayoutTemplate size={20} />
              <h3>Template</h3>
            </div>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button 
                  onClick={() => setSelectedTemplate('minimalist')}
                  className={`btn-ghost ${selectedTemplate === 'minimalist' ? 'active' : ''}`}
                  style={{ justifyContent: 'flex-start', border: selectedTemplate === 'minimalist' ? '1px solid var(--accent-color)' : '1px solid transparent' }}
                >
                  Minimalist
                </button>
                <button 
                  onClick={() => setSelectedTemplate('professional')}
                  className={`btn-ghost ${selectedTemplate === 'professional' ? 'active' : ''}`}
                  style={{ justifyContent: 'flex-start', border: selectedTemplate === 'professional' ? '1px solid var(--accent-color)' : '1px solid transparent' }}
                >
                  Professional
                </button>
                <button 
                  onClick={() => setSelectedTemplate('creative')}
                  className={`btn-ghost ${selectedTemplate === 'creative' ? 'active' : ''}`}
                  style={{ justifyContent: 'flex-start', border: selectedTemplate === 'creative' ? '1px solid var(--accent-color)' : '1px solid transparent' }}
                >
                  Creative
                </button>
             </div>
          </div>

          <div className="glass-card">
            <h3>Invoice Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
              <button className="btn-ghost" style={{ justifyContent: 'flex-start' }}>
                <Send size={18} style={{ marginRight: '8px' }} /> Send to Client
              </button>
              <button className="btn-ghost" style={{ justifyContent: 'flex-start' }} onClick={() => setShowPreview(true)}>
                <Eye size={18} style={{ marginRight: '8px' }} /> Preview PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


