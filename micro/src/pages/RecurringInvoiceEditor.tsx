import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Plus, Trash2, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

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

export default function RecurringInvoiceEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    client_id: '',
    interval: 'month',
    interval_count: 1,
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    status: 'active',
    send_automatically: false,
    items: [] as LineItem[]
  });

  useEffect(() => {
    fetchClients();
    if (isEdit) fetchProfile();
  }, [id]);

  const fetchClients = async () => {
    try {
      const data = await api.get('/clients');
      setClients(data);
    } catch (err) {
      console.error('Failed to fetch clients');
    }
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await api.get(`/recurring/${id}`);
      setFormData({
        client_id: data.client_id.toString(),
        interval: data.interval,
        interval_count: data.interval_count,
        start_date: new Date(data.start_date).toISOString().split('T')[0],
        end_date: data.end_date ? new Date(data.end_date).toISOString().split('T')[0] : '',
        status: data.status,
        send_automatically: data.send_automatically,
        items: data.items.map((it: any) => ({ ...it, unit_price: parseFloat(it.unit_price), quantity: parseFloat(it.quantity) }))
      });
    } catch (err) {
      toast.error('Failed to load profile');
      navigate('/recurring');
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
      toast.error('Please select a client');
      return;
    }
    
    setLoading(true);
    try {
      const payload = {
        ...formData,
        client_id: parseInt(formData.client_id),
        total: calculateTotal(),
        user_id: 1 // Mock
      };

      if (isEdit) {
        await api.put(`/recurring/${id}`, payload);
      } else {
        await api.post('/recurring', payload);
      }
      toast.success('Recurring profile saved');
      navigate('/recurring');
    } catch (err: any) {
      toast.error('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="page-header">
        <h1>{isEdit ? 'Edit Recurring Profile' : 'Create Recurring Profile'}</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-ghost" onClick={() => navigate('/recurring')}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Save Profile
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
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
                          style={{ width: '100%' }}
                          value={item.description}
                          onChange={e => updateItem(idx, 'description', e.target.value)}
                          placeholder="Item description"
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
                        No items added.
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
          <div className="glass-card">
            <h3>Schedule Settings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
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
                <label>Repeat Every</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="number" 
                    min="1"
                    value={formData.interval_count}
                    onChange={e => setFormData({ ...formData, interval_count: parseInt(e.target.value) })}
                    style={{ width: '80px' }}
                  />
                  <select 
                    value={formData.interval}
                    onChange={e => setFormData({ ...formData, interval: e.target.value })}
                    style={{ flex: 1 }}
                  >
                    <option value="day">Days</option>
                    <option value="week">Weeks</option>
                    <option value="month">Months</option>
                    <option value="year">Years</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Start Date</label>
                <input 
                  type="date"
                  value={formData.start_date}
                  onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>End Date (Optional)</label>
                <input 
                  type="date"
                  value={formData.end_date}
                  onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>

              <div className="form-group">
                 <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox"
                      checked={formData.send_automatically}
                      onChange={e => setFormData({ ...formData, send_automatically: e.target.checked })}
                      style={{ width: 'auto' }}
                    />
                    Automatically send via email
                 </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
