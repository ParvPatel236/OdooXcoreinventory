import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout
import AppShell from './components/Layout/AppShell';
import ProtectedRoute from './components/ProtectedRoute';

// Auth
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// App pages
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/products/ProductsPage';
import CategoriesPage from './pages/products/CategoriesPage';
import ReceiptsPage from './pages/operations/ReceiptsPage';
import DeliveriesPage from './pages/operations/DeliveriesPage';
import TransfersPage from './pages/operations/TransfersPage';
import AdjustmentsPage from './pages/operations/AdjustmentsPage';
import MoveHistoryPage from './pages/MoveHistoryPage';
import StockPredictionsPage from './pages/StockPredictionsPage';
import BarcodeManagementPage from './pages/BarcodeManagementPage';
import QuickStockUpdatePage from './pages/QuickStockUpdatePage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '10px',
            background: '#1a1d2b',
            color: '#fff',
            fontSize: '0.875rem',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected app routes */}
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<ProtectedRoute path="/dashboard" element={<DashboardPage />} />} />
          <Route path="/products" element={<ProtectedRoute path="/products" element={<ProductsPage />} />} />
          <Route path="/categories" element={<ProtectedRoute path="/categories" element={<CategoriesPage />} />} />
          <Route path="/operations/receipts" element={<ProtectedRoute path="/operations/receipts" element={<ReceiptsPage />} />} />
          <Route path="/operations/deliveries" element={<ProtectedRoute path="/operations/deliveries" element={<DeliveriesPage />} />} />
          <Route path="/operations/transfers" element={<ProtectedRoute path="/operations/transfers" element={<TransfersPage />} />} />
          <Route path="/operations/adjustments" element={<ProtectedRoute path="/operations/adjustments" element={<AdjustmentsPage />} />} />
          <Route path="/history" element={<ProtectedRoute path="/history" element={<MoveHistoryPage />} />} />
          <Route path="/predictions" element={<ProtectedRoute path="/predictions" element={<StockPredictionsPage />} />} />
          <Route path="/barcodes" element={<ProtectedRoute path="/barcodes" element={<BarcodeManagementPage />} />} />
          <Route path="/quick-update" element={<ProtectedRoute path="/quick-update" element={<QuickStockUpdatePage />} />} />
          <Route path="/settings" element={<ProtectedRoute path="/settings" element={<SettingsPage />} />} />
          <Route path="/profile" element={<ProtectedRoute path="/profile" element={<ProfilePage />} />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
