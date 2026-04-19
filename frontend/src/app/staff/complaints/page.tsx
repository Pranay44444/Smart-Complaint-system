'use client';
import { useEffect, useState, useCallback } from 'react';
import api from '../../../lib/axios';
import Link from 'next/link';
import { format } from 'date-fns';
import { KpiCard, TableWrap, TH, TD, TR, StatusPill, SearchWrap, Segmented, Pagination } from '../../../components/ui';

const PAGE_SIZE = 10;
const STATUS_OPTS = [
  { label: 'All', value: 'ALL' },
  { label: 'ASSIGNED', value: 'ASSIGNED' },
  { label: 'IN_PROGRESS', value: 'IN_PROGRESS' },
  { label: 'RESOLVED', value: 'RESOLVED' },
  { label: 'CLOSED', value: 'CLOSED' },
];

export default function StaffComplaintsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ assigned: 0, inProgress: 0, resolved: 0, closed: 0 });

  // Fetch all staff-scoped complaints once and compute breakdown locally
  useEffect(() => {
    api.get('/complaints', { params: { limit: 200 } })
      .then(res => {
        const all: any[] = res.data.data.items ?? [];
        setSummary({
          assigned:   all.filter(c => c.status === 'ASSIGNED').length,
          inProgress: all.filter(c => c.status === 'IN_PROGRESS').length,
          resolved:   all.filter(c => c.status === 'RESOLVED').length,
          closed:     all.filter(c => c.status === 'CLOSED').length,
        });
      }).catch(() => {});
  }, []);

  const fetchComplaints = useCallback(async (p: number, s: string, st: string) => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(p), limit: String(PAGE_SIZE) };
      if (s) params.search = s;
      if (st !== 'ALL') params.status = st;
      const res = await api.get('/complaints', { params });
      const payload = res.data.data;
      setItems(payload.items ?? []);
      setTotal(payload.total ?? 0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchComplaints(page, search, filter); }, [page, search, filter, fetchComplaints]);

  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--fg-primary)', margin: '0 0 4px' }}>My assignments</h1>
        <p style={{ fontSize: 14, color: 'var(--fg-tertiary)', margin: 0 }}>{total} tickets currently assigned to you. Oldest first.</p>
      </div>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', marginBottom: 24 }}>
        <KpiCard label="Assigned"    value={summary.assigned}   valueColor="var(--status-assigned-fg)" />
        <KpiCard label="In progress" value={summary.inProgress} valueColor="var(--status-progress-fg)" />
        <KpiCard label="Resolved"    value={summary.resolved}   valueColor="var(--status-resolved-fg)" deltaKind="up" />
        <KpiCard label="Closed"      value={summary.closed}     valueColor="var(--status-closed-fg)" />
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
        <SearchWrap value={searchInput} onChange={setSearchInput} placeholder="Search your queue…"/>
        <Segmented options={STATUS_OPTS} value={filter} onChange={v => { setFilter(v); setPage(1); }}/>
      </div>

      <TableWrap>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
          <thead><tr><TH>Title</TH><TH>Submitted by</TH><TH>Date</TH><TH>Status</TH><TH right>Action</TH></tr></thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--fg-tertiary)' }}>Loading…</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--fg-tertiary)' }}>
                {search || filter !== 'ALL' ? 'No complaints match your filters.' : "You're all caught up."}
              </td></tr>
            ) : items.map(c => (
              <TR key={c._id}>
                <TD strong>{c.title}</TD>
                <TD>{c.createdBy?.name || c.createdBy?.email}</TD>
                <TD mono muted>{format(new Date(c.updatedAt ?? c.createdAt), 'MMM d, yyyy')}</TD>
                <TD><StatusPill status={c.status}/></TD>
                <TD right>
                  <Link href={`/staff/complaints/${c._id}`} style={{ color: 'var(--accent-600)', fontWeight: 500, fontSize: 13, textDecoration: 'none' }}>Manage</Link>
                </TD>
              </TR>
            ))}
          </tbody>
        </table>
      </TableWrap>

      <Pagination page={page} totalPages={totalPages} onPrev={() => setPage(p => p - 1)} onNext={() => setPage(p => p + 1)} total={total} pageSize={PAGE_SIZE}/>
    </div>
  );
}
