import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Plus, Trash2, Edit2 } from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', unit_price: '', description: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await api.get('/products');
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...formData, unit_price: parseFloat(formData.unit_price), user_id: 1 };
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      setFormData({ name: '', unit_price: '', description: '' });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Products & Services</h1>
        <button className="btn-primary" onClick={() => { setIsModalOpen(true); setEditingProduct(null); setFormData({ name: '', unit_price: '', description: '' }); }}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="glass-card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td style={{ fontWeight: 500 }}>{product.name}</td>
                  <td style={{ color: 'var(--success-color)' }}>${parseFloat(product.unit_price).toFixed(2)}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{product.description}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button onClick={() => { setEditingProduct(product); setFormData({ ...product, unit_price: product.unit_price.toString() }); setIsModalOpen(true); }} style={{ color: 'var(--text-secondary)', background: 'none' }}>
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} style={{ color: 'var(--error-color)', background: 'none' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>
                    No products yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="glass-card modal-content">
            <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
              <div className="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({ ...formData, name: (e.target as HTMLInputElement).value })}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Unit Price</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={formData.unit_price} 
                  onChange={e => setFormData({ ...formData, unit_price: (e.target as HTMLInputElement).value })}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={formData.description} 
                  onChange={e => setFormData({ ...formData, description: (e.target as HTMLTextAreaElement).value })}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
