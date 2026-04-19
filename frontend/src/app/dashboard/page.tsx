'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { BrandMark, Avatar, KpiCard, TableWrap, TH, TD, TR, StatusPill, SearchWrap, Segmented, Pagination, Icons, Btn } from '../../components/ui';

const PAGE_SIZE = 10;
const STATUS_OPTS = [
  { label: 'All', value: '' },
  { label: 'ASSIGNED', value: 'ASSIGNED' },
  { label: 'IN_PROGRESS', value: 'IN_PROGRESS' },
  { label: 'RESOLVED', value: 'RESOLVED' },
  { label: 'CLOSED', value: 'CLOSED' },
];

interface Complaint {
  _id: string; title: string; status: string; createdAt: string;
  assignedTo?: { name?: string; email?: string } | null;
}

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState({ assigned: 0, inProgress: 0, resolved: 0, closed: 0 });

  useEffect(() => {
    if (!user || user.role !== 'USER') return;
    Promise.all([
      api.get('/complaints', { params: { limit: 1, status: 'ASSIGNED' } }),
      api.get('/complaints', { params: { limit: 1, status: 'IN_PROGRESS' } }),
      api.get('/complaints', { params: { limit: 1, status: 'RESOLVED' } }),
      api.get('/complaints', { params: { limit: 1, status: 'CLOSED' } }),
    ]).then(([a, ip, r, c]) => {
      setSummary({
        assigned: a.data.data.total ?? 0,
        inProgress: ip.data.data.total ?? 0,
        resolved: r.data.data.total ?? 0,
        closed: c.data.data.total ?? 0,
      });
    }).catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'ADMIN') router.replace('/admin/dashboard');
      else if (user.role === 'STAFF') router.replace('/staff/complaints');
      else if (user.role === 'SUPER_ADMIN') router.replace('/superadmin/dashboard');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    if (!user || user.role !== 'USER') return;
    setFetchLoading(true);
    const params: Record<string, string> = { page: String(page), limit: String(PAGE_SIZE) };
    if (search) params.search = search;
    if (statusFilter) params.status = statusFilter;
    api.get('/complaints', { params })
      .then(res => {
        const payload = res.data.data;
        setComplaints(payload.items);
        setTotal(payload.total);
      })
      .catch(() => setError('Failed to load complaints'))
      .finally(() => setFetchLoading(false));
  }, [user, page, search, statusFilter]);

  if (loading || !user || user.role !== 'USER') {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'var(--fg-tertiary)', fontSize: 14 }}>Loading…</div>;
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-app)', display: 'flex', flexDirection: 'column' }}>
      {/* Top nav */}
      <nav style={{ height: 64, background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 14, padding: '0 28px', position: 'sticky', top: 0, zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <BrandMark size={28}/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: '-0.015em', color: 'var(--fg-primary)' }}>Smart Complaint</span>
            <span style={{ fontSize: 10.5, color: 'var(--fg-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Customer portal</span>
          </div>
        </div>
        <div style={{ flex: 1 }}/>
        <Link href="/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', padding: '4px 8px', borderRadius: 8, transition: 'background 120ms' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
        >
          <span style={{ fontSize: 13, color: 'var(--fg-tertiary)' }}>{user.name || user.email}</span>
          <Avatar name={user.name ?? user.email ?? ''} role="USER"/>
        </Link>
        <button onClick={logout} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 11px', borderRadius: 8, border: 'none', background: 'transparent', color: 'var(--fg-secondary)', cursor: 'pointer', fontSize: 12.5, fontWeight: 600, fontFamily: 'var(--font-sans)' }}>
          <Icons.Logout size={14}/>
        </button>
      </nav>

      <main style={{ flex: 1, maxWidth: 1040, width: '100%', margin: '0 auto', padding: '28px 24px 48px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--fg-primary)', margin: '0 0 4px' }}>Your complaints</h1>
            <p style={{ fontSize: 14, color: 'var(--fg-tertiary)', margin: 0 }}>Track the status of issues you've raised.</p>
          </div>
          <Btn variant="primary" href="/complaints/new"><Icons.Plus size={14}/>New complaint</Btn>
        </div>

        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', marginBottom: 24 }}>
          <KpiCard label="Assigned"    value={summary.assigned}   valueColor="var(--status-assigned-fg)"/>
          <KpiCard label="In progress" value={summary.inProgress} valueColor="var(--status-progress-fg)"/>
          <KpiCard label="Resolved"    value={summary.resolved}   valueColor="var(--status-resolved-fg)" deltaKind="up"/>
          <KpiCard label="Closed"      value={summary.closed}  valueColor="var(--status-closed-fg)"/>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
          <SearchWrap value={searchInput} onChange={setSearchInput} placeholder="Search complaints…"/>
          <Segmented options={STATUS_OPTS} value={statusFilter} onChange={v => { setStatusFilter(v); setPage(1); }}/>
        </div>

        {fetchLoading ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--fg-tertiary)' }}>Loading complaints…</div>
        ) : error ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--danger)' }}>{error}</div>
        ) : complaints.length === 0 ? (
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '48px 24px', textAlign: 'center', color: 'var(--fg-tertiary)', fontSize: 14 }}>
            {search || statusFilter ? 'No complaints match your filters.' : (
              <>You haven't submitted any complaints yet.{' '}
                <Link href="/complaints/new" style={{ color: 'var(--accent-600)', fontWeight: 500 }}>Submit your first one</Link>
              </>
            )}
          </div>
        ) : (
          <>
            <TableWrap>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
                <thead><tr><TH>Subject</TH><TH>Assignee</TH><TH>Date</TH><TH>Status</TH></tr></thead>
                <tbody>
                  {complaints.map(c => (
                    <TR key={c._id} onClick={() => router.push(`/complaints/${c._id}`)}>
                      <TD strong>
                        <Link href={`/complaints/${c._id}`} style={{ color: 'var(--fg-primary)', textDecoration: 'none', fontWeight: 500 }}>{c.title}</Link>
                      </TD>
                      <TD muted>{c.assignedTo?.name || c.assignedTo?.email || 'Not yet assigned'}</TD>
                      <TD mono muted>{format(new Date(c.createdAt), 'MMM d, yyyy')}</TD>
                      <TD><StatusPill status={c.status}/></TD>
                    </TR>
                  ))}
                </tbody>
              </table>
            </TableWrap>
            <Pagination page={page} totalPages={totalPages} onPrev={() => setPage(p => p - 1)} onNext={() => setPage(p => p + 1)} total={total} pageSize={PAGE_SIZE}/>
          </>
        )}
      </main>
    </div>
  );
}
