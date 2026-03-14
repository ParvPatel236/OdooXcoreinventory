import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, MapPin } from 'lucide-react';
import { useInventoryStore } from '../../store/inventoryStore';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import toast from 'react-hot-toast';

function ProductForm({ initial, products, categories, units, onSave, onClose }) {
  const [form, setForm] = useState(initial || { name: '', sku: '', categoryId: '', uomId: '', minStock: 10, initialStock: 0 });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.sku) return toast.error('Name and SKU are required.');
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="modal-body">
        <div className="form-row cols-2">
          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input className="form-input" value={form.name} onChange={set('name')} placeholder="e.g. Steel Rods" />
          </div>
          <div className="form-group">
            <label className="form-label">SKU / Code *</label>
            <input className="form-input" value={form.sku} onChange={set('sku')} placeholder="e.g. STL-001" />
          </div>
        </div>
        <div className="form-row cols-2">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-input form-select" value={form.categoryId} onChange={set('categoryId')}>
              <option value="">— Select —</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Unit of Measure</label>
            <select className="form-input form-select" value={form.uomId} onChange={set('uomId')}>
              <option value="">— Select —</option>
              {units.map((u) => <option key={u.id} value={u.id}>{u.label} ({u.name})</option>)}
            </select>
          </div>
        </div>
        <div className="form-row cols-2">
          <div className="form-group">
            <label className="form-label">Min Stock (Alert Threshold)</label>
            <input className="form-input" type="number" min="0" value={form.minStock} onChange={set('minStock')} />
          </div>
          {!initial && (
            <div className="form-group">
              <label className="form-label">Initial Stock</label>
              <input className="form-input" type="number" min="0" value={form.initialStock} onChange={set('initialStock')} />
              <span className="form-hint">Added to Main Store of Main Warehouse</span>
            </div>
          )}
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary">{initial ? 'Update Product' : 'Create Product'}</button>
      </div>
    </form>
  );
}

export default function ProductsPage() {
  const { products, categories, units, stockMap, addProduct, updateProduct, deleteProduct } = useInventoryStore();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modal, setModal] = useState(null); // null | 'create' | {editing: product}
  const [confirm, setConfirm] = useState(null);

  const getTotal = (id) => Object.entries(stockMap).filter(([k]) => k.startsWith(`${id}_`)).reduce((s, [, v]) => s + v, 0);

  const getStatus = (product) => {
    const total = getTotal(product.id);
    if (total <= 0) return 'out_stock';
    if (total <= product.minStock) return 'low_stock';
    return 'in_stock';
  };

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = !catFilter || p.categoryId === catFilter;
    const matchStatus = !statusFilter || getStatus(p) === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const handleSave = (form) => {
    if (modal === 'create') {
      addProduct(form);
      toast.success('Product created!');
    } else {
      updateProduct(modal.editing.id, form);
      toast.success('Product updated!');
    }
    setModal(null);
  };

  const handleDelete = () => {
    deleteProduct(confirm.id);
    toast.success('Product deleted.');
    setConfirm(null);
  };

  const getCatName = (id) => categories.find((c) => c.id === id)?.name || '—';
  const getUomName = (id) => units.find((u) => u.id === id)?.name || '—';

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Products</h1>
          <p>{products.length} products tracked</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('create')}>
          <Plus size={16} /> New Product
        </button>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-input-wrap">
          <Search size={14} className="search-icon" />
          <input className="search-input" placeholder="Search by name or SKU…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="in_stock">In Stock</option>
          <option value="low_stock">Low Stock</option>
          <option value="out_stock">Out of Stock</option>
        </select>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0 }}>
        {filtered.length === 0 ? (
          <EmptyState title="No products found" desc="Try adjusting filters or create a new product." action={<button className="btn btn-primary" onClick={() => setModal('create')}><Plus size={14} /> New Product</button>} />
        ) : (
          <div className="table-wrapper" style={{ border: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>UoM</th>
                  <th>Total Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const total = getTotal(p.id);
                  const status = getStatus(p);
                  return (
                    <tr key={p.id}>
                      <td><span style={{ fontWeight: 600 }}>{p.name}</span></td>
                      <td><span className="td-muted" style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>{p.sku}</span></td>
                      <td className="td-muted">{getCatName(p.categoryId)}</td>
                      <td className="td-muted">{getUomName(p.uomId)}</td>
                      <td>
                        <span style={{ fontWeight: 700, fontSize: '1rem' }}>{total}</span>
                        <span className="td-muted" style={{ marginLeft: 6 }}>(min: {p.minStock})</span>
                      </td>
                      <td><Badge status={status} dot /></td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-ghost btn-icon btn-sm" title="Edit" onClick={() => setModal({ editing: p })}>
                            <Edit2 size={14} />
                          </button>
                          <button className="btn btn-ghost btn-icon btn-sm" title="Delete" style={{ color: 'var(--color-danger)' }} onClick={() => setConfirm(p)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {modal && (
        <Modal title={modal === 'create' ? 'Create New Product' : 'Edit Product'} onClose={() => setModal(null)} size="md">
          <ProductForm
            initial={modal !== 'create' ? modal.editing : null}
            categories={categories}
            units={units}
            onSave={handleSave}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}

      {confirm && (
        <ConfirmDialog
          title="Delete Product"
          message={`Are you sure you want to delete "${confirm.name}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
