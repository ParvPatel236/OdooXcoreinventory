// Role-based access control configuration
export const ROLES = {
  MANAGER: 'Inventory Manager',
  STAFF: 'Warehouse Staff',
  ADMIN: 'Admin',
};

// Define which roles can access which pages
export const PAGE_ACCESS = {
  '/dashboard': [ROLES.MANAGER, ROLES.STAFF, ROLES.ADMIN],
  '/products': [ROLES.MANAGER, ROLES.ADMIN],
  '/categories': [ROLES.MANAGER, ROLES.ADMIN],
  '/operations/receipts': [ROLES.MANAGER, ROLES.STAFF, ROLES.ADMIN],
  '/operations/deliveries': [ROLES.MANAGER, ROLES.STAFF, ROLES.ADMIN],
  '/operations/transfers': [ROLES.MANAGER, ROLES.STAFF, ROLES.ADMIN],
  '/operations/adjustments': [ROLES.MANAGER, ROLES.ADMIN],
  '/history': [ROLES.MANAGER, ROLES.ADMIN],
  '/predictions': [ROLES.MANAGER, ROLES.ADMIN],
  '/barcodes': [ROLES.MANAGER, ROLES.STAFF, ROLES.ADMIN],
  '/quick-update': [ROLES.STAFF, ROLES.ADMIN],
  '/settings': [ROLES.MANAGER, ROLES.ADMIN],
  '/profile': [ROLES.MANAGER, ROLES.STAFF, ROLES.ADMIN],
};

// Define which features are visible for each role
export const FEATURE_ACCESS = {
  viewProducts: [ROLES.MANAGER, ROLES.ADMIN],
  editProducts: [ROLES.MANAGER, ROLES.ADMIN],
  viewCategories: [ROLES.MANAGER, ROLES.ADMIN],
  editCategories: [ROLES.MANAGER, ROLES.ADMIN],
  viewPredictions: [ROLES.MANAGER, ROLES.ADMIN],
  viewHistory: [ROLES.MANAGER, ROLES.ADMIN],
  viewSettings: [ROLES.MANAGER, ROLES.ADMIN],
  quickUpdate: [ROLES.STAFF, ROLES.ADMIN],
  barcodeScan: [ROLES.STAFF, ROLES.ADMIN],
  createReceipt: [ROLES.MANAGER, ROLES.STAFF, ROLES.ADMIN],
  createDelivery: [ROLES.MANAGER, ROLES.STAFF, ROLES.ADMIN],
  createTransfer: [ROLES.MANAGER, ROLES.STAFF, ROLES.ADMIN],
  createAdjustment: [ROLES.MANAGER, ROLES.ADMIN],
};

export const canAccessPage = (userRole, path) => {
  const allowedRoles = PAGE_ACCESS[path];
  return allowedRoles && allowedRoles.includes(userRole);
};

export const canAccessFeature = (userRole, feature) => {
  const allowedRoles = FEATURE_ACCESS[feature];
  return allowedRoles && allowedRoles.includes(userRole);
};
