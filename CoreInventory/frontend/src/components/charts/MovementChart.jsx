import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { format, subDays } from 'date-fns';

export default function MovementChart({ ledger }) {
  // Build daily movement count for past 14 days
  const days = Array.from({ length: 14 }, (_, i) => {
    const date = subDays(new Date(), 13 - i);
    const key = format(date, 'MM/dd');
    const entries = ledger.filter((l) => format(new Date(l.date), 'MM/dd') === key);
    return {
      date: key,
      Receipts: entries.filter((l) => l.type === 'receipt').length,
      Deliveries: entries.filter((l) => l.type === 'delivery').length,
      Transfers: entries.filter((l) => l.type === 'transfer').length,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={days} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} />
        <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} allowDecimals={false} />
        <Tooltip
          contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }}
        />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
        <Line type="monotone" dataKey="Receipts" stroke="var(--color-info)" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="Deliveries" stroke="var(--color-purple)" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="Transfers" stroke="var(--color-success)" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
