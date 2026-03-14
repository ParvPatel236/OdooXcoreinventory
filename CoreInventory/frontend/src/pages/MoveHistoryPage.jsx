import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useInventoryStore } from '../store/inventoryStore';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import { fmtDateTime } from '../utils/date';

export default function MoveHistoryPage() {
  const { stockLedger, products, locations } = useInventoryStore();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 15;

  const getProductName = (id) => products.find((p) => p.id === id)?.name || id;
  const getLocName = (id) => id ? (locations.find((l) => l.id === id)?.name || id) : '—';

  const sorted = [...stockLedger].sort((a, b) => new Date(b.date) - new Date(a.date));
  const filtered = sorted.filter((e) => {
    const matchSearch = getProductName(e.productId).toLowerCase().includes(search.toLowerCase()) || e.ref.toLowerCase().includes(search.toLowerCase());
    const matchType = !typeFilter || e.type === typeFilter;
    return matchSearch && matchType;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Move History</h1>
          <p>Complete stock movement ledger — {filtered.length} entries</p>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-input-wrap">
          <Search size={14} className="search-icon" />
          <input className="search-input" placeholder="Search by product or reference…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <select className="filter-select" value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}>
          <option value="">All Types</option>
          <option value="receipt">Receipt</option>
          <option value="delivery">Delivery</option>
          <option value="transfer">Transfer</option>
          <option value="adjustment">Adjustment</option>
        </select>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {pageData.length === 0 ? (
          <EmptyState title="No movement records" desc="Stock movements will appear here after validating operations." />
        ) : (
          <>
            <div className="table-wrapper" style={{ border: 'none' }}>
              <table>
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Type</th>
                    <th>Reference</th>
                    <th>Product</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Qty</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {pageData.map((e) => (
                    <tr key={e.id}>
                      <td className="td-muted" style={{ whiteSpace: 'nowrap' }}>{fmtDateTime(e.date)}</td>
                      <td><Badge status={e.type} /></td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>{e.ref}</td>
                      <td style={{ fontWeight: 600 }}>{getProductName(e.productId)}</td>
                      <td className="td-muted">{getLocName(e.fromLocationId)}</td>
                      <td className="td-muted">{getLocName(e.toLocationId)}</td>
                      <td>
                        <span style={{
                          fontWeight: 700,
                          color: e.qty > 0 ? 'var(--color-success)' : e.qty < 0 ? 'var(--color-danger)' : 'var(--color-text-muted)'
                        }}>
                          {e.qty > 0 ? `+${e.qty}` : e.qty}
                        </span>
                      </td>
                      <td className="td-muted" style={{ fontSize: '0.78rem' }}>{e.note || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="pagination" style={{ padding: '12px 16px' }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} className={`page-btn${p === page ? ' active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
