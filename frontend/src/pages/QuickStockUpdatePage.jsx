import React, { useState } from 'react';
import { Scan, Plus, Minus, RotateCcw, Check, AlertCircle } from 'lucide-react';
import { useInventoryStore } from '../store/inventoryStore';
import { parseBarcode } from '../utils/barcode';
import BarcodeScanner from '../components/common/BarcodeScanner';
import Badge from '../components/common/Badge';

export default function QuickStockUpdatePage() {
  const { products, locations, stockMap, createAdjustment, validateAdjustment } = useInventoryStore();
  const [showScanner, setShowScanner] = useState(false);
  const [scannedItems, setScannedItems] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('loc_1');
  const [message, setMessage] = useState('');

  const handleScan = (barcode) => {
    const parsed = parseBarcode(barcode);
    if (!parsed) {
      setMessage({ type: 'error', text: 'Invalid barcode format' });
      return;
    }

    const product = products.find((p) => p.id === parsed.productId);
    if (!product) {
      setMessage({ type: 'error', text: `Product not found: ${parsed.sku}` });
      return;
    }

    const currentStock = stockMap[`${product.id}_${selectedLocation}`] || 0;
    const existing = scannedItems.find((item) => item.productId === product.id);

    if (existing) {
      setScannedItems(
        scannedItems.map((item) =>
          item.productId === product.id
            ? { ...item, countedQty: item.countedQty + 1 }
            : item
        )
      );
    } else {
      setScannedItems([
        ...scannedItems,
        {
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          systemQty: currentStock,
          countedQty: 1,
        },
      ]);
    }

    setMessage({ type: 'success', text: `Scanned: ${product.name}` });
    setShowScanner(false);
  };

  const updateQty = (productId, delta) => {
    setScannedItems(
      scannedItems.map((item) =>
        item.productId === productId
          ? { ...item, countedQty: Math.max(0, item.countedQty + delta) }
          : item
      )
    );
  };

  const removeItem = (productId) => {
    setScannedItems(scannedItems.filter((item) => item.productId !== productId));
  };

  const handleSubmit = () => {
    if (scannedItems.length === 0) {
      setMessage({ type: 'error', text: 'No items to adjust' });
      return;
    }

    const adj = createAdjustment({
      warehouseId: 'wh_1',
      locationId: selectedLocation,
      lines: scannedItems.map((item) => ({
        productId: item.productId,
        systemQty: item.systemQty,
        countedQty: item.countedQty,
        diff: item.countedQty - item.systemQty,
      })),
      notes: `Quick stock count via barcode scan - ${scannedItems.length} items`,
    });

    validateAdjustment(adj.id);
    setMessage({ type: 'success', text: `Adjustment saved: ${adj.ref}` });
    setScannedItems([]);
    setTimeout(() => setMessage(''), 3000);
  };

  const totalDiff = scannedItems.reduce((sum, item) => sum + (item.countedQty - item.systemQty), 0);

  return (
    <div>
      {showScanner && (
        <BarcodeScanner
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
        />
      )}

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ marginBottom: 8 }}>Quick Stock Update</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Scan products to quickly count and adjust inventory
        </p>
      </div>

      {message && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: 20,
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          background: message.type === 'error' ? 'var(--color-danger-light)' : 'var(--color-success-light)',
          color: message.type === 'error' ? 'var(--color-danger)' : 'var(--color-success)',
        }}>
          {message.type === 'error' ? <AlertCircle size={18} /> : <Check size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div className="card-title">Settings</div>
        </div>
        <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: 8 }}>
              Location
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
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
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <button
              onClick={() => setShowScanner(true)}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '6px',
                background: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Scan size={16} /> Scan Product
            </button>
          </div>
        </div>
      </div>

      {scannedItems.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Scan size={48} style={{ color: 'var(--color-text-secondary)', marginBottom: 16, opacity: 0.5 }} />
          <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 8 }}>No items scanned yet</div>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 20 }}>
            Click "Scan Product" to start counting inventory
          </p>
          <button
            onClick={() => setShowScanner(true)}
            style={{
              padding: '10px 20px',
              borderRadius: '6px',
              background: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Start Scanning
          </button>
        </div>
      ) : (
        <>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header">
              <div>
                <div className="card-title">Scanned Items ({scannedItems.length})</div>
                <div className="card-subtitle">Adjust quantities as needed</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setScannedItems([])}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <RotateCcw size={14} /> Clear
                </button>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem' }}>Product</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, fontSize: '0.9rem' }}>System</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem' }}>Counted</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, fontSize: '0.9rem' }}>Diff</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {scannedItems.map((item) => {
                    const diff = item.countedQty - item.systemQty;
                    return (
                      <tr key={item.productId} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontWeight: 600 }}>{item.productName}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{item.sku}</div>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600 }}>
                          {item.systemQty}
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                            <button
                              onClick={() => updateQty(item.productId, -1)}
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: '4px',
                                background: 'var(--color-bg-secondary)',
                                border: '1px solid var(--color-border)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Minus size={14} />
                            </button>
                            <span style={{ fontWeight: 700, minWidth: 30, textAlign: 'center' }}>
                              {item.countedQty}
                            </span>
                            <button
                              onClick={() => updateQty(item.productId, 1)}
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: '4px',
                                background: 'var(--color-primary)',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <span style={{
                            fontWeight: 700,
                            color: diff > 0 ? 'var(--color-success)' : diff < 0 ? 'var(--color-danger)' : 'var(--color-text-secondary)',
                          }}>
                            {diff > 0 ? '+' : ''}{diff}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <button
                            onClick={() => removeItem(item.productId)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '4px',
                              background: 'var(--color-danger-light)',
                              color: 'var(--color-danger)',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                            }}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 20 }}>
            <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 8 }}>Items Scanned</div>
              <div style={{ fontSize: '2rem', fontWeight: 700 }}>{scannedItems.length}</div>
            </div>
            <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 8 }}>Total Difference</div>
              <div style={{
                fontSize: '2rem',
                fontWeight: 700,
                color: totalDiff > 0 ? 'var(--color-success)' : totalDiff < 0 ? 'var(--color-danger)' : 'var(--color-text-primary)',
              }}>
                {totalDiff > 0 ? '+' : ''}{totalDiff}
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              background: 'var(--color-success)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <Check size={18} /> Save Adjustment
          </button>
        </>
      )}
    </div>
  );
}
