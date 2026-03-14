import React from 'react';
import Modal from './Modal';

export default function ConfirmDialog({ title, message, onConfirm, onCancel, variant = 'danger' }) {
  return (
    <Modal title={title} onClose={onCancel}>
      <div className="modal-body">
        <p style={{ color: 'var(--color-text)' }}>{message}</p>
      </div>
      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button className={`btn btn-${variant}`} onClick={onConfirm}>Confirm</button>
      </div>
    </Modal>
  );
}
