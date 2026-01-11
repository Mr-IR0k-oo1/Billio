import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Plus, Trash2, Edit2, Phone } from 'lucide-react';
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

  return (
    <div>
      <div className="page-header">
        <h1>Clients</h1>
        <button className="btn-primary" onClick={openAddModal} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Add Client
        </button>
      </div>

      <div className="glass-card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Payment Terms</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    No clients yet. Add your first client to get started.
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id}>
                    <td style={{ fontWeight: 600 }}>{client.name}</td>
                    <td>{client.email}</td>
                    <td>
                      {client.phone ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Phone size={14} className="text-muted" />
                          {client.phone}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-secondary)' }}>—</span>
                      )}
                    </td>
                    <td>{client.payment_terms || 30} days</td>
                    <td>
                      <span className={`badge badge-${client.status === 'active' ? 'paid' : 'draft'}`}>
                        {client.status || 'active'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={() => openEditModal(client)} style={{ color: 'var(--accent-color)', background: 'none', cursor: 'pointer', border: 'none' }}>
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(client.id)} style={{ color: 'var(--error-color)', background: 'none', cursor: 'pointer', border: 'none' }}>
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
          <div className="glass-card modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', maxHeight: '90vh', overflow: 'auto' }}>
            <h2>{editingClient ? 'Edit Client' : 'Add Client'}</h2>
            <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Name *</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    required 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Phone</label>
                  <input 
                    type="tel" 
                    value={formData.phone} 
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Tax ID</label>
                  <input 
                    type="text" 
                    value={formData.tax_id} 
                    onChange={e => setFormData({ ...formData, tax_id: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Payment Terms (days)</label>
                  <input 
                    type="number" 
                    value={formData.payment_terms} 
                    onChange={e => setFormData({ ...formData, payment_terms: parseInt(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
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
                <label>Address</label>
                <textarea 
                  value={formData.address} 
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea 
                  value={formData.notes} 
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="Internal notes about this client..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Client</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
