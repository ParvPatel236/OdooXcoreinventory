import React, { useState } from 'react';
import { TrendingDown, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useInventoryStore } from '../store/inventoryStore';
import { getAllProductPredictions } from '../utils/stockPrediction';
import Badge from '../components/common/Badge';

export default function StockPredictionsPage() {
  const { products, stockMap, stockLedger } = useInventoryStore();
  const [filterStatus, setFilterStatus] = useState('all');

  const allPredictions = getAllProductPredictions(products, stockMap, stockLedger);

  const filtered = filterStatus === 'all'
    ? allPredictions
    : allPredictions.filter((p) => p.status === filterStatus);

  const stats = {
    critical: allPredictions.filter((p) => p.status === 'critical').length,
    warning: allPredictions.filter((p) => p.status === 'warning').length,
    safe: allPredictions.filter((p) => p.status === 'safe').length,
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ marginBottom: 8 }}>Stock Predictions</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          AI-powered forecasting based on historical consumption patterns
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <AlertTriangle size={20} color="var(--color-danger)" />
            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Critical</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-danger)' }}>
            {stats.critical}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
            Will run out in ≤3 days
          </div>
        </div>

        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <Clock size={20} color="var(--color-warning)" />
            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Warning</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-warning)' }}>
            {stats.warning}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
            Will run out in 3-7 days
          </div>
        </div>

        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <CheckCircle size={20} color="var(--color-success)" />
            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Safe</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-success)' }}>
            {stats.safe}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
            Stock level is healthy
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['all', 'critical', 'warning', 'safe'].map((status) => (
          <button
            key={status}
            className={`btn ${filterStatus === status ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterStatus(status)}
            style={{ textTransform: 'capitalize' }}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Predictions Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">All Products</div>
        </div>
        {filtered.length === 0 ? (
          <p className="text-muted text-sm" style={{ padding: '16px' }}>
            No products in this category.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem' }}>Product</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, fontSize: '0.9rem' }}>Current Stock</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, fontSize: '0.9rem' }}>Min Stock</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, fontSize: '0.9rem' }}>Avg Daily Use</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, fontSize: '0.9rem' }}>Days Remaining</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((pred) => (
                  <tr key={pred.productId} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 500 }}>{pred.productName}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{pred.sku}</div>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <span style={{ fontWeight: 600 }}>{pred.currentStock}</span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      {pred.minStock}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      {pred.avgDailyConsumption.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      {pred.daysRemaining !== null ? (
                        <span style={{ fontWeight: 600, color: pred.status === 'critical' ? 'var(--color-danger)' : pred.status === 'warning' ? 'var(--color-warning)' : 'var(--color-success)' }}>
                          {pred.daysRemaining} days
                        </span>
                      ) : (
                        <span style={{ color: 'var(--color-text-secondary)' }}>N/A</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <Badge status={pred.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* How It Works */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-header">
          <div className="card-title">How Predictions Work</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, padding: '16px' }}>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '1.5rem' }}>📊</span> Historical Analysis
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              System analyzes past 30 days of stock movements including deliveries, transfers, and adjustments.
            </p>
          </div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '1.5rem' }}>📈</span> Consumption Rate
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              Calculates average daily consumption based on outgoing stock movements.
            </p>
          </div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '1.5rem' }}>⏰</span> Shortage Forecast
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              Predicts when stock will reach minimum threshold based on current consumption rate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
