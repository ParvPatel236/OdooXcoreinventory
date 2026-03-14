import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useInventoryStore } from '../../store/inventoryStore';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

export default function CategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory, products } = useInventoryStore();
  const [modal, setModal] = useState(null);
  const [name, setName] = useState('');
  const [confirm, setConfirm] = useState(null);

  const openCreate = () => { setName(''); setModal('create'); };
  const openEdit = (c) => { setName(c.name); setModal(c); };

  const handleSave = () => {
    if (!name.trim()) return toast.error('Name is required.');
    if (modal === 'create') { addCategory(name.trim()); toast.success('Category created!'); }
    else { updateCategory(modal.id, name.trim()); toast.success('Category updated!'); }
    setModal(null);
  };

  const handleDelete = () => {
    deleteCategory(confirm.id);
    toast.success('Category deleted.');
    setConfirm(null);
  };

  const getCatProductCount = (id) => products.filter((p) => p.categoryId === id).length;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Product Categories</h1>
          <p>{categories.length} categories defined</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> New Category</button>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {categories.length === 0 ? (
          <EmptyState title="No categories yet" desc="Create categories to organize your products." action={<button className="btn btn-primary" onClick={openCreate}><Plus size={14} /> New Category</button>} />
        ) : (
          <div className="table-wrapper" style={{ border: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Products</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600 }}>{c.name}</td>
                    <td className="td-muted">{getCatProductCount(c.id)} product(s)</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(c)}><Edit2 size={14} /></button>
                        <button className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => setConfirm(c)}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <Modal title={modal === 'create' ? 'New Category' : 'Edit Category'} onClose={() => setModal(null)}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Category Name</label>
              <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Raw Materials" autoFocus onKeyDown={(e) => e.key === 'Enter' && handleSave()} />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>{modal === 'create' ? 'Create' : 'Update'}</button>
          </div>
        </Modal>
      )}

      {confirm && (
        <ConfirmDialog title="Delete Category" message={`Delete "${confirm.name}"? This will not affect existing products.`} onConfirm={handleDelete} onCancel={() => setConfirm(null)} />
      )}
    </div>
  );
}
