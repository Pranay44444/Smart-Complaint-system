'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/axios';
import Link from 'next/link';
import { Sidebar, Topbar, PortalShell, KpiCard, TableWrap, TH, TD, TR, StatusPill, SearchWrap, Segmented, Icons } from '../../../components/ui';

interface Organization {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
  adminEmail: string | null;
  totalComplaints: number;
}

const FILTER_OPTS = [
  { label: 'All', value: 'ALL' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Suspended', value: 'SUSPENDED' },
];

export default function SuperAdminDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'SUPER_ADMIN') {
        router.push('/login');
      } else {
        fetchOrganizations();
      }
    }
  }, [user, loading, router]);

  const fetchOrganizations = async () => {
    try {
      const res = await api.get('/superadmin/orgs');
      setOrganizations(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch organizations', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuspend = async (id: string) => {
    if (!confirm('Suspend this organization? Their users won\'t be able to log in.')) return;
    try {
      await api.patch(`/superadmin/orgs/${id}/suspend`);
      setOrganizations(organizations.map(org => org._id === id ? { ...org, isActive: false } : org));
    } catch (err) { console.error(err); }
  };

  const handleActivate = async (id: string) => {
    if (!confirm('Reactivate this organization?')) return;
    try {
      await api.patch(`/superadmin/orgs/${id}/activate`);
      setOrganizations(organizations.map(org => org._id === id ? { ...org, isActive: true } : org));
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this organization? This cannot be undone.')) return;
    try {
      await api.delete(`/superadmin/orgs/${id}`);
      setOrganizations(organizations.filter(org => org._id !== id));
    } catch (err) { console.error(err); }
  };

  if (loading || isLoading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'var(--fg-tertiary)', fontSize: 14 }}>Loading portal…</div>;
  }

  const totalOrgs = organizations.length;
  const activeOrgs = organizations.filter(o => o.isActive).length;
  const totalComplaints = organizations.reduce((a, o) => a + (o.totalComplaints || 0), 0);

  const filtered = organizations.filter(o => {
    const matchStatus = statusFilter === 'ALL' || (statusFilter === 'ACTIVE' ? o.isActive : !o.isActive);
    const matchSearch = !search || o.name.toLowerCase().includes(search.toLowerCase()) || o.slug.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const navItems = [
    { key: 'orgs', label: 'Organizations', href: '/superadmin/dashboard', icon: <Icons.Org size={16}/>, count: totalOrgs },
  ];

  return (
    <PortalShell sidebar={
      <Sidebar
        brandRole="Super admin"
        items={navItems}
        activeKey="orgs"
        user={{ name: user?.name ?? '', email: user?.email ?? '', role: 'SUPER_ADMIN' }}
        onLogout={logout}
      />
    }>
      <Topbar
        crumbs={['Platform', 'Organizations']}
        right={
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 11px', borderRadius: 8, border: '1px solid var(--border-soft)', background: 'var(--bg-surface)', color: 'var(--fg-secondary)', cursor: 'pointer', fontSize: 12.5, fontWeight: 600, boxShadow: 'var(--shadow-xs)', fontFamily: 'var(--font-sans)' }}>
            <Icons.Bell size={14}/> Alerts
          </button>
        }
      />
      <main style={{ flex: 1, padding: '28px 32px 48px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--fg-primary)', margin: '0 0 4px' }}>Organizations</h1>
            <p style={{ fontSize: 14, color: 'var(--fg-tertiary)', margin: 0 }}>Suspend, activate, and monitor tenant accounts across the platform.</p>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', marginBottom: 24 }}>
          <KpiCard label="Total orgs"          value={totalOrgs}/>
          <KpiCard label="Active"              value={activeOrgs}              valueColor="var(--success)"  delta={`${totalOrgs - activeOrgs} suspended`}/>
          <KpiCard label="Suspended"           value={totalOrgs - activeOrgs}  valueColor="var(--danger)"/>
          <KpiCard label="Platform complaints" value={totalComplaints.toLocaleString()}/>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
          <SearchWrap value={search} onChange={setSearch} placeholder="Search organizations…"/>
          <Segmented options={FILTER_OPTS} value={statusFilter} onChange={setStatusFilter}/>
        </div>

        <TableWrap>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
            <thead><tr><TH>Organization</TH><TH>Admin</TH><TH>Complaints</TH><TH>Status</TH><TH right>Actions</TH></tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--fg-tertiary)' }}>No organizations found.</td></tr>
              ) : filtered.map(org => (
                <TR key={org._id}>
                  <TD strong>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span>{org.name}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-tertiary)' }}>/{org.slug}</span>
                    </div>
                  </TD>
                  <TD>{org.adminEmail ?? <span style={{ color: 'var(--fg-quaternary)', fontStyle: 'italic' }}>No admin yet</span>}</TD>
                  <TD mono>{org.totalComplaints}</TD>
                  <TD><StatusPill status={org.isActive ? 'ACTIVE' : 'SUSPENDED'}/></TD>
                  <TD right>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'flex-end' }}>
                      <Link href={`/superadmin/orgs/${org._id}`} style={{ color: 'var(--accent-600)', fontWeight: 500, fontSize: 13, textDecoration: 'none' }}>Manage</Link>
                      <button onClick={() => org.isActive ? handleSuspend(org._id) : handleActivate(org._id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: 13, color: org.isActive ? 'var(--warning)' : 'var(--success)', fontFamily: 'var(--font-sans)', padding: 0 }}>
                        {org.isActive ? 'Suspend' : 'Activate'}
                      </button>
                      <button onClick={() => handleDelete(org._id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: 13, color: 'var(--danger)', fontFamily: 'var(--font-sans)', padding: 0 }}>
                        Delete
                      </button>
                    </div>
                  </TD>
                </TR>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </main>
    </PortalShell>
  );
}
