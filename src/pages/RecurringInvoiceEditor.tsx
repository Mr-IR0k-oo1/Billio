import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Plus, Trash2, Save, Loader2, ChevronLeft, Repeat, Calendar, Mail, User, DollarSign, LayoutList, Clock } from 'lucide-react';
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
      toast.success('Subscription architecture established');
      navigate('/recurring');
    } catch (err: any) {
      toast.error('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="page-header">
        <div>
          <button 
            onClick={() => navigate('/recurring')}
            className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-2 group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Subscriptions
          </button>
          <h1>{isEdit ? 'Edit Billing Cycle' : 'Initialize Subscription'}</h1>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary" onClick={() => navigate('/recurring')}>Discard</button>
          <button className="btn-cta flex items-center gap-2" onClick={handleSave} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Archive Configuration
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Line Items Section */}
          <div className="glass-card">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                  <LayoutList size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Standard Deliverables</h3>
                  <p className="text-muted-foreground text-xs uppercase tracking-widest mt-0.5">Automated line items for this cycle</p>
                </div>
              </div>
              <button className="btn-secondary py-1.5 px-3 text-xs" onClick={addItem}>
                <Plus size={14} /> Add Line Item
              </button>
            </div>
            
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Service Description</th>
                    <th className="w-24">QTY</th>
                    <th className="w-40">Unit Rate</th>
                    <th className="w-32 text-right">Extension</th>
                    <th className="w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, idx) => (
                    <tr key={idx} className="group">
                      <td className="py-3">
                        <input 
                          type="text" 
                          className="w-full bg-transparent border-transparent hover:border-white/10 focus:border-blue-500/50"
                          value={item.description}
                          onChange={e => updateItem(idx, 'description', e.target.value)}
                          placeholder="e.g. Monthly Managed Services"
                        />
                      </td>
                      <td className="py-3">
                        <input 
                          type="number" 
                          className="w-full bg-transparent border-transparent hover:border-white/10 focus:border-blue-500/50"
                          value={item.quantity}
                          onChange={e => updateItem(idx, 'quantity', parseFloat(e.target.value))}
                        />
                      </td>
                      <td className="py-3">
                        <input 
                          type="number" 
                          step="0.01"
                          className="w-full bg-transparent border-transparent hover:border-white/10 focus:border-blue-500/50"
                          value={item.unit_price}
                          onChange={e => updateItem(idx, 'unit_price', parseFloat(e.target.value))}
                        />
                      </td>
                      <td className="py-3 text-right font-bold text-white">
                        ${(item.quantity * item.unit_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 text-right">
                        <button onClick={() => removeItem(idx)} className="text-red-400 opacity-0 group-hover:opacity-100 p-2 hover:bg-red-400/10 rounded-lg transition-all">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {formData.items.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-muted-foreground italic text-sm">
                        No recurring items defined. Subscriptions must have at least one line item.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 flex justify-end">
              <div className="text-right">
                <p className="text-muted-foreground text-xs uppercase tracking-widest font-bold mb-1">Cycle Projection</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground font-medium">USD</span>
                  <h2 className="text-4xl font-bold text-white">${calculateTotal().toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Orchestration Sidebar */}
          <div className="glass-card">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 border border-purple-500/20">
                <Repeat size={20} />
              </div>
              <h3 className="text-xl font-bold">Billing Logic</h3>
            </div>

            <div className="space-y-6">
              <div className="form-group">
                <label className="flex items-center gap-2 mb-2">
                  <User size={14} className="text-blue-400" /> Target Participant
                </label>
                <select 
                  value={formData.client_id} 
                  onChange={e => setFormData({ ...formData, client_id: e.target.value })}
                  className="w-full"
                >
                  <option value="">Select a client identity</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="flex items-center gap-2 mb-2">
                  <Repeat size={14} className="text-blue-400" /> Velocity Cycle
                </label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    min="1"
                    className="w-20"
                    value={formData.interval_count}
                    onChange={e => setFormData({ ...formData, interval_count: parseInt(e.target.value) })}
                  />
                  <select 
                    value={formData.interval}
                    onChange={e => setFormData({ ...formData, interval: e.target.value })}
                    className="flex-1"
                  >
                    <option value="day">Day(s)</option>
                    <option value="week">Week(s)</option>
                    <option value="month">Month(s)</option>
                    <option value="year">Year(s)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="flex items-center gap-2 mb-2">
                  <Calendar size={14} className="text-blue-400" /> Launch Date
                </label>
                <input 
                  type="date"
                  className="w-full"
                  value={formData.start_date}
                  onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="flex items-center gap-2 mb-2">
                  <Clock size={14} className="text-blue-400" /> Horizon End (Optional)
                </label>
                <input 
                  type="date"
                  className="w-full"
                  value={formData.end_date}
                  onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>

              <div className="pt-4 mt-4 border-t border-white/5">
                 <label className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 cursor-pointer hover:bg-blue-500/10 transition-colors">
                    <input 
                      type="checkbox"
                      className="mt-1 w-4 h-4 rounded border-blue-500/50 bg-transparent text-blue-500 focus:ring-blue-500/50"
                      checked={formData.send_automatically}
                      onChange={e => setFormData({ ...formData, send_automatically: e.target.checked })}
                    />
                    <div className="flex-1 text-sm">
                      <p className="font-bold text-white flex items-center gap-2">
                        <Mail size={14} className="text-blue-400" /> Autonomous Dispatch
                      </p>
                      <p className="text-muted-foreground text-xs mt-1 leading-relaxed">System will automatically finalize and email the participant on each cycle trigger.</p>
                    </div>
                 </label>
              </div>
            </div>
          </div>

          <div className="glass-card bg-emerald-500/[0.02] border-emerald-500/10">
            <div className="flex items-center gap-3 mb-4 text-emerald-400">
              <DollarSign size={20} />
              <h3 className="text-lg font-bold">Revenue Yield</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              This subscription will generate <span className="text-white font-bold">${calculateTotal().toLocaleString()}</span> every {formData.interval_count} {formData.interval}{formData.interval_count > 1 ? 's' : ''}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
