'use client';
import React from 'react';
import Link from 'next/link';

// ---- Icons (Lucide-style inline SVG) ----
const Ico = ({ children, size = 16 }: { children: React.ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {children}
  </svg>
);

export const Icons = {
  Dashboard: (p?: { size?: number }) => <Ico {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></Ico>,
  Complaint: (p?: { size?: number }) => <Ico {...p}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></Ico>,
  Team: (p?: { size?: number }) => <Ico {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Ico>,
  Chart: (p?: { size?: number }) => <Ico {...p}><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></Ico>,
  Org: (p?: { size?: number }) => <Ico {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></Ico>,
  Search: (p?: { size?: number }) => <Ico {...p}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></Ico>,
  Plus: (p?: { size?: number }) => <Ico {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Ico>,
  ChevLeft: (p?: { size?: number }) => <Ico {...p}><polyline points="15 18 9 12 15 6"/></Ico>,
  Copy: (p?: { size?: number }) => <Ico {...p}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></Ico>,
  Bell: (p?: { size?: number }) => <Ico {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></Ico>,
  Logout: (p?: { size?: number }) => <Ico {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></Ico>,
  Settings: (p?: { size?: number }) => <Ico {...p}><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 10v6M4.22 4.22l4.24 4.24m7.08 7.08 4.24 4.24M1 12h6m10 0h6M4.22 19.78l4.24-4.24m7.08-7.08 4.24-4.24"/></Ico>,
  Check: (p?: { size?: number }) => <Ico {...p}><polyline points="20 6 9 17 4 12"/></Ico>,
  Clock: (p?: { size?: number }) => <Ico {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Ico>,
  User: (p?: { size?: number }) => <Ico {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Ico>,
};

// ---- Brand mark ----
export function BrandMark({ size = 32 }: { size?: number }) {
  return (
    <span style={{
      width: size, height: size,
      borderRadius: Math.round(size * 0.28),
      background: 'linear-gradient(140deg, var(--accent-500), var(--accent-700))',
      color: '#fff',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: 'var(--shadow-sm)', flexShrink: 0,
    }}>
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
      </svg>
    </span>
  );
}

// ---- Status pill ----
const STATUS_STYLES: Record<string, { bg: string; fg: string; dot: string }> = {
  OPEN:        { bg: 'var(--status-open-bg)',      fg: 'var(--status-open-fg)',      dot: 'var(--status-open-dot)' },
  ASSIGNED:    { bg: 'var(--status-assigned-bg)',  fg: 'var(--status-assigned-fg)',  dot: 'var(--status-assigned-dot)' },
  IN_PROGRESS: { bg: 'var(--status-progress-bg)',  fg: 'var(--status-progress-fg)',  dot: 'var(--status-progress-dot)' },
  RESOLVED:    { bg: 'var(--status-resolved-bg)',  fg: 'var(--status-resolved-fg)',  dot: 'var(--status-resolved-dot)' },
  CLOSED:      { bg: 'var(--status-closed-bg)',    fg: 'var(--status-closed-fg)',    dot: 'var(--status-closed-dot)' },
  SUSPENDED:   { bg: 'var(--status-suspended-bg)', fg: 'var(--status-suspended-fg)', dot: 'var(--status-suspended-dot)' },
  ACTIVE:      { bg: 'var(--status-resolved-bg)',  fg: 'var(--status-resolved-fg)',  dot: 'var(--status-resolved-dot)' },
};

export function StatusPill({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.CLOSED;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 10px', borderRadius: 'var(--radius-pill)',
      background: s.bg, color: s.fg,
      fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 600,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.dot, flexShrink: 0 }}/>
      {status}
    </span>
  );
}

// ---- Avatar ----
const ROLE_STYLES: Record<string, { bg: string; color: string }> = {
  USER:       { bg: 'var(--bg-sunken)',            color: 'var(--fg-secondary)' },
  STAFF:      { bg: 'var(--status-assigned-bg)',   color: 'var(--status-assigned-fg)' },
  ADMIN:      { bg: 'var(--accent-50)',             color: 'var(--accent-700)' },
  SUPER_ADMIN:{ bg: 'var(--status-open-bg)',        color: 'var(--status-open-fg)' },
};

export function Avatar({ name = '', role = 'USER', size = 32 }: { name?: string; role?: string; size?: number }) {
  const initials = name.split(/\s+/).map(s => s[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || '?';
  const st = ROLE_STYLES[role] ?? ROLE_STYLES.USER;
  return (
    <span style={{
      width: size, height: size, borderRadius: '50%',
      background: st.bg, color: st.color,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 600, fontSize: size * 0.38, border: '1px solid var(--border-subtle)', flexShrink: 0,
    }}>
      {initials}
    </span>
  );
}

// ---- KPI card ----
export function KpiCard({ label, value, delta, deltaKind, valueColor }: {
  label: string; value: string | number;
  delta?: string; deltaKind?: 'up' | 'down'; valueColor?: string;
}) {
  return (
    <div style={{
      background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)',
      padding: '18px 20px',
    }}>
      <div style={{ fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--fg-tertiary)', fontWeight: 600, marginBottom: 10 }}>
        {label}
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, color: valueColor ?? 'var(--fg-primary)', letterSpacing: '-0.02em', lineHeight: 1 }}>
        {value}
      </div>
      {delta && (
        <div style={{ fontSize: 12, marginTop: 8, color: deltaKind === 'up' ? 'var(--success)' : deltaKind === 'down' ? 'var(--danger)' : 'var(--fg-tertiary)' }}>
          {delta}
        </div>
      )}
    </div>
  );
}

// ---- Sidebar ----
interface NavItem {
  key: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  count?: number;
}

interface SidebarProps {
  brandRole: string;
  items: NavItem[];
  activeKey: string;
  user: { name: string; email: string; role: string };
  onLogout: () => void;
}

export function Sidebar({ brandRole, items, activeKey, user, onLogout }: SidebarProps) {
  return (
    <aside style={{
      width: 240, flexShrink: 0,
      background: 'var(--bg-sidebar)',
      padding: '18px 14px',
      display: 'flex', flexDirection: 'column', gap: 4,
      minHeight: '100vh', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px 14px', marginBottom: 8, borderBottom: '1px solid var(--border-soft)' }}>
        <BrandMark size={32}/>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <span style={{ fontWeight: 700, fontSize: 15.5, color: 'var(--fg-primary)', letterSpacing: '-0.015em' }}>Smart Complaint</span>
          <span style={{ fontSize: 10.5, color: 'var(--fg-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>{brandRole}</span>
        </div>
      </div>

      {/* Nav section label */}
      <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', padding: '10px 10px 4px' }}>
        Workspace
      </div>

      {/* Nav items */}
      {items.map(it => (
        <Link key={it.key} href={it.href} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 10px', borderRadius: 8,
          fontSize: 13.5, fontWeight: 500,
          color: activeKey === it.key ? '#fff' : 'var(--fg-secondary)',
          background: activeKey === it.key ? 'var(--accent-500)' : 'transparent',
          boxShadow: activeKey === it.key ? 'var(--shadow-sm)' : 'none',
          textDecoration: 'none',
          transition: 'background 120ms, color 120ms',
        }}
        onMouseEnter={e => { if (activeKey !== it.key) { (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; (e.currentTarget as HTMLElement).style.color = 'var(--fg-primary)'; }}}
        onMouseLeave={e => { if (activeKey !== it.key) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--fg-secondary)'; }}}
        >
          {it.icon}
          <span style={{ flex: 1 }}>{it.label}</span>
          {it.count != null && (
            <span style={{
              fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 600,
              padding: '1px 7px', borderRadius: 999,
              background: activeKey === it.key ? 'rgba(255,255,255,0.22)' : 'var(--border-subtle)',
              color: activeKey === it.key ? '#fff' : 'var(--fg-tertiary)',
            }}>
              {it.count}
            </span>
          )}
        </Link>
      ))}

      {/* Footer */}
      <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: '1px solid var(--border-soft)' }}>
        <Link href="/profile" style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10,
          textDecoration: 'none', transition: 'background 120ms',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
        >
          <Avatar name={user.name} role={user.role}/>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name || user.email}</span>
            <span style={{ fontSize: 11, color: 'var(--fg-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</span>
          </div>
          <Icons.Settings size={13} />
        </Link>
        <button onClick={onLogout} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 10px', borderRadius: 8, width: '100%',
          fontSize: 13.5, fontWeight: 500, color: 'var(--fg-secondary)',
          background: 'transparent', border: 'none', cursor: 'pointer',
          transition: 'background 120ms, color 120ms',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; (e.currentTarget as HTMLElement).style.color = 'var(--fg-primary)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--fg-secondary)'; }}
        >
          <Icons.Logout/>Log out
        </button>
      </div>
    </aside>
  );
}

// ---- Topbar ----
export function Topbar({ crumbs = [], right }: { crumbs?: string[]; right?: React.ReactNode }) {
  return (
    <div style={{
      height: 64, background: 'var(--bg-app)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '0 28px', position: 'sticky', top: 0, zIndex: 20,
    }}>
      <div style={{ fontSize: 13.5, color: 'var(--fg-tertiary)', display: 'flex', alignItems: 'center', gap: 6 }}>
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span style={{ color: 'var(--fg-quaternary)', margin: '0 4px' }}>/</span>}
            <span style={i === crumbs.length - 1 ? { color: 'var(--fg-primary)', fontWeight: 600 } : {}}>{c}</span>
          </React.Fragment>
        ))}
      </div>
      <div style={{ flex: 1 }}/>
      {right}
    </div>
  );
}

// ---- Table wrapper ----
export function TableWrap({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)',
    }}>
      {children}
    </div>
  );
}

// ---- Data table ----
export function DataTable({ head, children, empty }: {
  head: React.ReactNode;
  children: React.ReactNode;
  empty?: boolean;
}) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
      <thead>
        <tr>
          {React.Children.map(head as React.ReactElement, (th, i) => (
            <th key={i} style={{
              textAlign: 'left', background: 'var(--bg-sunken)',
              borderBottom: '1px solid var(--border-subtle)',
              fontWeight: 500, fontSize: 11, color: 'var(--fg-tertiary)',
              textTransform: 'uppercase', letterSpacing: '0.06em',
              padding: '11px 20px',
            }}>{th}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}

// ---- Btn ----
type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export function Btn({
  children, onClick, disabled, variant = 'secondary', size = 'md', type = 'button', style: extraStyle, href,
}: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean;
  variant?: BtnVariant; size?: 'sm' | 'md'; type?: 'button' | 'submit';
  style?: React.CSSProperties; href?: string;
}) {
  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: size === 'sm' ? '6px 11px' : '9px 14px',
    borderRadius: size === 'sm' ? 8 : 'var(--radius-md)',
    border: '1px solid transparent',
    fontSize: size === 'sm' ? 12.5 : 13.5, fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    transition: 'background 120ms, color 120ms',
    textDecoration: 'none', fontFamily: 'var(--font-sans)',
    letterSpacing: '-0.005em',
    ...extraStyle,
  };
  const variants: Record<BtnVariant, React.CSSProperties> = {
    primary:   { background: 'var(--accent-500)', color: '#fff', border: '1px solid transparent' },
    secondary: { background: 'var(--bg-surface)', color: 'var(--fg-primary)', borderColor: 'var(--border-soft)', boxShadow: 'var(--shadow-xs)' },
    ghost:     { background: 'transparent', color: 'var(--fg-secondary)', border: '1px solid transparent' },
    danger:    { background: 'var(--danger)', color: '#fff', border: '1px solid transparent' },
  };
  const style = { ...base, ...variants[variant] };

  if (href) {
    return <Link href={href} style={style}>{children}</Link>;
  }
  return <button type={type} onClick={onClick} disabled={disabled} style={style}>{children}</button>;
}

// ---- Input ----
export function Input({ placeholder, value, onChange, type = 'text', style }: {
  placeholder?: string; value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string; style?: React.CSSProperties;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        fontFamily: 'var(--font-sans)', fontSize: 13.5,
        padding: '9px 12px', borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-soft)',
        background: 'var(--bg-surface)', color: 'var(--fg-primary)',
        outline: 'none', width: '100%', ...style,
      }}
    />
  );
}

