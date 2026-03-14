import React from 'react';

const STATUS_MAP = {
  draft: 'Draft', waiting: 'Waiting', ready: 'Ready',
  done: 'Done', cancelled: 'Cancelled',
  in_stock: 'In Stock', low_stock: 'Low Stock', out_stock: 'Out of Stock',
  receipt: 'Receipt', delivery: 'Delivery', transfer: 'Transfer', adjustment: 'Adjustment',
};

export default function Badge({ status, dot = false }) {
  const label = STATUS_MAP[status] || status;
  return (
    <span className={`badge badge-${status}`}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />}
      {label}
    </span>
  );
}
