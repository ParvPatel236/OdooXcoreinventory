import React, { useState } from 'react';
import {
  Package, AlertTriangle, XCircle, ArrowDownToLine,
  ArrowUpFromLine, ArrowLeftRight, ClipboardList, Plus
} from 'lucide-react';
import { useInventoryStore } from '../store/inventoryStore';
import KPICard from '../components/common/KPICard';
import Badge from '../components/common/Badge';
import StockChart from '../components/charts/StockChart';
import MovementChart from '../components/charts/MovementChart';
import PredictionWidget from '../components/common/PredictionWidget';
import { fmtRelative } from '../utils/date';
import { useNavigate } from 'react-router-dom';

const TYPE_ICON = {
  receipt: ArrowDownToLine,
  delivery: ArrowUpFromLine,
  transfer: ArrowLeftRight,
  adjustment: ClipboardList,
};

const TYPE_COLOR = {
  receipt: { bg: 'var(--color-info-light)', color: 'var(--color-info)' },
  delivery: { bg: 'var(--color-purple-light)', color: 'var(--color-purple)' },
  transfer: { bg: 'var(--color-success-light)', color: 'var(--color-success)' },
  adjustment: { bg: 'var(--color-warning-light)', color: 'var(--color-warning)' },
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { products, stockMap, receipts, deliveries, transfers, adjustments, stockLedger } = useInventoryStore();
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // KPI calculations
  const totalProducts = products.length;
  const productStocks = products.map((p) => ({
    ...p,
    total: Object.entries(stockMap).filter(([k]) => k.startsWith(`${p.id}_`)).reduce((s, [, v]) => s + v, 0),
  }));
  const lowStock = productStocks.filter((p) => p.total > 0 && p.total <= p.minStock).length;
  const outStock = productStocks.filter((p) => p.total <= 0).length;
  const pendingReceipts = receipts.filter((r) => ['draft', 'waiting', 'ready'].includes(r.status)).length;
  const pendingDeliveries = deliveries.filter((d) => ['draft', 'waiting', 'ready'].includes(d.status)).length;
  const pendingTransfers = transfers.filter((t) => ['waiting', 'ready'].includes(t.status)).length;

  // Activity feed from ledger (most recent first)
  const recentActivity = [...stockLedger]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  return (
    <div>
      {/* Alert Banner */}
      {(lowStock + outStock) > 0 && (
        <div className="alert-banner">
          <AlertTriangle size={18} />
          <span>
            <strong>{lowStock + outStock} product(s)</strong> need attention:
            {outStock > 0 && ` ${outStock} out of stock,`}
            {lowStock > 0 && ` ${lowStock} low stock.`}
            {' '}
            <button className="btn" style={{ color: 'var(--color-warning)', padding: '0 4px', fontWeight: 600, fontSize: '0.8rem' }} onClick={() => navigate('/products')}>View Products →</button>
          </span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="kpi-grid">
        <KPICard label="Total Products" value={totalProducts} icon={Package} sub="Across all locations" />
        <KPICard label="Low Stock Items" value={lowStock} icon={AlertTriangle} color="var(--color-warning)" bg="var(--color-warning-light)" sub="Below reorder point" />
        <KPICard label="Out of Stock" value={outStock} icon={XCircle} color="var(--color-danger)" bg="var(--color-danger-light)" sub="Zero inventory" />
        <KPICard label="Pending Receipts" value={pendingReceipts} icon={ArrowDownToLine} color="var(--color-info)" bg="var(--color-info-light)" sub="Awaiting validation" />
        <KPICard label="Pending Deliveries" value={pendingDeliveries} icon={ArrowUpFromLine} color="var(--color-purple)" bg="var(--color-purple-light)" sub="In progress" />
        <KPICard label="Pending Transfers" value={pendingTransfers} icon={ArrowLeftRight} color="var(--color-success)" bg="var(--color-success-light)" sub="Internal movements" />
      </div>

      {/* Predictions Widget */}
      <PredictionWidget products={products} stockMap={stockMap} ledger={stockLedger} />

      {/* Charts */}
      <div className="charts-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Stock Levels by Product</div>
              <div className="card-subtitle">Top 10 products by current quantity</div>
            </div>
          </div>
          <StockChart products={products} stockMap={stockMap} />
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Movement Trends</div>
              <div className="card-subtitle">Last 14 days</div>
            </div>
          </div>
          <MovementChart ledger={stockLedger} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Recent Activity</div>
            <div className="card-subtitle">Latest stock movements</div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/history')}>View All</button>
        </div>
        {recentActivity.length === 0 ? (
          <p className="text-muted text-sm">No activity yet.</p>
        ) : (
          <div className="activity-feed">
            {recentActivity.map((entry) => {
              const Icon = TYPE_ICON[entry.type] || Package;
              const colors = TYPE_COLOR[entry.type] || {};
              const product = products.find((p) => p.id === entry.productId);
              return (
                <div className="activity-item" key={entry.id}>
                  <div className="activity-icon" style={{ background: colors.bg, color: colors.color }}>
                    <Icon size={16} />
                  </div>
                  <div className="activity-text">
                    <div className="activity-title">
                      {product?.name || 'Unknown Product'} <Badge status={entry.type} />
                    </div>
                    <div className="activity-desc">
                      {entry.qty > 0 ? '+' : ''}{entry.qty} units • Ref: {entry.ref}
                      {entry.note && ` • ${entry.note}`}
                    </div>
                  </div>
                  <div className="activity-time">{fmtRelative(entry.date)}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-header">
          <div className="card-title">Quick Actions</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          {[
            { label: 'New Receipt', icon: ArrowDownToLine, path: '/operations/receipts', color: 'var(--color-info)' },
            { label: 'New Delivery', icon: ArrowUpFromLine, path: '/operations/deliveries', color: 'var(--color-purple)' },
            { label: 'New Transfer', icon: ArrowLeftRight, path: '/operations/transfers', color: 'var(--color-success)' },
            { label: 'New Adjustment', icon: ClipboardList, path: '/operations/adjustments', color: 'var(--color-warning)' },
            { label: 'Add Product', icon: Package, path: '/products', color: 'var(--color-primary)' },
          ].map((a) => (
            <button
              key={a.label}
              className="btn btn-secondary"
              style={{ justifyContent: 'flex-start', gap: 10, padding: '12px 16px' }}
              onClick={() => navigate(a.path)}
            >
              <a.icon size={16} color={a.color} />
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