// ---- Search wrap ----
export function SearchWrap({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div style={{ position: 'relative', flex: 1 }}>
      <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-tertiary)', display: 'flex' }}>
        <Icons.Search size={15}/>
      </span>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder ?? 'Search…'}
        style={{
          fontFamily: 'var(--font-sans)', fontSize: 13.5,
          padding: '9px 12px 9px 34px', borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-soft)',
          background: 'var(--bg-surface)', color: 'var(--fg-primary)',
          outline: 'none', width: '100%',
        }}
      />
    </div>
  );
}

// ---- Segmented filter ----
export function Segmented({ options, value, onChange }: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{
      display: 'inline-flex', gap: 4, padding: 3,
      background: 'var(--bg-sunken)', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
    }}>
      {options.map(o => (
        <button key={o.value} onClick={() => onChange(o.value)} style={{
          padding: '5px 12px', fontSize: 12.5, borderRadius: 7,
          border: 'none',
          background: value === o.value ? 'var(--bg-surface)' : 'transparent',
          color: value === o.value ? 'var(--fg-primary)' : 'var(--fg-tertiary)',
          boxShadow: value === o.value ? 'var(--shadow-xs)' : 'none',
          cursor: 'pointer', fontWeight: 500, fontFamily: 'var(--font-sans)',
        }}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ---- Card ----
export function Card({ children, style, hero }: { children: React.ReactNode; style?: React.CSSProperties; hero?: boolean }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: hero ? 'var(--radius-xl)' : 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)',
      padding: hero ? '28px 32px' : '22px 24px',
      ...style,
    }}>
      {children}
    </div>
  );
}

