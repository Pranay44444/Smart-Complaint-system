'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../../context/AuthContext';
import api from '../../../../lib/axios';
import Link from 'next/link';
import { format } from 'date-fns';
import { Sidebar, Topbar, PortalShell, KpiCard, TableWrap, TH, TD, TR, StatusPill, Avatar, RoleBadge, Icons, Card } from '../../../../components/ui';

interface Member { _id: string; name: string; email: string; role: string; createdAt: string; }
interface Complaint { _id: string; title: string; status: string; createdAt: string; createdBy?: { name?: string; email?: string }; assignedTo?: { name?: string; email?: string } | null; }
interface OrgDetail { _id: string; name: string; slug: string; isActive: boolean; createdAt: string; }

export default function OrgDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [org, setOrg] = useState<OrgDetail | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'members' | 'complaints'>('members');

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'SUPER_ADMIN') { router.push('/login'); return; }
      loadAll();
    }
  }, [user, loading]);

  const loadAll = async () => {
    try {
      const [orgRes, membersRes, complaintsRes] = await Promise.all([
        api.get(`/superadmin/orgs/${id}`),
        api.get(`/superadmin/orgs/${id}/members`),
        api.get(`/superadmin/orgs/${id}/complaints`),
      ]);
      setOrg(orgRes.data.data);
      setMembers(membersRes.data.data);
      setComplaints(complaintsRes.data.data);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  if (loading || isLoading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'var(--fg-tertiary)', fontSize: 14 }}>Loading…</div>;
  if (!org) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'var(--danger)', fontSize: 14 }}>Organization not found.</div>;

  const navItems = [
    { key: 'orgs', label: 'Organizations', href: '/superadmin/dashboard', icon: <Icons.Org size={16}/> },
  ];

  return (
    <PortalShell sidebar={
      <Sidebar brandRole="Super admin" items={navItems} activeKey="orgs"
        user={{ name: user?.name ?? '', email: user?.email ?? '', role: 'SUPER_ADMIN' }} onLogout={logout}/>
    }>
      <Topbar crumbs={['Platform', 'Organizations', org.name]}/>
      <main style={{ flex: 1, padding: '28px 32px 48px' }}>
        <Link href="/superadmin/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--fg-tertiary)', textDecoration: 'none', marginBottom: 20, fontWeight: 500 }}>
          <Icons.ChevLeft size={14}/> Back to organizations
        </Link>

        {/* Org header */}
        <Card hero style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--fg-primary)', margin: '0 0 4px' }}>{org.name}</h1>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-tertiary)' }}>/{org.slug}</span>
              <p style={{ fontSize: 13, color: 'var(--fg-tertiary)', margin: '6px 0 0' }}>Created {format(new Date(org.createdAt), 'MMM d, yyyy')}</p>
            </div>
            <StatusPill status={org.isActive ? 'ACTIVE' : 'SUSPENDED'}/>
          </div>
        </Card>

        {/* Stats */}
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: 24 }}>
          <KpiCard label="Total members" value={members.length}/>
          <KpiCard label="Admins"  value={members.filter(m => m.role === 'ADMIN').length}  valueColor="var(--accent-600)"/>
          <KpiCard label="Staff"   value={members.filter(m => m.role === 'STAFF').length}  valueColor="var(--info)"/>
          <KpiCard label="Users"   value={members.filter(m => m.role === 'USER').length}   valueColor="var(--fg-tertiary)"/>
        </div>

        {/* Tabs */}
        <div style={{ display: 'inline-flex', gap: 4, padding: 3, background: 'var(--bg-sunken)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', marginBottom: 16 }}>
          {(['members', 'complaints'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '5px 14px', fontSize: 13, borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 500,
              background: activeTab === tab ? 'var(--bg-surface)' : 'transparent',
              color: activeTab === tab ? 'var(--fg-primary)' : 'var(--fg-tertiary)',
              boxShadow: activeTab === tab ? 'var(--shadow-xs)' : 'none',
            }}>
              {tab === 'members' ? `Members (${members.length})` : `Complaints (${complaints.length})`}
            </button>
          ))}
        </div>

        <TableWrap>
          {activeTab === 'members' ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
              <thead><tr><TH>Name</TH><TH>Email</TH><TH>Role</TH><TH>Joined</TH></tr></thead>
              <tbody>
                {members.length === 0 ? (
                  <tr><td colSpan={4} style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--fg-tertiary)' }}>No members yet.</td></tr>
                ) : members.map(m => (
                  <TR key={m._id}>
                    <TD strong><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Avatar name={m.name || m.email} role={m.role}/><span>{m.name}</span></div></TD>
                    <TD mono>{m.email}</TD>
                    <TD><RoleBadge role={m.role}/></TD>
                    <TD muted>{m.createdAt ? format(new Date(m.createdAt), 'MMM d, yyyy') : '—'}</TD>
                  </TR>
                ))}
              </tbody>
            </table>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
              <thead><tr><TH>Title</TH><TH>Submitted by</TH><TH>Assigned to</TH><TH>Date</TH><TH>Status</TH></tr></thead>
              <tbody>
                {complaints.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--fg-tertiary)' }}>No complaints yet.</td></tr>
                ) : complaints.map(c => (
                  <TR key={c._id}>
                    <TD strong>{c.title}</TD>
                    <TD>{c.createdBy?.name || c.createdBy?.email || '—'}</TD>
                    <TD muted>{c.assignedTo?.name || c.assignedTo?.email || 'Unassigned'}</TD>
                    <TD mono muted>{format(new Date(c.createdAt), 'MMM d, yyyy')}</TD>
                    <TD><StatusPill status={c.status}/></TD>
                  </TR>
                ))}
              </tbody>
            </table>
          )}
        </TableWrap>
      </main>
    </PortalShell>
  );
}
