import React from 'react';
import { AlertTriangle, TrendingDown, Clock } from 'lucide-react';
import { getCriticalPredictions } from '../../utils/stockPrediction';

const PredictionBadge = ({ status }) => {
  const styles = {
    critical: { bg: 'var(--color-danger-light)', color: 'var(--color-danger)', label: 'Critical' },
    warning: { bg: 'var(--color-warning-light)', color: 'var(--color-warning)', label: 'Warning' },
    safe: { bg: 'var(--color-success-light)', color: 'var(--color-success)', label: 'Safe' },
  };
  const style = styles[status] || styles.safe;
  return (
    <span
      style={{
        background: style.bg,
        color: style.color,
        padding: '3px 10px',
        borderRadius: '9999px',
        fontSize: '0.7rem',
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {style.label}
    </span>
  );
};

export default function PredictedShortagesWidget({ predictions }) {
  const criticalPredictions = getCriticalPredictions(predictions);

  if (criticalPredictions.length === 0) {
    return (
      <div className="card" style={{ background: 'var(--color-success-light)', border: '1px solid var(--color-success)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ color: 'var(--color-success)', fontSize: '1.5rem' }}>✓</div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--color-success)' }}>All Stock Levels Healthy</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-success)', opacity: 0.8 }}>No predicted shortages in the next 30 days</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertTriangle size={18} color="var(--color-warning)" />
          <div>
            <div className="card-title">⚠ Predicted Shortages</div>
            <div className="card-subtitle">{criticalPredictions.length} product(s) need attention</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {criticalPredictions.map((pred) => (
          <div
            key={pred.productId}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto auto',
              gap: 12,
              alignItems: 'center',
              padding: '12px 14px',
              background: 'var(--color-surface2)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text)' }}>
                {pred.productName}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                SKU: {pred.sku}
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>
                  <TrendingDown size={14} style={{ display: 'inline', marginRight: 4 }} />
                  Avg: {pred.avgDailyConsumption}/day
                </span>
                <span style={{ color: 'var(--color-text-secondary)' }}>
                  Stock: {pred.currentStock} / {pred.minStock}
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              {pred.daysRemaining !== null ? (
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: pred.status === 'critical' ? 'var(--color-danger)' : 'var(--color-warning)' }}>
                    {pred.daysRemaining}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                    days left
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  No consumption data
                </div>
              )}
            </div>

            <PredictionBadge status={pred.status} />
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(79,110,247,0.08)', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
        <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />
        Based on {30}-day consumption history. Predictions update daily.
      </div>
    </div>
  );
}
