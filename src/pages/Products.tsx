import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Plus, Trash2, Edit2, Package, Search, X, DollarSign, Tag, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
  id: number;
  name: string;
  unit_price: string | number;
  description: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ name: '', unit_price: '', description: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    const isDemo = token?.startsWith('demo-token-');

    if (isDemo) {
      const mockProducts: Product[] = [
        { id: 1, name: 'Web Development', unit_price: 150.00, description: 'High-quality React/Next.js development services' },
        { id: 2, name: 'UI/UX Design', unit_price: 120.00, description: 'Custom interface and user experience design' },
        { id: 3, name: 'SEO Optimization', unit_price: 85.00, description: 'Comprehensive search engine optimization audit and implementation' },
        { id: 4, name: 'Mobile App Development', unit_price: 180.00, description: 'Native and cross-platform mobile application development' },
        { id: 5, name: 'Consulting', unit_price: 200.00, description: 'Technical advisory and business strategy consulting' },
        { id: 6, name: 'Graphic Design', unit_price: 90.00, description: 'Brand identity, logos, and marketing materials design' },
      ];
      setProducts(mockProducts);
      return;
    }

    try {
      const data = await api.get('/products');
      setProducts(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load catalog');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...formData, unit_price: parseFloat(formData.unit_price) };
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload);
        toast.success('Service updated');
      } else {
        await api.post('/products', payload);
        toast.success('Service added to catalog');
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      setFormData({ name: '', unit_price: '', description: '' });
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save service');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to remove this from your catalog?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Service removed');
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete service');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="page-header">
        <div>
          <h1>Products & Services</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your service catalog and pricing</p>
        </div>
        <button className="btn-cta flex items-center gap-2" onClick={() => { setIsModalOpen(true); setEditingProduct(null); setFormData({ name: '', unit_price: '', description: '' }); }}>
          <Plus size={18} /> Add Service
        </button>
      </div>

      <div className="mb-8 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <input 
          type="text" 
          placeholder="Search items by name or description..." 
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
                <th className="pl-8">Item Name</th>
                <th>Description</th>
                <th>Unit Price</th>
                <th className="pr-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <div className="empty-state">
                      <div className="empty-state-icon">
                        <Package size={32} />
                      </div>
                      <p className="text-lg font-bold text-white">No items found</p>
                      <p className="text-sm max-w-xs mx-auto mb-6">Build your catalog to speed up invoice creation with pre-defined services.</p>
                      <button className="btn-secondary" onClick={() => setIsModalOpen(true)}>Create Your First Item</button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="group hover:bg-white/[0.01]">
                    <td className="pl-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                          <Tag size={18} />
                        </div>
                        <p className="font-bold text-white">{product.name}</p>
                      </div>
                    </td>
                    <td className="max-w-xs">
                      <p className="text-sm text-muted-foreground truncate" title={product.description}>{product.description || 'No description provided'}</p>
                    </td>
                    <td>
                      <p className="text-lg font-bold text-emerald-400">
                        ${parseFloat(product.unit_price.toString()).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </td>
                    <td className="pr-8">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => { setEditingProduct(product); setFormData({ ...product, unit_price: product.unit_price.toString() }); setIsModalOpen(true); }} 
                          className="p-2 text-muted-foreground hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
                          title="Edit Item"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)} 
                          className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Delete Item"
                        >
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
                <h2 className="text-2xl font-bold">{editingProduct ? 'Edit' : 'New'} Item</h2>
                <p className="text-sm text-muted-foreground mt-1">Define item details for your service catalog</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-group">
                <label className="flex items-center gap-2">
                  <Tag size={14} className="text-blue-400" /> Item Name *
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Web Development"
                  value={formData.name} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="flex items-center gap-2">
                  <DollarSign size={14} className="text-emerald-400" /> Unit Price ($) *
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="0.00"
                    value={formData.unit_price} 
                    onChange={e => setFormData({ ...formData, unit_price: e.target.value })}
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="flex items-center gap-2">
                  <FileText size={14} className="text-blue-400" /> Description
                </label>
                <textarea 
                  placeholder="Describe the item or service..."
                  value={formData.description} 
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" className="btn-secondary px-6" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-cta px-8 py-2.5">
                  {editingProduct ? 'Update Catalog' : 'Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
