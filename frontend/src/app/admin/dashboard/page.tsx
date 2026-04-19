'use client';
import { useEffect, useState } from 'react';
import api from '../../../lib/axios';
import Link from 'next/link';
import { KpiCard, Card, TableWrap, TH, TD, TR, StatusPill, Icons, Btn } from '../../../components/ui';

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [org, setOrg] = useState<{ name: string; slug: string } | null>(null);
  const [recentComplaints, setRecentComplaints] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, orgRes, complaintsRes] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/dashboard/org'),
          api.get('/complaints', { params: { page: 1, limit: 5 } }),
        ]);
        setSummary(summaryRes.data.data);
        setOrg(orgRes.data.data ?? orgRes.data);
        setRecentComplaints(complaintsRes.data.data?.items ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const joinLink = org ? `${window.location.origin}/join/${org.slug}` : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(joinLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--fg-tertiary)' }}>Loading stats…</div>;
  }
  if (!summary) {
    return <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--danger)' }}>Failed to load dashboard data.</div>;
  }

  const by = summary.byStatus ?? {};

  return (
    <div>
      <div style={{ marginBottom: 4 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--fg-primary)', margin: 0 }}>System overview</h1>
        {org && <p style={{ fontSize: 14, color: 'var(--fg-tertiary)', margin: '4px 0 0' }}>{org.name} · {summary.total} total complaints</p>}
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', margin: '24px 0' }}>
        <KpiCard label="Assigned"    value={by.ASSIGNED    ?? 0} valueColor="var(--status-assigned-fg)" />
        <KpiCard label="In progress" value={by.IN_PROGRESS ?? 0} valueColor="var(--status-progress-fg)" />
        <KpiCard label="Resolved"    value={by.RESOLVED    ?? 0} valueColor="var(--status-resolved-fg)" deltaKind="up" />
        <KpiCard label="Closed"      value={by.CLOSED      ?? 0} valueColor="var(--status-closed-fg)"   />
      </div>

      {/* Join link card */}
      {org && (
        <Card hero style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', marginBottom: 8 }}>
            User &amp; staff join link
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.015em', color: 'var(--fg-primary)', margin: '0 0 8px' }}>
            Invite your team to {org.name}
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-tertiary)', margin: '0 0 16px', lineHeight: 1.6 }}>
            Share this link so users can self-register under your organization.
          </p>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{
              flex: 1, background: 'var(--bg-sunken)', border: '1px solid var(--border-subtle)',
              padding: '9px 12px', borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-primary)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {joinLink}
            </div>
            <Btn variant="secondary" onClick={handleCopy}><Icons.Copy size={14}/>{copied ? 'Copied!' : 'Copy'}</Btn>
            <Btn variant="primary" href={`/join/${org.slug}`}>Open</Btn>
          </div>
        </Card>
      )}

      {/* Recent complaints */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h3 style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.015em', color: 'var(--fg-primary)', margin: 0 }}>Recent complaints</h3>
        <Link href="/admin/complaints" style={{ fontSize: 13, color: 'var(--accent-600)', fontWeight: 500, textDecoration: 'none' }}>View all →</Link>
      </div>

      <TableWrap>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
          <thead>
            <tr>
              <TH>Title</TH><TH>User</TH><TH>Assignee</TH><TH>Status</TH><TH>Updated</TH>
            </tr>
          </thead>
          <tbody>
            {recentComplaints.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '24px 20px', textAlign: 'center', color: 'var(--fg-tertiary)', fontSize: 13.5 }}>No complaints yet.</td></tr>
            ) : recentComplaints.map((c: any) => (
              <TR key={c._id} onClick={() => {}}>
                <TD strong><Link href={`/admin/complaints/${c._id}`} style={{ color: 'var(--fg-primary)', textDecoration: 'none', fontWeight: 500 }}>{c.title}</Link></TD>
                <TD>{c.createdBy?.name || c.createdBy?.email}</TD>
                <TD muted>{c.assignedTo?.name || c.assignedTo?.email || 'Unassigned'}</TD>
                <TD><StatusPill status={c.status}/></TD>
                <TD mono muted>{c.updatedAt ? new Date(c.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}</TD>
              </TR>
            ))}
          </tbody>
        </table>
      </TableWrap>
    </div>
  );
}
