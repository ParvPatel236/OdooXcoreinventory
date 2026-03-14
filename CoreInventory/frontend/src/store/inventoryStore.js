import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { genId } from '../utils/id';
import { nowISO } from '../utils/date';

// ---- Seed Data ---- //
const SEED_WAREHOUSES = [
  { id: 'wh_1', name: 'Main Warehouse', address: 'Block A, Industrial Zone', active: true },
  { id: 'wh_2', name: 'North Depot', address: '12 North Road, Sector 5', active: true },
];

const SEED_LOCATIONS = [
  { id: 'loc_1', warehouseId: 'wh_1', name: 'Main Store', zone: 'A' },
  { id: 'loc_2', warehouseId: 'wh_1', name: 'Production Rack', zone: 'B' },
  { id: 'loc_3', warehouseId: 'wh_1', name: 'Rack A', zone: 'A' },
  { id: 'loc_4', warehouseId: 'wh_2', name: 'North Store', zone: 'A' },
  { id: 'loc_5', warehouseId: 'wh_2', name: 'Dispatch Bay', zone: 'B' },
];

const SEED_CATEGORIES = [
  { id: 'cat_1', name: 'Raw Materials' },
  { id: 'cat_2', name: 'Finished Goods' },
  { id: 'cat_3', name: 'Packaging' },
  { id: 'cat_4', name: 'Tools & Equipment' },
  { id: 'cat_5', name: 'Electronics' },
];

const SEED_UNITS = [
  { id: 'uom_1', name: 'kg', label: 'Kilograms' },
  { id: 'uom_2', name: 'pcs', label: 'Pieces' },
  { id: 'uom_3', name: 'L', label: 'Litres' },
  { id: 'uom_4', name: 'm', label: 'Metres' },
  { id: 'uom_5', name: 'box', label: 'Box' },
];

const SEED_PRODUCTS = [
  { id: 'prd_1', name: 'Steel Rods', sku: 'STL-001', categoryId: 'cat_1', uomId: 'uom_1', minStock: 20 },
  { id: 'prd_2', name: 'Aluminium Sheets', sku: 'ALM-002', categoryId: 'cat_1', uomId: 'uom_1', minStock: 15 },
  { id: 'prd_3', name: 'Steel Frames', sku: 'FRM-003', categoryId: 'cat_2', uomId: 'uom_2', minStock: 10 },
  { id: 'prd_4', name: 'Cardboard Boxes', sku: 'PKG-004', categoryId: 'cat_3', uomId: 'uom_5', minStock: 50 },
  { id: 'prd_5', name: 'Welding Rod Set', sku: 'TLS-005', categoryId: 'cat_4', uomId: 'uom_2', minStock: 5 },
  { id: 'prd_6', name: 'Copper Wire', sku: 'ELC-006', categoryId: 'cat_5', uomId: 'uom_4', minStock: 30 },
  { id: 'prd_7', name: 'Plastic Pellets', sku: 'RAW-007', categoryId: 'cat_1', uomId: 'uom_1', minStock: 100 },
  { id: 'prd_8', name: 'Office Chairs', sku: 'FRN-008', categoryId: 'cat_2', uomId: 'uom_2', minStock: 5 },
  { id: 'prd_9', name: 'Bubble Wrap Roll', sku: 'PKG-009', categoryId: 'cat_3', uomId: 'uom_4', minStock: 20 },
  { id: 'prd_10', name: 'Circuit Boards', sku: 'ELC-010', categoryId: 'cat_5', uomId: 'uom_2', minStock: 10 },
];

// stockMap: { [productId_locationId]: qty }
const SEED_STOCK = {
  'prd_1_loc_1': 120,
  'prd_1_loc_2': 35,
  'prd_2_loc_1': 80,
  'prd_2_loc_3': 40,
  'prd_3_loc_1': 25,
  'prd_3_loc_5': 10,
  'prd_4_loc_1': 200,
  'prd_4_loc_4': 150,
  'prd_5_loc_1': 8,
  'prd_5_loc_2': 3,   // low stock
  'prd_6_loc_4': 95,
  'prd_7_loc_1': 500,
  'prd_8_loc_5': 12,
  'prd_9_loc_1': 0,   // out of stock
  'prd_9_loc_4': 0,
  'prd_10_loc_4': 18,
};

