import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ArrowDownToLine, ArrowUpFromLine,
  ArrowLeftRight, ClipboardList, History, Settings, ChevronDown,
  ChevronRight, Boxes, Tag, User, LogOut, TrendingDown, Barcode, Zap
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useInventoryStore } from '../../store/inventoryStore';
import { canAccessFeature } from '../../utils/roleAccess';

export default function Sidebar() {
  const [opsOpen, setOpsOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const products = useInventoryStore((s) => s.products);
  const stockMap = useInventoryStore((s) => s.stockMap);

  // compute low stock alert count
  const lowCount = products.filter((p) => {
    const total = Object.entries(stockMap)
      .filter(([k]) => k.startsWith(`${p.id}_`))
      .reduce((s, [, v]) => s + v, 0);
    return total <= p.minStock;
  }).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Boxes size={20} color="#fff" />
        </div>
        <div>
          <div className="sidebar-logo-text">CoreInventory</div>
          <div className="sidebar-logo-sub">IMS Platform</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <span className="sidebar-section-label">Overview</span>

        <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
          <LayoutDashboard size={17} className="nav-icon" /> Dashboard
          {lowCount > 0 && <span className="nav-badge">{lowCount}</span>}
        </NavLink>

        <span className="sidebar-section-label">Inventory</span>

        {canAccessFeature(user?.role, 'viewProducts') && (
          <>
            <NavLink to="/products" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
              <Package size={17} className="nav-icon" /> Products
            </NavLink>

            <NavLink to="/categories" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
              <Tag size={17} className="nav-icon" /> Categories
            </NavLink>
          </>
        )}

        <span className="sidebar-section-label">Operations</span>

        {/* Operations collapsible */}
        <button
          className="sidebar-link"
          style={{ width: '100%', textAlign: 'left' }}
          onClick={() => setOpsOpen((o) => !o)}
        >
          <ClipboardList size={17} className="nav-icon" />
          Operations
          <span style={{ marginLeft: 'auto' }}>
            {opsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        </button>

        {opsOpen && (
          <div className="sidebar-submenu">
            <NavLink to="/operations/receipts" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
              <ArrowDownToLine size={15} className="nav-icon" /> Receipts
            </NavLink>
            <NavLink to="/operations/deliveries" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
              <ArrowUpFromLine size={15} className="nav-icon" /> Deliveries
            </NavLink>
            <NavLink to="/operations/transfers" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
              <ArrowLeftRight size={15} className="nav-icon" /> Transfers
            </NavLink>
            {canAccessFeature(user?.role, 'createAdjustment') && (
              <NavLink to="/operations/adjustments" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
                <ClipboardList size={15} className="nav-icon" /> Adjustments
              </NavLink>
            )}
          </div>
        )}

        {canAccessFeature(user?.role, 'viewHistory') && (
          <NavLink to="/history" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <History size={17} className="nav-icon" /> Move History
          </NavLink>
        )}

        {canAccessFeature(user?.role, 'viewPredictions') && (
          <NavLink to="/predictions" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <TrendingDown size={17} className="nav-icon" /> Predictions
          </NavLink>
        )}

        {canAccessFeature(user?.role, 'barcodeScan') && (
          <NavLink to="/barcodes" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <Barcode size={17} className="nav-icon" /> Barcodes
          </NavLink>
        )}

        {canAccessFeature(user?.role, 'quickUpdate') && (
          <NavLink to="/quick-update" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <Zap size={17} className="nav-icon" /> Quick Update
          </NavLink>
        )}

        <span className="sidebar-section-label">System</span>

        {canAccessFeature(user?.role, 'viewSettings') && (
          <NavLink to="/settings" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <Settings size={17} className="nav-icon" /> Settings
          </NavLink>
        )}
      </nav>

      {/* User Footer */}
      <div className="sidebar-footer" style={{ position: 'relative' }}>
        {profileOpen && (
          <div className="profile-dropdown">
            <button 
              className="profile-dropdown-item" 
              onClick={() => { navigate('/profile'); setProfileOpen(false); }}
              type="button"
            >
              <User size={15} /> My Profile
            </button>
            <div className="divider" style={{ margin: 0 }} />
            <button 
              className="profile-dropdown-item danger" 
              onClick={handleLogout}
              type="button"
            >
              <LogOut size={15} /> Logout
            </button>
          </div>
        )}
        <button 
          className="sidebar-user" 
          onClick={() => setProfileOpen((o) => !o)}
          type="button"
        >
          <div className="sidebar-avatar">{user?.avatar || 'U'}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name || 'User'}</div>
            <div className="sidebar-user-role">{user?.role || 'Staff'}</div>
          </div>
          <ChevronDown size={14} color="rgba(255,255,255,0.35)" />
        </button>
      </div>
    </aside>
  );
}
