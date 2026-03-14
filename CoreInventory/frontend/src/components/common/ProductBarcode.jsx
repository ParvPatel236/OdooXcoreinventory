import React, { useState } from 'react';
import { Download, Copy, Check } from 'lucide-react';
import { generateBarcode, generateQRCodeURL, generateBarcodeImageURL } from '../../utils/barcode';

export default function ProductBarcode({ product }) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const barcode = generateBarcode(product.sku, product.id);
  const qrUrl = generateQRCodeURL(barcode);
  const barcodeUrl = generateBarcodeImageURL(barcode);

  const handleCopy = () => {
    navigator.clipboard.writeText(barcode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadImage = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{
      padding: '16px',
      borderRadius: '8px',
      background: 'var(--color-bg-secondary)',
      border: '1px solid var(--color-border)',
    }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
          Product Barcode
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          borderRadius: '6px',
          background: 'var(--color-bg-primary)',
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          fontWeight: 600,
        }}>
          <span>{barcode}</span>
          <button
            onClick={handleCopy}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: copied ? 'var(--color-success)' : 'var(--color-text-secondary)',
            }}
            title="Copy barcode"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {/* Barcode */}
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
            Barcode (Code128)
          </div>
          <div style={{
            padding: '12px',
            borderRadius: '6px',
            background: 'var(--color-bg-primary)',
            textAlign: 'center',
            marginBottom: 8,
          }}>
            <img
              src={barcodeUrl}
              alt="Barcode"
              style={{ maxWidth: '100%', height: 'auto' }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <button
            onClick={() => downloadImage(barcodeUrl, `${product.sku}-barcode.png`)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              background: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Download size={14} /> Download
          </button>
        </div>

        {/* QR Code */}
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
            QR Code
          </div>
          <div style={{
            padding: '12px',
            borderRadius: '6px',
            background: 'white',
            textAlign: 'center',
            marginBottom: 8,
          }}>
            <img
              src={qrUrl}
              alt="QR Code"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
          <button
            onClick={() => downloadImage(qrUrl, `${product.sku}-qrcode.png`)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              background: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Download size={14} /> Download
          </button>
        </div>
      </div>
    </div>
  );
}
