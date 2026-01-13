import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Trash2, Edit2, Phone, Mail, MapPin, Search, UserPlus, X, CreditCard, FileText, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

interface Client {
  id: number;
  name: string;
  email: string;
  address: string;
  phone?: string;
  tax_id?: string;
  payment_terms?: number;
  notes?: string;
  status?: 'active' | 'inactive';
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    address: '',
    phone: '',
    tax_id: '',
    payment_terms: 30,
    notes: '',
    status: 'active' as 'active' | 'inactive'
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const token = localStorage.getItem('token');
    const isDemo = token?.startsWith('demo-token-');

    if (isDemo) {
      const mockClients: Client[] = [
        { id: 1, name: 'Acme Corp', email: 'billing@acme.com', address: '123 Enterprise Way, San Francisco, CA', phone: '+1 (555) 123-4567', payment_terms: 30, status: 'active' },
        { id: 2, name: 'Global Tech', email: 'accounts@globaltech.io', address: '78 Innovation Blvd, Austin, TX', phone: '+1 (555) 987-6543', payment_terms: 15, status: 'active' },
        { id: 3, name: 'Stark Industries', email: 'finance@stark.com', address: '10880 Malibu Point, Malibu, CA', phone: '+1 (555) 001-0011', payment_terms: 7, status: 'active' },
        { id: 4, name: 'Wayne Ent.', email: 'admin@wayne.com', address: '1007 Mountain Drive, Gotham City', phone: '+1 (555) 888-9999', payment_terms: 60, status: 'inactive' },
        { id: 5, name: 'Oscorp', email: 'invoices@oscorp.com', address: 'Empire State Bldg, New York, NY', phone: '+1 (555) 444-3333', payment_terms: 30, status: 'active' },
        { id: 6, name: 'Cyberdyne', email: 'billing@cyberdyne.sys', address: 'Skynet Lab, Los Angeles, CA', payment_terms: 30, status: 'active' },
        { id: 7, name: 'Umbrella Corp', email: 'legal@umbrella.net', address: 'Raccoon City, Mid-West', payment_terms: 90, status: 'inactive' },
        { id: 8, name: 'Virtucon', email: 'finance@virtucon.com', address: 'Secret Volcano Base, Switzerland', payment_terms: 30, status: 'active' },
      ];
      setClients(mockClients);
      return;
    }

    try {
      const data = await api.get('/clients');
      setClients(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load clients');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingClient) {
        await api.put(`/clients/${editingClient.id}`, formData);
        toast.success('Client updated successfully');
      } else {
        await api.post('/clients', formData);
        toast.success('Client created successfully');
      }
      setIsModalOpen(false);
      setEditingClient(null);
      resetForm();
      fetchClients();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save client');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this client?')) return;
    try {
      await api.delete(`/clients/${id}`);
      toast.success('Client deleted');
      fetchClients();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete client');
    }
  };

  const resetForm = () => {
    setFormData({ 
      name: '', 
      email: '', 
      address: '',
      phone: '',
      tax_id: '',
      payment_terms: 30,
      notes: '',
      status: 'active'
    });
  };

  const openAddModal = () => {
    resetForm();
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const openEditModal = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      address: client.address || '',
      phone: client.phone || '',
      tax_id: client.tax_id || '',
      payment_terms: client.payment_terms || 30,
      notes: client.notes || '',
      status: client.status || 'active'
    });
    setIsModalOpen(true);
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="page-header">
        <div>
          <h1>Clients</h1>
          <p className="text-muted-foreground text-sm mt-1">Directory of your partners and customers</p>
        </div>
        <button className="btn-cta flex items-center gap-2" onClick={openAddModal}>
          <UserPlus size={18} /> Add Client
        </button>
      </div>

      <div className="mb-8 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          className="pl-12 w-full max-w-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="glass-card p-0 overflow-hidden">
        <div className="table-container m-0">
          <table>
            <thead>
              <tr>
                <th className="pl-8">Client Name</th>
                <th>Contact info</th>
                <th>Payment Terms</th>
                <th>Status</th>
                <th className="pr-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">
                      <div className="empty-state-icon">
                        <CreditCard size={32} />
                      </div>
                      <p className="text-lg font-bold text-white">No clients found</p>
                      <p className="text-sm max-w-xs mx-auto mb-6">Start growing your network by adding your first client relationship.</p>
                      <button className="btn-secondary" onClick={openAddModal}>Add Your First Client</button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="group hover:bg-white/[0.01]">
                    <td className="pl-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-white/5 flex items-center justify-center font-bold text-blue-400">
                          {client.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-white">{client.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin size={10} /> {client.address?.split(',')[0] || 'Remote'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="space-y-1">
                        <p className="text-sm flex items-center gap-2 hover:text-blue-400 transition-colors">
                          <Mail size={12} className="text-muted-foreground" /> {client.email}
                        </p>
                        {client.phone && (
                          <p className="text-xs text-muted-foreground flex items-center gap-2">
                            <Phone size={12} /> {client.phone}
                          </p>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-muted-foreground" />
                        <span className="text-sm font-medium">{client.payment_terms || 30} Days</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${client.status === 'active' ? 'paid' : 'draft'} uppercase text-[10px] tracking-widest`}>
                        {client.status || 'active'}
                      </span>
                    </td>
                    <td className="pr-8">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEditModal(client)} className="p-2 text-muted-foreground hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all" title="Edit Client">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(client.id)} className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all" title="Delete Client">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="glass-card modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold">{editingClient ? 'Edit' : 'New'} Client</h2>
                <p className="text-sm text-muted-foreground mt-1">Configure client details for invoicing</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Acme Corp"
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input 
                    type="email" 
                    placeholder="billing@acme.com"
                    value={formData.email} 
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    required 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone} 
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Tax ID / VAT</label>
                  <input 
                    type="text" 
                    placeholder="Optional"
                    value={formData.tax_id} 
                    onChange={e => setFormData({ ...formData, tax_id: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Payment Terms</label>
                  <div className="relative">
                    <select 
                      value={formData.payment_terms} 
                      onChange={e => setFormData({ ...formData, payment_terms: parseInt(e.target.value) })}
                    >
                      <option value={7}>Net 7</option>
                      <option value={15}>Net 15</option>
                      <option value={30}>Net 30</option>
                      <option value={60}>Net 60</option>
                      <option value={90}>Net 90</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Relationship Status</label>
                  <select 
                    value={formData.status} 
                    onChange={e => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Billing Address</label>
                <textarea 
                  placeholder="Street, City, State, ZIP"
                  value={formData.address} 
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="form-group">
                <label className="flex items-center gap-2">
                  <FileText size={14} className="text-blue-400" /> Private Notes
                </label>
                <textarea 
                  value={formData.notes} 
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="Internal notes about this client (not visible to them)..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" className="btn-secondary px-6" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-cta px-8 py-2.5">
                  {editingClient ? 'Update Details' : 'Register Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