// ---- Page shell for sidebar portals ----
export function PortalShell({ sidebar, children }: { sidebar: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-app)' }}>
      {sidebar}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {children}
      </div>
    </div>
  );
}

// ---- Page content area ----
export function PageContent({ children }: { children: React.ReactNode }) {
  return (
    <main style={{ padding: '28px 32px 48px', flex: 1 }}>
      {children}
    </main>
  );
}

// ---- Page header ----
export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--fg-primary)', margin: 0, marginBottom: subtitle ? 4 : 0 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 14, color: 'var(--fg-tertiary)', margin: 0 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ---- Loading ----
export function LoadingState({ message = 'Loading…' }: { message?: string }) {
  return (
    <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--fg-tertiary)', fontSize: 14 }}>
      {message}
    </div>
  );
}

// ---- Empty state ----
export function EmptyState({ message }: { message: string }) {
  return (
    <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--fg-tertiary)', fontSize: 14 }}>
      {message}
    </div>
  );
}

// ---- Pagination ----
export function Pagination({ page, totalPages, onPrev, onNext, total, pageSize }: {
  page: number; totalPages: number;
  onPrev: () => void; onNext: () => void;
  total: number; pageSize: number;
}) {
  if (totalPages <= 1) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
      <p style={{ fontSize: 13, color: 'var(--fg-tertiary)', margin: 0 }}>
        Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <Btn variant="secondary" size="sm" onClick={onPrev} disabled={page === 1}>Previous</Btn>
        <span style={{ padding: '6px 11px', fontSize: 12.5, color: 'var(--fg-secondary)' }}>{page} / {totalPages}</span>
        <Btn variant="secondary" size="sm" onClick={onNext} disabled={page === totalPages}>Next</Btn>
      </div>
    </div>
  );
}

