import React, { useState } from 'react';
import { Plus, Search, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { useInventoryStore } from '../../store/inventoryStore';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { fmtDate } from '../../utils/date';
import toast from 'react-hot-toast';

const STEPS = ['Pick Items', 'Pack Items', 'Validate'];

function DeliveryForm({ products, warehouses, locations, onSave, onClose }) {
  const [form, setForm] = useState({ customer: '', notes: '', warehouseId: warehouses[0]?.id || '', locationId: '' });
  const [lines, setLines] = useState([{ productId: '', qty: 1 }]);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const filteredLocs = locations.filter((l) => l.warehouseId === form.warehouseId);
  const setLine = (idx, k, v) => setLines((ls) => ls.map((l, i) => i === idx ? { ...l, [k]: v } : l));

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.customer) return toast.error('Customer name is required.');
    if (!form.locationId) return toast.error('Please select a source location.');
    if (!lines.length || lines.some((l) => !l.productId)) return toast.error('Add at least one product.');
    onSave({ ...form, lines });
  };

  return (
    <form onSubmit={handleSave}>
      <div className="modal-body">
        <div className="form-row cols-2">
          <div className="form-group">
            <label className="form-label">Customer *</label>
            <input className="form-input" value={form.customer} onChange={set('customer')} placeholder="Customer name" />
          </div>
          <div className="form-group">
            <label className="form-label">Warehouse</label>
            <select className="form-input form-select" value={form.warehouseId} onChange={(e) => { set('warehouseId')(e); setForm((f) => ({ ...f, warehouseId: e.target.value, locationId: '' })); }}>
              {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row cols-2">
          <div className="form-group">
            <label className="form-label">Source Location *</label>
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
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setLines((ls) => [...ls, { productId: '', qty: 1 }])}><Plus size={13} /> Add</button>
          </div>
          <div className="op-line-header"><span>Product</span><span>Qty</span><span></span><span></span></div>
          <div className="op-lines">
            {lines.map((line, idx) => (
              <div className="op-line" key={idx}>
                <select className="form-input form-select" value={line.productId} onChange={(e) => setLine(idx, 'productId', e.target.value)}>
                  <option value="">— Product —</option>
                  {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <input className="form-input" type="number" min="1" value={line.qty} onChange={(e) => setLine(idx, 'qty', e.target.value)} />
                <span></span>
                <button type="button" className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => setLines((ls) => ls.filter((_, i) => i !== idx))}><XCircle size={15} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary">Create Delivery</button>
      </div>
    </form>
  );
}

export default function DeliveriesPage() {
  const { deliveries, products, warehouses, locations, createDelivery, validateDelivery, cancelDelivery, advanceDeliveryStep } = useInventoryStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const filtered = deliveries.filter((d) => {
    const matchSearch = d.ref.toLowerCase().includes(search.toLowerCase()) || d.customer?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getLocName = (id) => locations.find((l) => l.id === id)?.name || '—';

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left"><h1>Delivery Orders</h1><p>Outgoing stock to customers</p></div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}><Plus size={16} /> New Delivery</button>
      </div>

      <div className="filters-bar">
        <div className="search-input-wrap"><Search size={14} className="search-icon" /><input className="search-input" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          {['draft','waiting','ready','done','cancelled'].map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {filtered.length === 0 ? (
          <EmptyState title="No deliveries found" desc="Create a delivery when goods need to leave the warehouse." action={<button className="btn btn-primary" onClick={() => setShowCreate(true)}><Plus size={14} /> New Delivery</button>} />
        ) : (
          <div className="table-wrapper" style={{ border: 'none' }}>
            <table>
              <thead>
                <tr><th>Reference</th><th>Customer</th><th>Location</th><th>Step</th><th>Date</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.82rem' }}>{d.ref}</td>
                    <td>{d.customer}</td>
                    <td className="td-muted">{getLocName(d.locationId)}</td>
                    <td>
                      {d.status !== 'done' && d.status !== 'cancelled' ? (
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                          Step {d.step + 1}/3: {STEPS[d.step]}
                        </span>
                      ) : <span className="td-muted">—</span>}
                    </td>
                    <td className="td-muted">{fmtDate(d.createdAt)}</td>
                    <td><Badge status={d.status} dot /></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {d.status !== 'done' && d.status !== 'cancelled' && (
                          <>
                            {d.step < 2 && (
                              <button className="btn btn-secondary btn-sm" onClick={() => { advanceDeliveryStep(d.id); toast.success(`Advanced to: ${STEPS[d.step + 1]}`); }}>
                                <ChevronRight size={13} /> Next Step
                              </button>
                            )}
                            {d.step === 2 && (
                              <button className="btn btn-success btn-sm" onClick={() => setConfirm({ action: 'validate', id: d.id, ref: d.ref })}>
                                <CheckCircle size={13} /> Validate
                              </button>
                            )}
                            <button className="btn btn-secondary btn-sm" onClick={() => setConfirm({ action: 'cancel', id: d.id, ref: d.ref })}>Cancel</button>
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
        <Modal title="Create Delivery Order" onClose={() => setShowCreate(false)} size="lg">
          <DeliveryForm products={products} warehouses={warehouses} locations={locations}
            onSave={(data) => { createDelivery(data); setShowCreate(false); toast.success('Delivery order created!'); }}
            onClose={() => setShowCreate(false)} />
        </Modal>
      )}

      {confirm && (
        <ConfirmDialog
          title={confirm.action === 'validate' ? 'Validate Delivery' : 'Cancel Delivery'}
          message={confirm.action === 'validate'
            ? `Validate ${confirm.ref}? Stock will be decreased by the delivered quantities.`
            : `Cancel ${confirm.ref}?`}
          onConfirm={() => {
            if (confirm.action === 'validate') { validateDelivery(confirm.id); toast.success('Delivery validated! Stock decreased.'); }
            else { cancelDelivery(confirm.id); toast.success('Delivery cancelled.'); }
            setConfirm(null);
          }}
          onCancel={() => setConfirm(null)}
          variant={confirm.action === 'validate' ? 'success' : 'danger'}
        />
      )}
    </div>
  );
}
