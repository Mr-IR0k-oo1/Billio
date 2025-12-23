import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Plus, Trash2, Save, Send, Sparkles, Loader2 } from 'lucide-react';

interface LineItem {
  id?: number;
  description: string;
  quantity: number;
  unit_price: number;
}

interface Client {
  id: number;
  name: string;
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
            <h3>Invoice Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
              <button className="btn-ghost" style={{ justifyContent: 'flex-start' }}>
                <Send size={18} style={{ marginRight: '8px' }} /> Send to Client
              </button>
              <button className="btn-ghost" style={{ justifyContent: 'flex-start' }}>
                <FileText size={18} style={{ marginRight: '8px' }} /> Preview PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const FileText = ({ size, style }: any) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14.5 2 14.5 7.5 20 7.5"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>;