// Reference prefix helpers
const makeRef = (prefix) => `${prefix}/${new Date().getFullYear()}/${String(Math.floor(Math.random()*9000)+1000)}`;

const SEED_RECEIPTS = [
  {
    id: 'rec_1', ref: 'REC/2026/0001', supplier: 'MetalCorp Ltd',
    status: 'done', warehouseId: 'wh_1', locationId: 'loc_1',
    createdAt: '2026-03-01T09:00:00Z', validatedAt: '2026-03-01T11:00:00Z',
    lines: [
      { productId: 'prd_1', expectedQty: 100, receivedQty: 100 },
      { productId: 'prd_2', receivedQty: 80, expectedQty: 80 },
    ],
    notes: 'First batch from MetalCorp',
  },
  {
    id: 'rec_2', ref: 'REC/2026/0002', supplier: 'PackStar Inc',
    status: 'done', warehouseId: 'wh_1', locationId: 'loc_1',
    createdAt: '2026-03-05T10:00:00Z', validatedAt: '2026-03-05T14:00:00Z',
    lines: [
      { productId: 'prd_4', expectedQty: 200, receivedQty: 200 },
    ],
    notes: '',
  },
  {
    id: 'rec_3', ref: 'REC/2026/0003', supplier: 'ElecSupply Co',
    status: 'ready', warehouseId: 'wh_2', locationId: 'loc_4',
    createdAt: '2026-03-10T08:00:00Z', validatedAt: null,
    lines: [
      { productId: 'prd_6', expectedQty: 100, receivedQty: 0 },
      { productId: 'prd_10', expectedQty: 20, receivedQty: 0 },
    ],
    notes: 'Awaiting delivery',
  },
  {
    id: 'rec_4', ref: 'REC/2026/0004', supplier: 'PlastiX',
    status: 'draft', warehouseId: 'wh_1', locationId: 'loc_1',
    createdAt: '2026-03-12T10:00:00Z', validatedAt: null,
    lines: [
      { productId: 'prd_7', expectedQty: 500, receivedQty: 0 },
    ],
    notes: '',
  },
];

const SEED_DELIVERIES = [
  {
    id: 'del_1', ref: 'DEL/2026/0001', customer: 'SteelWorks Corp',
    status: 'done', warehouseId: 'wh_1', locationId: 'loc_1',
    step: 3,
    createdAt: '2026-03-03T09:00:00Z', validatedAt: '2026-03-03T16:00:00Z',
    lines: [
      { productId: 'prd_1', qty: 30 },
      { productId: 'prd_3', qty: 5 },
    ],
    notes: 'Express delivery',
  },
  {
    id: 'del_2', ref: 'DEL/2026/0002', customer: 'FurniMart',
    status: 'ready', warehouseId: 'wh_2', locationId: 'loc_5',
    step: 1,
    createdAt: '2026-03-08T11:00:00Z', validatedAt: null,
    lines: [
      { productId: 'prd_8', qty: 5 },
    ],
    notes: '',
  },
  {
    id: 'del_3', ref: 'DEL/2026/0003', customer: 'TechZone',
    status: 'draft', warehouseId: 'wh_2', locationId: 'loc_4',
    step: 0,
    createdAt: '2026-03-13T09:00:00Z', validatedAt: null,
    lines: [
      { productId: 'prd_10', qty: 3 },
    ],
    notes: '',
  },
];

const SEED_TRANSFERS = [
  {
    id: 'trf_1', ref: 'TRF/2026/0001',
    fromLocationId: 'loc_1', toLocationId: 'loc_2',
    status: 'done', warehouseId: 'wh_1',
    createdAt: '2026-03-02T13:00:00Z', validatedAt: '2026-03-02T14:00:00Z',
    lines: [{ productId: 'prd_1', qty: 35 }],
    notes: 'Move to production',
  },
  {
    id: 'trf_2', ref: 'TRF/2026/0002',
    fromLocationId: 'loc_1', toLocationId: 'loc_4',
    status: 'waiting', warehouseId: 'wh_1',
    createdAt: '2026-03-11T08:00:00Z', validatedAt: null,
    lines: [{ productId: 'prd_4', qty: 100 }],
    notes: 'Stock balancing',
  },
];

