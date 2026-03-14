import React from 'react';

export default function KPICard({ label, value, sub, icon: Icon, color = 'var(--color-primary)', bg = 'var(--color-primary-light)' }) {
  return (
    <div className="kpi-card" style={{ '--kpi-color': color, '--kpi-bg': bg }}>
      <div className="kpi-card-top">
        <div className="kpi-card-icon">
          {Icon && <Icon size={20} />}
        </div>
      </div>
      <div className="kpi-card-value">{value}</div>
      <div>
        <div className="kpi-card-label">{label}</div>
        {sub && <div className="kpi-card-sub">{sub}</div>}
      </div>
    </div>
  );
}
