'use client';
import { useAuth } from '../../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Sidebar, Topbar, PortalShell, Icons } from '../../components/ui';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'ADMIN') {
        router.replace('/dashboard');
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'ADMIN') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'var(--fg-tertiary)', fontSize: 14 }}>
        Loading admin panel…
      </div>
    );
  }

  const navItems = [
    { key: 'dashboard',   label: 'Dashboard',         href: '/admin/dashboard',         icon: <Icons.Dashboard size={16}/> },
    { key: 'complaints',  label: 'Complaints',         href: '/admin/complaints',         icon: <Icons.Complaint size={16}/> },
    { key: 'users',       label: 'Team & users',       href: '/admin/users',              icon: <Icons.Team size={16}/> },
    { key: 'performance', label: 'Staff performance',  href: '/admin/staff-performance',  icon: <Icons.Chart size={16}/> },
  ];

  const activeKey = navItems.find(n => pathname.startsWith(n.href))?.key ?? 'dashboard';

  const crumbMap: Record<string, string> = {
    dashboard:   'Dashboard',
    complaints:  'Complaints',
    users:       'Team & users',
    performance: 'Staff performance',
  };

  return (
    <PortalShell sidebar={
      <Sidebar
        brandRole="Admin portal"
        items={navItems}
        activeKey={activeKey}
        user={{ name: user.name ?? '', email: user.email ?? '', role: 'ADMIN' }}
        onLogout={logout}
      />
    }>
      <Topbar
        crumbs={['Admin', crumbMap[activeKey] ?? '']}
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 11px', borderRadius: 8, border: 'none', background: 'transparent', color: 'var(--fg-secondary)', cursor: 'pointer', fontSize: 12.5, fontWeight: 600, fontFamily: 'var(--font-sans)' }}>
              <Icons.Bell size={16}/>
            </button>
          </div>
        }
      />
      <main style={{ flex: 1, padding: '28px 32px 48px' }}>
        {children}
      </main>
    </PortalShell>
  );
}
