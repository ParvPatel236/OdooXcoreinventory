import React, { useState } from 'react';
import { Barcode, QrCode, Download, Copy, Check } from 'lucide-react';
import { useInventoryStore } from '../store/inventoryStore';
import { generateBarcode, generateQRCodeURL, generateBarcodeImageURL } from '../utils/barcode';
import ProductBarcode from '../components/common/ProductBarcode';

export default function BarcodeManagementPage() {
  const { products } = useInventoryStore();
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.id || null);
  const [copied, setCopied] = useState('');
  const [view, setView] = useState('grid'); // grid or list

  const product = products.find((p) => p.id === selectedProduct);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  const downloadAllBarcodes = () => {
    products.forEach((prod) => {
      const barcode = generateBarcode(prod.sku, prod.id);
      const barcodeUrl = generateBarcodeImageURL(barcode);
      const link = document.createElement('a');
      link.href = barcodeUrl;
      link.download = `${prod.sku}-barcode.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ marginBottom: 8 }}>Barcode Management</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Generate, view, and download barcodes and QR codes for all products
        </p>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div className="card-title">Product Selection</div>
          <button
            onClick={downloadAllBarcodes}
            style={{
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
              gap: 6,
            }}
          >
            <Download size={14} /> Download All
          </button>
        </div>
        <div style={{ padding: '16px' }}>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-secondary)',
              color: 'var(--color-text-primary)',
              fontSize: '0.9rem',
            }}
          >
            {products.map((prod) => (
              <option key={prod.id} value={prod.id}>
                {prod.name} ({prod.sku})
              </option>
            ))}
          </select>
        </div>
      </div>

      {product && (
        <>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header">
              <div>
                <div className="card-title">{product.name}</div>
                <div className="card-subtitle">SKU: {product.sku}</div>
              </div>
            </div>
            <ProductBarcode product={product} />
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">All Barcodes</div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem' }}>Product</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem' }}>SKU</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem' }}>Barcode</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => {
                    const barcode = generateBarcode(prod.sku, prod.id);
                    const barcodeUrl = generateBarcodeImageURL(barcode);
                    const qrUrl = generateQRCodeURL(barcode);
                    return (
                      <tr key={prod.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>{prod.name}</td>
                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                          {prod.sku}
                        </td>
                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span>{barcode}</span>
                            <button
                              onClick={() => handleCopy(barcode, prod.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: 4,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: copied === prod.id ? 'var(--color-success)' : 'var(--color-text-secondary)',
                              }}
                            >
                              {copied === prod.id ? <Check size={14} /> : <Copy size={14} />}
                            </button>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                            <button
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = barcodeUrl;
                                link.download = `${prod.sku}-barcode.png`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                              style={{
                                padding: '6px 10px',
                                borderRadius: '4px',
                                background: 'var(--color-info-light)',
                                color: 'var(--color-info)',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                              }}
                            >
                              <Barcode size={12} /> Barcode
                            </button>
                            <button
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = qrUrl;
                                link.download = `${prod.sku}-qrcode.png`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                              style={{
                                padding: '6px 10px',
                                borderRadius: '4px',
                                background: 'var(--color-success-light)',
                                color: 'var(--color-success)',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                              }}
                            >
                              <QrCode size={12} /> QR
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
