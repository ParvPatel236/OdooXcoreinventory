import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Warehouse, AlertCircle } from 'lucide-react';
import { useInventoryStore } from '../../store/inventoryStore';
import ThemeToggle from '../ThemeToggle';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/products': 'Products',
  '/categories': 'Categories',
  '/operations/receipts': 'Receipts',
  '/operations/deliveries': 'Deliveries',
  '/operations/transfers': 'Internal Transfers',
  '/operations/adjustments': 'Inventory Adjustments',
  '/history': 'Move History',
  '/settings': 'Settings',
  '/profile': 'My Profile',
};

export default function Topbar() {
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'CoreInventory';
  const warehouses = useInventoryStore((s) => s.warehouses);
  const currentWarehouseId = useInventoryStore((s) => s.currentWarehouseId);
  const setCurrentWarehouse = useInventoryStore((s) => s.setCurrentWarehouse);
  const products = useInventoryStore((s) => s.products);
  const stockMap = useInventoryStore((s) => s.stockMap);

  const lowStockItems = products.filter((p) => {
    const total = Object.entries(stockMap)
      .filter(([k]) => k.startsWith(`${p.id}_`))
      .reduce((s, [, v]) => s + v, 0);
    return total <= p.minStock;
  });

  const lowCount = lowStockItems.length;

  return (
    <header className="topbar">
      <h1 className="topbar-title">{title}</h1>
      <div className="topbar-actions">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Warehouse Selector */}
        <div className="topbar-warehouse-selector">
          <Warehouse size={15} color="var(--color-text-muted)" />
          <select
            value={currentWarehouseId}
            onChange={(e) => setCurrentWarehouse(e.target.value)}
          >
            <option value="">All Warehouses</option>
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
        </div>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button 
            className="topbar-icon-btn"
            onClick={() => setNotifOpen(!notifOpen)}
            type="button"
          >
            <Bell size={18} />
            {lowCount > 0 && <span className="notif-dot" />}
          </button>
          
          {notifOpen && (
            <div className="notif-panel">
              <div className="notif-header">
                <h3>Notifications</h3>
                {lowCount === 0 && <span className="notif-badge">All clear</span>}
              </div>
              <div className="notif-content">
                {lowCount > 0 ? (
                  <div className="notif-list">
                    {lowStockItems.map((p) => {
                      const total = Object.entries(stockMap)
                        .filter(([k]) => k.startsWith(`${p.id}_`))
                        .reduce((s, [, v]) => s + v, 0);
                      return (
                        <div key={p.id} className="notif-item">
                          <AlertCircle size={16} className="notif-icon" />
                          <div className="notif-text">
                            <div className="notif-title">{p.name}</div>
                            <div className="notif-desc">Stock: {total} / Min: {p.minStock}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="notif-empty">
                    <Bell size={24} />
                    <p>No notifications</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
