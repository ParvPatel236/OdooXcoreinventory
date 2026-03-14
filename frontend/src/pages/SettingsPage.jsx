import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useInventoryStore } from '../store/inventoryStore';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import toast from 'react-hot-toast';

function Section({ title, children }) {
  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div className="card-header"><div className="card-title">{title}</div></div>
      {children}
    </div>
  );
}

function CrudTable({ items, columns, onAdd, onEdit, onDelete, addLabel }) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <button className="btn btn-primary btn-sm" onClick={onAdd}><Plus size={14} /> {addLabel}</button>
      </div>
      {items.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>No items yet.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead><tr>{columns.map((c) => <th key={c.key}>{c.label}</th>)}<th>Actions</th></tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  {columns.map((c) => <td key={c.key}>{c.render ? c.render(item) : item[c.key]}</td>)}
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {onEdit && <button className="btn btn-ghost btn-icon btn-sm" onClick={() => onEdit(item)}><Edit2 size={13} /></button>}
                      <button className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => onDelete(item)}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default function SettingsPage() {
  const { warehouses, locations, units, addWarehouse, updateWarehouse, deleteWarehouse, addLocation, updateLocation, deleteLocation, addUnit, deleteUnit } = useInventoryStore();

  // Warehouse modal
  const [whModal, setWhModal] = useState(null);
  const [whForm, setWhForm] = useState({ name: '', address: '' });

  // Location modal
  const [locModal, setLocModal] = useState(null);
  const [locForm, setLocForm] = useState({ name: '', zone: '', warehouseId: warehouses[0]?.id || '' });

  // Unit modal
  const [uomModal, setUomModal] = useState(null);
  const [uomForm, setUomForm] = useState({ name: '', label: '' });

  // Confirm
  const [confirm, setConfirm] = useState(null);

  const saveWarehouse = () => {
    if (!whForm.name) return toast.error('Name required.');
    if (whModal === 'create') addWarehouse(whForm);
    else updateWarehouse(whModal.id, whForm);
    toast.success(whModal === 'create' ? 'Warehouse added!' : 'Warehouse updated!');
    setWhModal(null);
  };

  const saveLocation = () => {
    if (!locForm.name || !locForm.warehouseId) return toast.error('Name and warehouse required.');
    if (locModal === 'create') addLocation(locForm);
    else updateLocation(locModal.id, locForm);
    toast.success(locModal === 'create' ? 'Location added!' : 'Location updated!');
    setLocModal(null);
  };

  const saveUnit = () => {
    if (!uomForm.name) return toast.error('Symbol required.');
    addUnit(uomForm);
    toast.success('Unit added!');
    setUomModal(null);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left"><h1>Settings</h1><p>Manage warehouses, locations, and configuration</p></div>
      </div>

      {/* Warehouses */}
      <Section title="Warehouses">
        <CrudTable
          items={warehouses}
          addLabel="Add Warehouse"
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'address', label: 'Address' },
            { key: 'active', label: 'Status', render: (w) => <span className={`badge badge-${w.active ? 'done' : 'cancelled'}`}>{w.active ? 'Active' : 'Inactive'}</span> },
          ]}
          onAdd={() => { setWhForm({ name: '', address: '' }); setWhModal('create'); }}
          onEdit={(w) => { setWhForm({ name: w.name, address: w.address }); setWhModal(w); }}
          onDelete={(w) => setConfirm({ type: 'warehouse', item: w })}
        />
      </Section>

      {/* Locations */}
      <Section title="Locations">
        <CrudTable
          items={locations}
          addLabel="Add Location"
          columns={[
            { key: 'name', label: 'Location Name' },
            { key: 'zone', label: 'Zone' },
            { key: 'warehouseId', label: 'Warehouse', render: (l) => warehouses.find((w) => w.id === l.warehouseId)?.name || '—' },
          ]}
          onAdd={() => { setLocForm({ name: '', zone: '', warehouseId: warehouses[0]?.id || '' }); setLocModal('create'); }}
          onEdit={(l) => { setLocForm({ name: l.name, zone: l.zone, warehouseId: l.warehouseId }); setLocModal(l); }}
          onDelete={(l) => setConfirm({ type: 'location', item: l })}
        />
      </Section>

      {/* Units of Measure */}
      <Section title="Units of Measure">
        <CrudTable
          items={units}
          addLabel="Add Unit"
          columns={[
            { key: 'name', label: 'Symbol' },
            { key: 'label', label: 'Label' },
          ]}
          onAdd={() => { setUomForm({ name: '', label: '' }); setUomModal('create'); }}
          onDelete={(u) => setConfirm({ type: 'unit', item: u })}
        />
      </Section>

      {/* Warehouse Modal */}
      {whModal && (
        <Modal title={whModal === 'create' ? 'Add Warehouse' : 'Edit Warehouse'} onClose={() => setWhModal(null)}>
          <div className="modal-body">
            <div className="form-group"><label className="form-label">Name *</label><input className="form-input" value={whForm.name} onChange={(e) => setWhForm((f) => ({ ...f, name: e.target.value }))} placeholder="Main Warehouse" /></div>
            <div className="form-group"><label className="form-label">Address</label><input className="form-input" value={whForm.address} onChange={(e) => setWhForm((f) => ({ ...f, address: e.target.value }))} placeholder="123 Industrial Zone" /></div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => setWhModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={saveWarehouse}>{whModal === 'create' ? 'Create' : 'Update'}</button>
          </div>
        </Modal>
      )}

      {/* Location Modal */}
      {locModal && (
        <Modal title={locModal === 'create' ? 'Add Location' : 'Edit Location'} onClose={() => setLocModal(null)}>
          <div className="modal-body">
            <div className="form-row cols-2">
              <div className="form-group"><label className="form-label">Location Name *</label><input className="form-input" value={locForm.name} onChange={(e) => setLocForm((f) => ({ ...f, name: e.target.value }))} placeholder="Rack A" /></div>
              <div className="form-group"><label className="form-label">Zone</label><input className="form-input" value={locForm.zone} onChange={(e) => setLocForm((f) => ({ ...f, zone: e.target.value }))} placeholder="A, B, C…" /></div>
            </div>
            <div className="form-group"><label className="form-label">Warehouse *</label>
              <select className="form-input form-select" value={locForm.warehouseId} onChange={(e) => setLocForm((f) => ({ ...f, warehouseId: e.target.value }))}>
                {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => setLocModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={saveLocation}>{locModal === 'create' ? 'Create' : 'Update'}</button>
          </div>
        </Modal>
      )}

      {/* UOM Modal */}
      {uomModal && (
        <Modal title="Add Unit of Measure" onClose={() => setUomModal(null)}>
          <div className="modal-body">
            <div className="form-row cols-2">
              <div className="form-group"><label className="form-label">Symbol *</label><input className="form-input" value={uomForm.name} onChange={(e) => setUomForm((f) => ({ ...f, name: e.target.value }))} placeholder="kg, pcs, L…" /></div>
              <div className="form-group"><label className="form-label">Label</label><input className="form-input" value={uomForm.label} onChange={(e) => setUomForm((f) => ({ ...f, label: e.target.value }))} placeholder="Kilograms" /></div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => setUomModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={saveUnit}>Create</button>
          </div>
        </Modal>
      )}

      {/* Confirm Delete */}
      {confirm && (
        <ConfirmDialog
          title={`Delete ${confirm.type.charAt(0).toUpperCase() + confirm.type.slice(1)}`}
          message={`Delete "${confirm.item.name}"?`}
          onConfirm={() => {
            if (confirm.type === 'warehouse') deleteWarehouse(confirm.item.id);
            else if (confirm.type === 'location') deleteLocation(confirm.item.id);
            else deleteUnit(confirm.item.id);
            toast.success('Deleted!');
            setConfirm(null);
          }}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