const SEED_ADJUSTMENTS = [
  {
    id: 'adj_1', ref: 'ADJ/2026/0001',
    warehouseId: 'wh_1', locationId: 'loc_2',
    status: 'done',
    createdAt: '2026-03-06T10:00:00Z', validatedAt: '2026-03-06T11:00:00Z',
    lines: [{ productId: 'prd_1', systemQty: 38, countedQty: 35, diff: -3 }],
    notes: '3 kg found damaged',
  },
];

const SEED_LEDGER = [
  { id: 'led_1', type: 'receipt', ref: 'REC/2026/0001', productId: 'prd_1', fromLocationId: null, toLocationId: 'loc_1', qty: 100, date: '2026-03-01T11:00:00Z', userId: 'user_1', note: '' },
  { id: 'led_2', type: 'receipt', ref: 'REC/2026/0001', productId: 'prd_2', fromLocationId: null, toLocationId: 'loc_1', qty: 80, date: '2026-03-01T11:00:00Z', userId: 'user_1', note: '' },
  { id: 'led_3', type: 'receipt', ref: 'REC/2026/0002', productId: 'prd_4', fromLocationId: null, toLocationId: 'loc_1', qty: 200, date: '2026-03-05T14:00:00Z', userId: 'user_1', note: '' },
  { id: 'led_4', type: 'transfer', ref: 'TRF/2026/0001', productId: 'prd_1', fromLocationId: 'loc_1', toLocationId: 'loc_2', qty: 35, date: '2026-03-02T14:00:00Z', userId: 'user_1', note: '' },
  { id: 'led_5', type: 'delivery', ref: 'DEL/2026/0001', productId: 'prd_1', fromLocationId: 'loc_1', toLocationId: null, qty: -30, date: '2026-03-03T16:00:00Z', userId: 'user_1', note: '' },
  { id: 'led_6', type: 'delivery', ref: 'DEL/2026/0001', productId: 'prd_3', fromLocationId: 'loc_1', toLocationId: null, qty: -5, date: '2026-03-03T16:00:00Z', userId: 'user_1', note: '' },
  { id: 'led_7', type: 'adjustment', ref: 'ADJ/2026/0001', productId: 'prd_1', fromLocationId: null, toLocationId: 'loc_2', qty: -3, date: '2026-03-06T11:00:00Z', userId: 'user_1', note: '3 kg damaged' },
];

const defaultState = () => ({
  warehouses: SEED_WAREHOUSES,
  locations: SEED_LOCATIONS,
  categories: SEED_CATEGORIES,
  units: SEED_UNITS,
  products: SEED_PRODUCTS,
  stockMap: SEED_STOCK,
  receipts: SEED_RECEIPTS,
  deliveries: SEED_DELIVERIES,
  transfers: SEED_TRANSFERS,
  adjustments: SEED_ADJUSTMENTS,
  stockLedger: SEED_LEDGER,
  currentWarehouseId: 'wh_1',
});

