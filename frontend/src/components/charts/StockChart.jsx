import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function StockChart({ products, stockMap }) {
  const data = products
    .map((p) => ({
      name: p.name.length > 14 ? p.name.slice(0, 12) + '…' : p.name,
      stock: Object.entries(stockMap)
        .filter(([k]) => k.startsWith(`${p.id}_`))
        .reduce((s, [, v]) => s + v, 0),
    }))
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 10);

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 24 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} angle={-30} textAnchor="end" interval={0} />
        <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} />
        <Tooltip
          contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ fontWeight: 600 }}
        />
        <Bar dataKey="stock" fill="var(--color-primary)" radius={[4, 4, 0, 0]} name="Qty" />
      </BarChart>
    </ResponsiveContainer>
  );
}