// ---- Role badge (pill for roles) ----
export function RoleBadge({ role }: { role: string }) {
  const st = ROLE_STYLES[role] ?? ROLE_STYLES.USER;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 10px', borderRadius: 'var(--radius-pill)',
      background: st.bg, color: st.color,
      fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 600,
    }}>
      {role}
    </span>
  );
}

// ---- TR hover helper ----
export function TR({ children, onClick, style }: { children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <tr
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: onClick ? 'pointer' : 'default', background: hovered ? 'var(--bg-hover)' : undefined, ...style }}
    >
      {children}
    </tr>
  );
}

// ---- TD ----
export function TD({ children, mono, muted, right, strong, style }: {
  children: React.ReactNode; mono?: boolean; muted?: boolean;
  right?: boolean; strong?: boolean; style?: React.CSSProperties;
}) {
  return (
    <td style={{
      padding: '14px 20px', color: muted ? 'var(--fg-tertiary)' : strong ? 'var(--fg-primary)' : 'var(--fg-secondary)',
      borderBottom: '1px solid var(--border-subtle)', fontFamily: mono ? 'var(--font-mono)' : undefined,
      fontSize: mono ? 12 : undefined, fontWeight: strong ? 500 : undefined,
      textAlign: right ? 'right' : 'left', ...style,
    }}>
      {children}
    </td>
  );
}

// ---- TH ----
export function TH({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return (
    <th style={{
      textAlign: right ? 'right' : 'left', background: 'var(--bg-sunken)',
      borderBottom: '1px solid var(--border-subtle)',
      fontWeight: 500, fontSize: 11, color: 'var(--fg-tertiary)',
      textTransform: 'uppercase', letterSpacing: '0.06em', padding: '11px 20px',
    }}>
      {children}
    </th>
  );
}
