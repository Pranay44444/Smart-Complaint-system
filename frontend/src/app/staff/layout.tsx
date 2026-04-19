'use client';
import { useAuth } from '../../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Sidebar, Topbar, PortalShell, Icons } from '../../components/ui';

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'STAFF') router.replace('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'STAFF') {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'var(--fg-tertiary)', fontSize: 14 }}>Loading staff portal…</div>;
  }

  const navItems = [
    { key: 'queue', label: 'My assignments', href: '/staff/complaints', icon: <Icons.Complaint size={16}/> },
  ];

  const activeKey = pathname.startsWith('/staff/complaints') ? 'queue' : 'queue';

  return (
    <PortalShell sidebar={
      <Sidebar
        brandRole="Staff portal"
        items={navItems}
        activeKey={activeKey}
        user={{ name: user.name ?? '', email: user.email ?? '', role: 'STAFF' }}
        onLogout={logout}
      />
    }>
      <Topbar
        crumbs={['Staff', 'My assignments']}
        right={
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 11px', borderRadius: 8, border: 'none', background: 'transparent', color: 'var(--fg-secondary)', cursor: 'pointer', fontSize: 12.5, fontWeight: 600, fontFamily: 'var(--font-sans)' }}>
            <Icons.Bell size={16}/>
          </button>
        }
      />
      <main style={{ flex: 1, padding: '28px 32px 48px' }}>
        {children}
      </main>
    </PortalShell>
  );
}
