import React, { useState } from 'react';
import { Plus, Search, CheckCircle, XCircle } from 'lucide-react';
import { useInventoryStore } from '../../store/inventoryStore';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { fmtDate } from '../../utils/date';
import toast from 'react-hot-toast';

function TransferForm({ products, warehouses, locations, onSave, onClose }) {
  const [form, setForm] = useState({ fromLocationId: '', toLocationId: '', warehouseId: warehouses[0]?.id || '', notes: '' });
  const [lines, setLines] = useState([{ productId: '', qty: 1 }]);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.fromLocationId || !form.toLocationId) return toast.error('Select from and to locations.');
    if (form.fromLocationId === form.toLocationId) return toast.error('From and To locations must differ.');
    if (!lines.length || lines.some((l) => !l.productId)) return toast.error('Add at least one product.');
    onSave({ ...form, lines });
  };

  return (
    <form onSubmit={handleSave}>
      <div className="modal-body">
        <div className="form-row cols-2">
          <div className="form-group">
            <label className="form-label">From Location *</label>
            <select className="form-input form-select" value={form.fromLocationId} onChange={set('fromLocationId')}>
              <option value="">— Select —</option>
              {locations.map((l) => <option key={l.id} value={l.id}>{l.name} ({warehouses.find((w) => w.id === l.warehouseId)?.name})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">To Location *</label>
            <select className="form-input form-select" value={form.toLocationId} onChange={set('toLocationId')}>
              <option value="">— Select —</option>
              {locations.map((l) => <option key={l.id} value={l.id}>{l.name} ({warehouses.find((w) => w.id === l.warehouseId)?.name})</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Notes</label>
          <input className="form-input" value={form.notes} onChange={set('notes')} placeholder="Optional" />
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <label className="form-label">Products to Transfer</label>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setLines((ls) => [...ls, { productId: '', qty: 1 }])}><Plus size={13} /> Add</button>
          </div>
          <div className="op-line-header"><span>Product</span><span>Qty</span><span></span><span></span></div>
          <div className="op-lines">
            {lines.map((line, idx) => (
              <div className="op-line" key={idx}>
                <select className="form-input form-select" value={line.productId} onChange={(e) => setLines((ls) => ls.map((l, i) => i === idx ? { ...l, productId: e.target.value } : l))}>
                  <option value="">— Product —</option>
                  {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <input className="form-input" type="number" min="1" value={line.qty} onChange={(e) => setLines((ls) => ls.map((l, i) => i === idx ? { ...l, qty: e.target.value } : l))} />
                <span></span>
                <button type="button" className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => setLines((ls) => ls.filter((_, i) => i !== idx))}><XCircle size={15} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary">Create Transfer</button>
      </div>
    </form>
  );
}

export default function TransfersPage() {
  const { transfers, products, warehouses, locations, createTransfer, validateTransfer, cancelTransfer } = useInventoryStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const filtered = transfers.filter((t) => {
    const matchSearch = t.ref.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getLocName = (id) => locations.find((l) => l.id === id)?.name || '—';

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left"><h1>Internal Transfers</h1><p>Move stock between locations</p></div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}><Plus size={16} /> New Transfer</button>
      </div>

      <div className="filters-bar">
        <div className="search-input-wrap"><Search size={14} className="search-icon" /><input className="search-input" placeholder="Search by reference…" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          {['waiting','ready','done','cancelled'].map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {filtered.length === 0 ? (
          <EmptyState title="No transfers found" desc="Create a transfer to move stock between locations." action={<button className="btn btn-primary" onClick={() => setShowCreate(true)}><Plus size={14} /> New Transfer</button>} />
        ) : (
          <div className="table-wrapper" style={{ border: 'none' }}>
            <table>
              <thead>
                <tr><th>Reference</th><th>From</th><th>To</th><th>Products</th><th>Date</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.82rem' }}>{t.ref}</td>
                    <td className="td-muted">{getLocName(t.fromLocationId)}</td>
                    <td className="td-muted">{getLocName(t.toLocationId)}</td>
                    <td className="td-muted">{t.lines.length} line(s)</td>
                    <td className="td-muted">{fmtDate(t.createdAt)}</td>
                    <td><Badge status={t.status} dot /></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {t.status !== 'done' && t.status !== 'cancelled' && (
                          <>
                            <button className="btn btn-success btn-sm" onClick={() => setConfirm({ action: 'validate', id: t.id, ref: t.ref })}>
                              <CheckCircle size={13} /> Validate
                            </button>
                            <button className="btn btn-secondary btn-sm" onClick={() => setConfirm({ action: 'cancel', id: t.id, ref: t.ref })}>Cancel</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreate && (
        <Modal title="Create Internal Transfer" onClose={() => setShowCreate(false)} size="lg">
          <TransferForm products={products} warehouses={warehouses} locations={locations}
            onSave={(data) => { createTransfer(data); setShowCreate(false); toast.success('Transfer created!'); }}
            onClose={() => setShowCreate(false)} />
        </Modal>
      )}

      {confirm && (
        <ConfirmDialog
          title={confirm.action === 'validate' ? 'Validate Transfer' : 'Cancel Transfer'}
          message={confirm.action === 'validate'
            ? `Validate ${confirm.ref}? Stock will be moved between locations.`
            : `Cancel ${confirm.ref}?`}
          onConfirm={() => {
            if (confirm.action === 'validate') { validateTransfer(confirm.id); toast.success('Transfer validated! Stock moved.'); }
            else { cancelTransfer(confirm.id); toast.success('Transfer cancelled.'); }
            setConfirm(null);
          }}
          onCancel={() => setConfirm(null)}
          variant={confirm.action === 'validate' ? 'success' : 'danger'}
        />
      )}
    </div>
  );
}
