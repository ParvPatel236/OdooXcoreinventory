import React from 'react';
import { AlertTriangle, TrendingDown, Clock } from 'lucide-react';
import { getAllProductPredictions, getCriticalPredictions } from '../../utils/stockPrediction';
import Badge from './Badge';

export default function PredictionWidget({ products, stockMap, ledger }) {
  const allPredictions = getAllProductPredictions(products, stockMap, ledger);
  const criticalPredictions = getCriticalPredictions(allPredictions);

  if (criticalPredictions.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">⚠ Predicted Shortages</div>
            <div className="card-subtitle">AI-powered stock forecast</div>
          </div>
        </div>
        <p className="text-muted text-sm" style={{ padding: '16px' }}>
          All products have sufficient stock. No shortages predicted.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">⚠ Predicted Shortages</div>
          <div className="card-subtitle">AI-powered stock forecast</div>
        </div>
        <Badge status={`${criticalPredictions.length} Alert${criticalPredictions.length > 1 ? 's' : ''}`} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {criticalPredictions.map((pred) => (
          <div
            key={pred.productId}
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              background: pred.status === 'critical' ? 'var(--color-danger-light)' : 'var(--color-warning-light)',
              borderLeft: `4px solid ${pred.status === 'critical' ? 'var(--color-danger)' : 'var(--color-warning)'}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 4 }}>
                  {pred.productName}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', display: 'flex', gap: 16 }}>
                  <span>📦 Stock: {pred.currentStock} units</span>
                  <span>📊 Avg: {pred.avgDailyConsumption}/day</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', minWidth: 'fit-content' }}>
                {pred.daysRemaining !== null ? (
                  <>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: pred.status === 'critical' ? 'var(--color-danger)' : 'var(--color-warning)' }}>
                      {pred.daysRemaining} days
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                      until shortage
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                    No consumption
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
