import React, { useRef, useEffect, useState } from 'react';
import { Scan, X, AlertCircle } from 'lucide-react';

export default function BarcodeScanner({ onScan, onClose, placeholder = 'Scan barcode or enter SKU...' }) {
  const inputRef = useRef(null);
  const [error, setError] = useState('');

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose?.();
      return;
    }

    if (e.key === 'Enter') {
      const value = inputRef.current?.value.trim();
      if (value) {
        setError('');
        onScan(value);
        inputRef.current.value = '';
      }
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: 'var(--color-bg-primary)',
        borderRadius: '12px',
        padding: '32px',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '8px',
              background: 'var(--color-primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Scan size={20} color="var(--color-primary)" />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Scan Product</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Ready to scan</div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} color="var(--color-text-secondary)" />
          </button>
        </div>

        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '8px',
            border: error ? '2px solid var(--color-danger)' : '1px solid var(--color-border)',
            background: 'var(--color-bg-secondary)',
            color: 'var(--color-text-primary)',
            fontSize: '1rem',
            fontFamily: 'monospace',
            marginBottom: error ? 12 : 24,
          }}
        />

        {error && (
          <div style={{
            display: 'flex',
            gap: 8,
            padding: '12px 16px',
            borderRadius: '8px',
            background: 'var(--color-danger-light)',
            color: 'var(--color-danger)',
            fontSize: '0.9rem',
            marginBottom: 24,
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>{error}</span>
          </div>
        )}

        <div style={{
          padding: '16px',
          borderRadius: '8px',
          background: 'var(--color-info-light)',
          fontSize: '0.85rem',
          color: 'var(--color-info)',
          lineHeight: 1.5,
        }}>
          <strong>How to use:</strong>
          <ul style={{ margin: '8px 0 0 16px', paddingLeft: 0 }}>
            <li>Scan barcode with scanner device</li>
            <li>Or manually enter SKU</li>
            <li>Press Enter to confirm</li>
            <li>Press Esc to close</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
