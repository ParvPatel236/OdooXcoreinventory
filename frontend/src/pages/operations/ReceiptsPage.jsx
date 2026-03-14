import React, { useState } from 'react';
import { Plus, Search, CheckCircle, XCircle, Edit2 } from 'lucide-react';
import { useInventoryStore } from '../../store/inventoryStore';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { fmtDate } from '../../utils/date';
import toast from 'react-hot-toast';

function ReceiptForm({ products, warehouses, locations, onSave, onClose }) {
  const [form, setForm] = useState({ supplier: '', notes: '', warehouseId: warehouses[0]?.id || '', locationId: '', lines: [] });
  const [lines, setLines] = useState([{ productId: '', expectedQty: 1, receivedQty: 0 }]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const filteredLocs = locations.filter((l) => l.warehouseId === form.warehouseId);

  const setLine = (idx, k, v) => setLines((ls) => ls.map((l, i) => i === idx ? { ...l, [k]: v } : l));
  const addLine = () => setLines((ls) => [...ls, { productId: '', expectedQty: 1, receivedQty: 0 }]);
  const removeLine = (idx) => setLines((ls) => ls.filter((_, i) => i !== idx));

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.supplier) return toast.error('Supplier name is required.');
    if (!form.locationId) return toast.error('Please select a location.');
    if (lines.length === 0 || lines.some((l) => !l.productId)) return toast.error('Add at least one product line.');
    onSave({ ...form, lines });
  };

  return (
    <form onSubmit={handleSave}>
      <div className="modal-body">
        <div className="form-row cols-2">
          <div className="form-group">
            <label className="form-label">Supplier Name *</label>
            <input className="form-input" value={form.supplier} onChange={set('supplier')} placeholder="e.g. MetalCorp Ltd" />
          </div>
          <div className="form-group">
            <label className="form-label">Warehouse</label>
            <select className="form-input form-select" value={form.warehouseId} onChange={(e) => { set('warehouseId')(e); setForm((f) => ({ ...f, locationId: '' })); }}>
              {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row cols-2">
          <div className="form-group">
            <label className="form-label">Destination Location *</label>
            <select className="form-input form-select" value={form.locationId} onChange={set('locationId')}>
              <option value="">— Select Location —</option>
              {filteredLocs.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <input className="form-input" value={form.notes} onChange={set('notes')} placeholder="Optional" />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <label className="form-label">Product Lines</label>
            <button type="button" className="btn btn-secondary btn-sm" onClick={addLine}><Plus size={13} /> Add Line</button>
          </div>
          <div className="op-line-header">
            <span>Product</span><span>Expected Qty</span><span>Received Qty</span><span></span>
          </div>
          <div className="op-lines">
            {lines.map((line, idx) => (
              <div className="op-line" key={idx}>
                <select className="form-input form-select" value={line.productId} onChange={(e) => setLine(idx, 'productId', e.target.value)}>
                  <option value="">— Product —</option>
                  {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <input className="form-input" type="number" min="0" value={line.expectedQty} onChange={(e) => setLine(idx, 'expectedQty', e.target.value)} />
                <input className="form-input" type="number" min="0" value={line.receivedQty} onChange={(e) => setLine(idx, 'receivedQty', e.target.value)} />
                <button type="button" className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => removeLine(idx)}><XCircle size={15} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary">Create Receipt</button>
      </div>
    </form>
  );
}

export default function ReceiptsPage() {
  const { receipts, products, warehouses, locations, createReceipt, updateReceipt, validateReceipt, cancelReceipt } = useInventoryStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [confirm, setConfirm] = useState(null); // { action: 'validate'|'cancel', id }
  const [detail, setDetail] = useState(null);

  const filtered = receipts.filter((r) => {
    const matchSearch = r.ref.toLowerCase().includes(search.toLowerCase()) || r.supplier.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCreate = (data) => {
    createReceipt(data);
    setShowCreate(false);
    toast.success('Receipt created!');
  };

  const doValidate = () => {
    validateReceipt(confirm.id);
    toast.success('Receipt validated! Stock updated.');
    setConfirm(null);
  };

  const doCancel = () => {
    cancelReceipt(confirm.id);
    toast.success('Receipt cancelled.');
    setConfirm(null);
  };

  const getProductName = (id) => products.find((p) => p.id === id)?.name || id;
  const getLocationName = (id) => locations.find((l) => l.id === id)?.name || id;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Receipts</h1>
          <p>Incoming stock from vendors</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}><Plus size={16} /> New Receipt</button>
      </div>

      <div className="filters-bar">
        <div className="search-input-wrap">
          <Search size={14} className="search-icon" />
          <input className="search-input" placeholder="Search by ref or supplier…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="waiting">Waiting</option>
          <option value="ready">Ready</option>
          <option value="done">Done</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {filtered.length === 0 ? (
          <EmptyState title="No receipts found" desc="Create a receipt when goods arrive from a vendor." action={<button className="btn btn-primary" onClick={() => setShowCreate(true)}><Plus size={14} /> New Receipt</button>} />
        ) : (
          <div className="table-wrapper" style={{ border: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Supplier</th>
                  <th>Location</th>
                  <th>Products</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.82rem' }}>{r.ref}</td>
                    <td>{r.supplier}</td>
                    <td className="td-muted">{getLocationName(r.locationId)}</td>
                    <td className="td-muted">{r.lines.length} line(s)</td>
                    <td className="td-muted">{fmtDate(r.createdAt)}</td>
                    <td><Badge status={r.status} dot /></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {r.status !== 'done' && r.status !== 'cancelled' && (
                          <>
                            <button className="btn btn-success btn-sm" onClick={() => setConfirm({ action: 'validate', id: r.id, ref: r.ref })}>
                              <CheckCircle size={13} /> Validate
                            </button>
                            <button className="btn btn-secondary btn-sm" onClick={() => setConfirm({ action: 'cancel', id: r.id, ref: r.ref })}>
                              Cancel
                            </button>
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
        <Modal title="Create Receipt" onClose={() => setShowCreate(false)} size="lg">
          <ReceiptForm products={products} warehouses={warehouses} locations={locations} onSave={handleCreate} onClose={() => setShowCreate(false)} />
        </Modal>
      )}

      {confirm && (
        <ConfirmDialog
          title={confirm.action === 'validate' ? 'Validate Receipt' : 'Cancel Receipt'}
          message={confirm.action === 'validate'
            ? `Validate ${confirm.ref}? Stock will be increased by the received quantities.`
            : `Cancel ${confirm.ref}? This cannot be undone.`}
          onConfirm={confirm.action === 'validate' ? doValidate : doCancel}
          onCancel={() => setConfirm(null)}
          variant={confirm.action === 'validate' ? 'success' : 'danger'}
        />
      )}
    </div>
  );
}