export const useInventoryStore = create(
  persist(
    (set, get) => ({
      ...defaultState(),

      setCurrentWarehouse: (id) => set({ currentWarehouseId: id }),

      // ---- Products ----
      addProduct: (data) => {
        const product = { id: genId('prd'), ...data };
        set((s) => ({
          products: [...s.products, product],
          stockMap: data.initialStock > 0
            ? { ...s.stockMap, [`${product.id}_loc_1`]: Number(data.initialStock) }
            : s.stockMap,
        }));
        return product;
      },
      updateProduct: (id, data) =>
        set((s) => ({ products: s.products.map((p) => (p.id === id ? { ...p, ...data } : p)) })),
      deleteProduct: (id) =>
        set((s) => ({ products: s.products.filter((p) => p.id !== id) })),

      // ---- Categories ----
      addCategory: (name) => {
        const cat = { id: genId('cat'), name };
        set((s) => ({ categories: [...s.categories, cat] }));
      },
      updateCategory: (id, name) =>
        set((s) => ({ categories: s.categories.map((c) => (c.id === id ? { ...c, name } : c)) })),
      deleteCategory: (id) =>
        set((s) => ({ categories: s.categories.filter((c) => c.id !== id) })),

      // ---- Warehouses ----
      addWarehouse: (data) => {
        const wh = { id: genId('wh'), ...data, active: true };
        set((s) => ({ warehouses: [...s.warehouses, wh] }));
      },
      updateWarehouse: (id, data) =>
        set((s) => ({ warehouses: s.warehouses.map((w) => (w.id === id ? { ...w, ...data } : w)) })),
      deleteWarehouse: (id) =>
        set((s) => ({ warehouses: s.warehouses.filter((w) => w.id !== id) })),

      // ---- Locations ----
      addLocation: (data) => {
        const loc = { id: genId('loc'), ...data };
        set((s) => ({ locations: [...s.locations, loc] }));
      },
      updateLocation: (id, data) =>
        set((s) => ({ locations: s.locations.map((l) => (l.id === id ? { ...l, ...data } : l)) })),
      deleteLocation: (id) =>
        set((s) => ({ locations: s.locations.filter((l) => l.id !== id) })),

      // ---- Units ----
      addUnit: (data) => {
        const unit = { id: genId('uom'), ...data };
        set((s) => ({ units: [...s.units, unit] }));
      },
      deleteUnit: (id) =>
        set((s) => ({ units: s.units.filter((u) => u.id !== id) })),

      // ---- Receipts ----
      createReceipt: (data) => {
        const rec = {
          id: genId('rec'),
          ref: makeRef('REC'),
          status: 'draft',
          createdAt: nowISO(),
          validatedAt: null,
          lines: data.lines.map((l) => ({ ...l, receivedQty: 0 })),
          ...data,
        };
        set((s) => ({ receipts: [rec, ...s.receipts] }));
        return rec;
      },
      updateReceipt: (id, data) =>
        set((s) => ({ receipts: s.receipts.map((r) => (r.id === id ? { ...r, ...data } : r)) })),
      validateReceipt: (id, userId = 'user_1') => {
        const { receipts, stockMap, stockLedger } = get();
        const rec = receipts.find((r) => r.id === id);
        if (!rec || rec.status === 'done') return;
        const newStock = { ...stockMap };
        const newLedger = [...stockLedger];
        rec.lines.forEach((line) => {
          const qty = Number(line.receivedQty) || 0;
          if (qty <= 0) return;
          const key = `${line.productId}_${rec.locationId}`;
          newStock[key] = (newStock[key] || 0) + qty;
          newLedger.push({
            id: genId('led'),
            type: 'receipt',
            ref: rec.ref,
            productId: line.productId,
            fromLocationId: null,
            toLocationId: rec.locationId,
            qty,
            date: nowISO(),
            userId,
            note: rec.notes || '',
          });
        });
        set((s) => ({
          stockMap: newStock,
          stockLedger: newLedger,
          receipts: s.receipts.map((r) =>
            r.id === id ? { ...r, status: 'done', validatedAt: nowISO() } : r
          ),
        }));
      },
      cancelReceipt: (id) =>
        set((s) => ({
          receipts: s.receipts.map((r) => (r.id === id ? { ...r, status: 'cancelled' } : r)),
        })),

      // ---- Deliveries ----
      createDelivery: (data) => {
        const del = {
          id: genId('del'),
          ref: makeRef('DEL'),
          status: 'draft',
          step: 0,
          createdAt: nowISO(),
          validatedAt: null,
          ...data,
        };
        set((s) => ({ deliveries: [del, ...s.deliveries] }));
        return del;
      },
      updateDelivery: (id, data) =>
        set((s) => ({ deliveries: s.deliveries.map((d) => (d.id === id ? { ...d, ...data } : d)) })),
      advanceDeliveryStep: (id) => {
        const { deliveries } = get();
        const del = deliveries.find((d) => d.id === id);
        if (!del || del.step >= 2) return;
        set((s) => ({
          deliveries: s.deliveries.map((d) => (d.id === id ? { ...d, step: d.step + 1, status: d.step + 1 === 2 ? 'ready' : 'waiting' } : d)),
        }));
      },
      validateDelivery: (id, userId = 'user_1') => {
        const { deliveries, stockMap, stockLedger } = get();
        const del = deliveries.find((d) => d.id === id);
        if (!del || del.status === 'done') return;
        const newStock = { ...stockMap };
        const newLedger = [...stockLedger];
        del.lines.forEach((line) => {
          const qty = Number(line.qty) || 0;
          if (qty <= 0) return;
          const key = `${line.productId}_${del.locationId}`;
          newStock[key] = Math.max(0, (newStock[key] || 0) - qty);
          newLedger.push({
            id: genId('led'),
            type: 'delivery',
            ref: del.ref,
            productId: line.productId,
            fromLocationId: del.locationId,
            toLocationId: null,
            qty: -qty,
            date: nowISO(),
            userId,
            note: del.notes || '',
          });
        });
        set((s) => ({
          stockMap: newStock,
          stockLedger: newLedger,
          deliveries: s.deliveries.map((d) =>
            d.id === id ? { ...d, status: 'done', step: 3, validatedAt: nowISO() } : d
          ),
        }));
      },
      cancelDelivery: (id) =>
        set((s) => ({
          deliveries: s.deliveries.map((d) => (d.id === id ? { ...d, status: 'cancelled' } : d)),
        })),

      // ---- Transfers ----
      createTransfer: (data) => {
        const trf = {
          id: genId('trf'),
          ref: makeRef('TRF'),
          status: 'waiting',
          createdAt: nowISO(),
          validatedAt: null,
          ...data,
        };
        set((s) => ({ transfers: [trf, ...s.transfers] }));
        return trf;
      },
      validateTransfer: (id, userId = 'user_1') => {
        const { transfers, stockMap, stockLedger } = get();
        const trf = transfers.find((t) => t.id === id);
        if (!trf || trf.status === 'done') return;
        const newStock = { ...stockMap };
        const newLedger = [...stockLedger];
        trf.lines.forEach((line) => {
          const qty = Number(line.qty) || 0;
          if (qty <= 0) return;
          const fromKey = `${line.productId}_${trf.fromLocationId}`;
          const toKey = `${line.productId}_${trf.toLocationId}`;
          newStock[fromKey] = Math.max(0, (newStock[fromKey] || 0) - qty);
          newStock[toKey] = (newStock[toKey] || 0) + qty;
          newLedger.push({
            id: genId('led'),
            type: 'transfer',
            ref: trf.ref,
            productId: line.productId,
            fromLocationId: trf.fromLocationId,
            toLocationId: trf.toLocationId,
            qty,
            date: nowISO(),
            userId,
            note: trf.notes || '',
          });
        });
        set((s) => ({
          stockMap: newStock,
          stockLedger: newLedger,
          transfers: s.transfers.map((t) =>
            t.id === id ? { ...t, status: 'done', validatedAt: nowISO() } : t
          ),
        }));
      },
      cancelTransfer: (id) =>
        set((s) => ({
          transfers: s.transfers.map((t) => (t.id === id ? { ...t, status: 'cancelled' } : t)),
        })),

      // ---- Adjustments ----
      createAdjustment: (data) => {
        const adj = {
          id: genId('adj'),
          ref: makeRef('ADJ'),
          status: 'draft',
          createdAt: nowISO(),
          validatedAt: null,
          ...data,
        };
        set((s) => ({ adjustments: [adj, ...s.adjustments] }));
        return adj;
      },
      validateAdjustment: (id, userId = 'user_1') => {
        const { adjustments, stockMap, stockLedger } = get();
        const adj = adjustments.find((a) => a.id === id);
        if (!adj || adj.status === 'done') return;
        const newStock = { ...stockMap };
        const newLedger = [...stockLedger];
        adj.lines.forEach((line) => {
          const key = `${line.productId}_${adj.locationId}`;
          const diff = Number(line.countedQty) - Number(line.systemQty);
          newStock[key] = Math.max(0, Number(line.countedQty));
          newLedger.push({
            id: genId('led'),
            type: 'adjustment',
            ref: adj.ref,
            productId: line.productId,
            fromLocationId: null,
            toLocationId: adj.locationId,
            qty: diff,
            date: nowISO(),
            userId,
            note: adj.notes || '',
          });
        });
        set((s) => ({
          stockMap: newStock,
          stockLedger: newLedger,
          adjustments: s.adjustments.map((a) =>
            a.id === id ? { ...a, status: 'done', validatedAt: nowISO() } : a
          ),
        }));
      },
      cancelAdjustment: (id) =>
        set((s) => ({
          adjustments: s.adjustments.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a)),
        })),

      // ---- Selectors ----
      getProductStock: (productId, locationId) => {
        const { stockMap } = get();
        const key = `${productId}_${locationId}`;
        return stockMap[key] || 0;
      },
      getProductTotalStock: (productId) => {
        const { stockMap } = get();
        return Object.entries(stockMap)
          .filter(([k]) => k.startsWith(`${productId}_`))
          .reduce((sum, [, v]) => sum + v, 0);
      },
    }),
    {
      name: 'ci_inventory',
      version: 1,
    }
  )
);
