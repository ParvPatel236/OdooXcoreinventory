import React, { useState } from 'react';
import { Plus, Search, CheckCircle } from 'lucide-react';
import { useInventoryStore } from '../../store/inventoryStore';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { fmtDate } from '../../utils/date';
import toast from 'react-hot-toast';

function AdjustmentForm({ products, warehouses, locations, stockMap, onSave, onClose }) {
  const [form, setForm] = useState({ warehouseId: warehouses[0]?.id || '', locationId: '', notes: '' });
  const [lines, setLines] = useState([{ productId: '', countedQty: 0, systemQty: 0 }]);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const filteredLocs = locations.filter((l) => l.warehouseId === form.warehouseId);

  const handleProductChange = (idx, productId) => {
    const key = `${productId}_${form.locationId}`;
    const systemQty = stockMap[key] || 0;
    setLines((ls) => ls.map((l, i) => i === idx ? { ...l, productId, systemQty, countedQty: systemQty } : l));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.locationId) return toast.error('Select a location.');
    if (!lines.length || lines.some((l) => !l.productId)) return toast.error('Add at least one product.');
    const processedLines = lines.map((l) => ({ ...l, diff: Number(l.countedQty) - Number(l.systemQty) }));
    onSave({ ...form, lines: processedLines });
  };

  return (
    <form onSubmit={handleSave}>
      <div className="modal-body">
        <div className="form-row cols-2">
          <div className="form-group">
            <label className="form-label">Warehouse</label>
            <select className="form-input form-select" value={form.warehouseId} onChange={(e) => { set('warehouseId')(e); setForm((f) => ({ ...f, warehouseId: e.target.value, locationId: '' })); }}>
              {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Location *</label>
            <select className="form-input form-select" value={form.locationId} onChange={set('locationId')}>
              <option value="">— Select —</option>
              {filteredLocs.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Notes (reason for adjustment)</label>
          <input className="form-input" value={form.notes} onChange={set('notes')} placeholder="e.g. Damaged goods, physical count difference" />
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <label className="form-label">Product Lines</label>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setLines((ls) => [...ls, { productId: '', countedQty: 0, systemQty: 0 }])}><Plus size={13} /> Add</button>
          </div>
          <div className="op-line-header"><span>Product</span><span>System Qty</span><span>Counted Qty</span><span></span></div>
          <div className="op-lines">
            {lines.map((line, idx) => {
              const diff = Number(line.countedQty) - Number(line.systemQty);
              return (
                <div className="op-line" key={idx}>
                  <select className="form-input form-select" value={line.productId} onChange={(e) => handleProductChange(idx, e.target.value)}>
                    <option value="">— Product —</option>
                    {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <input className="form-input" type="number" value={line.systemQty} readOnly style={{ background: 'var(--color-surface2)', color: 'var(--color-text-muted)' }} />
                  <input className="form-input" type="number" min="0" value={line.countedQty} onChange={(e) => setLines((ls) => ls.map((l, i) => i === idx ? { ...l, countedQty: e.target.value } : l))} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: diff > 0 ? 'var(--color-success)' : diff < 0 ? 'var(--color-danger)' : 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                    {diff >= 0 ? `+${diff}` : diff}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary">Create Adjustment</button>
      </div>
    </form>
  );
}

export default function AdjustmentsPage() {
  const { adjustments, products, warehouses, locations, stockMap, createAdjustment, validateAdjustment, cancelAdjustment } = useInventoryStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const filtered = adjustments.filter((a) => {
    const matchSearch = a.ref.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getLocName = (id) => locations.find((l) => l.id === id)?.name || '—';

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left"><h1>Inventory Adjustments</h1><p>Correct stock discrepancies from physical counts</p></div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}><Plus size={16} /> New Adjustment</button>
      </div>

      <div className="filters-bar">
        <div className="search-input-wrap"><Search size={14} className="search-icon" /><input className="search-input" placeholder="Search by reference…" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          {['draft','done','cancelled'].map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {filtered.length === 0 ? (
          <EmptyState title="No adjustments found" desc="Create an adjustment when physical count differs from system." action={<button className="btn btn-primary" onClick={() => setShowCreate(true)}><Plus size={14} /> New Adjustment</button>} />
        ) : (
          <div className="table-wrapper" style={{ border: 'none' }}>
            <table>
              <thead>
                <tr><th>Reference</th><th>Location</th><th>Lines</th><th>Notes</th><th>Date</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.82rem' }}>{a.ref}</td>
                    <td className="td-muted">{getLocName(a.locationId)}</td>
                    <td className="td-muted">{a.lines.length} product(s)</td>
                    <td className="td-muted" style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.notes || '—'}</td>
                    <td className="td-muted">{fmtDate(a.createdAt)}</td>
                    <td><Badge status={a.status} dot /></td>
                    <td>
                      {a.status !== 'done' && a.status !== 'cancelled' && (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-success btn-sm" onClick={() => setConfirm({ action: 'validate', id: a.id, ref: a.ref })}>
                            <CheckCircle size={13} /> Validate
                          </button>
                          <button className="btn btn-secondary btn-sm" onClick={() => setConfirm({ action: 'cancel', id: a.id, ref: a.ref })}>Cancel</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreate && (
        <Modal title="Create Inventory Adjustment" onClose={() => setShowCreate(false)} size="lg">
          <AdjustmentForm products={products} warehouses={warehouses} locations={locations} stockMap={stockMap}
            onSave={(data) => { createAdjustment(data); setShowCreate(false); toast.success('Adjustment created!'); }}
            onClose={() => setShowCreate(false)} />
        </Modal>
      )}

      {confirm && (
        <ConfirmDialog
          title={confirm.action === 'validate' ? 'Validate Adjustment' : 'Cancel Adjustment'}
          message={confirm.action === 'validate'
            ? `Validate ${confirm.ref}? Stock will be adjusted to the counted quantities.`
            : `Cancel ${confirm.ref}?`}
          onConfirm={() => {
            if (confirm.action === 'validate') { validateAdjustment(confirm.id); toast.success('Adjustment applied! Stock corrected.'); }
            else { cancelAdjustment(confirm.id); toast.success('Adjustment cancelled.'); }
            setConfirm(null);
          }}
          onCancel={() => setConfirm(null)}
          variant={confirm.action === 'validate' ? 'success' : 'danger'}
        />
      )}
    </div>
  );
}
