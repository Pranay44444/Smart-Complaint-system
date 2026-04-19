'use client';
import { useEffect, useState } from 'react';
import api from '../../../lib/axios';
import { TableWrap, TH, TD, TR, Avatar, KpiCard } from '../../../components/ui';

interface StaffStat {
  staffId: string;
  staffName: string;
  staffEmail: string;
  count: number;
}

export default function StaffPerformancePage() {
  const [stats, setStats] = useState<StaffStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/dashboard/staff-performance')
      .then(res => setStats(res.data.data))
      .catch(() => setError('Failed to load staff performance data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--fg-tertiary)' }}>Loading performance data…</div>;
  if (error) return <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--danger)' }}>{error}</div>;

  const topCount = stats[0]?.count ?? 0;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--fg-primary)', margin: '0 0 4px' }}>Staff performance</h1>
        <p style={{ fontSize: 14, color: 'var(--fg-tertiary)', margin: 0 }}>Resolution throughput per staff member.</p>
      </div>

      {stats.length > 0 && (
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', marginBottom: 24 }}>
          <KpiCard label="Staff members" value={stats.length}/>
          <KpiCard label="Top resolver" value={stats[0]?.staffName?.split(' ')[0] ?? '—'} valueColor="var(--accent-600)"/>
          <KpiCard label="Top count" value={topCount} valueColor="var(--status-resolved-fg)" deltaKind="up"/>
        </div>
      )}

      {stats.length === 0 ? (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '48px 24px', textAlign: 'center', color: 'var(--fg-tertiary)' }}>
          No resolved or closed complaints yet.
        </div>
      ) : (
        <TableWrap>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
            <thead>
              <tr><TH>Rank</TH><TH>Staff member</TH><TH>Email</TH><TH>Resolved / closed</TH><TH>Load</TH></tr>
            </thead>
            <tbody>
              {stats.map((s, i) => (
                <TR key={s.staffId}>
                  <TD mono muted>#{i + 1}</TD>
                  <TD strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar name={s.staffName || s.staffEmail} role="STAFF"/>
                      <span>{s.staffName || '—'}</span>
                    </div>
                  </TD>
                  <TD mono>{s.staffEmail}</TD>
                  <TD>
                    <span style={{ padding: '3px 10px', borderRadius: 'var(--radius-pill)', background: 'var(--status-resolved-bg)', color: 'var(--status-resolved-fg)', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600 }}>
                      {s.count}
                    </span>
                  </TD>
                  <TD>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 140 }}>
                      <div style={{ flex: 1, height: 6, background: 'var(--bg-sunken)', borderRadius: 999, overflow: 'hidden' }}>
                        <span style={{ display: 'block', height: '100%', width: `${topCount > 0 ? Math.round((s.count / topCount) * 100) : 0}%`, background: 'var(--accent-500)', borderRadius: 999 }}/>
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-tertiary)', width: 36, textAlign: 'right' }}>
                        {topCount > 0 ? Math.round((s.count / topCount) * 100) : 0}%
                      </span>
                    </div>
                  </TD>
                </TR>
              ))}
            </tbody>
          </table>
        </TableWrap>
      )}
    </div>
  );
}
