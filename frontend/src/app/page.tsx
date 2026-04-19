'use client';

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react';
import Link from 'next/link';
import { BrandMark } from '../components/ui';

/* ── Scroll-reveal hook ──────────────────────────────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible] as const;
}

function FadeIn({ children, delay = 0, style }: { children: ReactNode; delay?: number; style?: CSSProperties }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(28px)',
      transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ── Inline SVG ──────────────────────────────────────────────────────────── */
function ArrowRight({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}

function Check({ size = 14, color }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

/* ── Data ────────────────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    title: 'Multi-tenant organizations',
    desc: 'Every organization gets its own isolated portal, unique slug URL, and fully scoped data. Zero cross-tenant leakage.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    title: 'Smart auto-assignment',
    desc: 'Round-robin staff assignment distributes complaints fairly the moment they arrive. No manual triage needed.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
      </svg>
    ),
    title: 'Role-based dashboards',
    desc: 'KPI cards, complaint tables, and status filters. Purpose-built views for Users, Staff, and Admins.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    title: 'Search & status filters',
    desc: 'Full-text search and status-based filtering across any complaint volume, paginated and always fast.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Granular role access',
    desc: 'Three roles: Admin, Staff, and User. Each scoped to exactly the data and actions they need.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
    ),
    title: 'Instant invite links',
    desc: 'Shareable join URLs let users and staff self-register under your organization with a single click.',
  },
];

const STEPS = [
  {
    num: '01',
    emoji: '🏢',
    title: 'Register your organization',
    desc: 'Sign up in minutes, receive a unique portal URL, and configure your team structure immediately.',
  },
  {
    num: '02',
    emoji: '🔗',
    title: 'Invite users & staff',
    desc: 'Share your join link. Members self-register with no CSVs, no manual setup, and no email invites required.',
  },
  {
    num: '03',
    emoji: '✅',
    title: 'Resolve complaints faster',
    desc: 'Tickets auto-assign to staff. Track every complaint from ASSIGNED to CLOSED with a full audit trail.',
  },
];

const ROLES = [
  {
    emoji: '👤',
    title: 'Customer',
    tag: 'USER',
    tagBg: 'var(--status-assigned-bg)',
    tagFg: 'var(--status-assigned-fg)',
    desc: 'Submit complaints, track resolution progress in real time, and see who\'s working on your issue.',
    perks: ['Submit complaints instantly', 'Track status end-to-end', 'View assigned staff', 'Full complaint history'],
  },
  {
    emoji: '🧑‍💼',
    title: 'Staff member',
    tag: 'STAFF',
    tagBg: 'var(--status-progress-bg)',
    tagFg: 'var(--status-progress-fg)',
    desc: 'A focused queue of your assigned tickets. Filter by status, search, update progress, and close issues.',
    perks: ['Personal assignment queue', 'Status & progress updates', 'Search & filter tools', 'Workload visibility'],
  },
  {
    emoji: '🏛️',
    title: 'Organization admin',
    tag: 'ADMIN',
    tagBg: 'var(--accent-50)',
    tagFg: 'var(--accent-700)',
    desc: 'Complete visibility across all complaints, staff performance metrics, and organization management.',
    perks: ['All-complaints overview', 'Assign to any staff member', 'KPI & status dashboards', 'Invite link management'],
  },
];

/* ── Hero mock dashboard ─────────────────────────────────────────────────── */
const MOCK_ROWS = [
  { title: 'Login page broken',       user: 'Sarah M.', staff: 'Alice', status: 'RESOLVED' },
  { title: 'Payment not processing',  user: 'James K.', staff: 'Bob',   status: 'IN_PROGRESS' },
  { title: 'App crashes on startup',  user: 'Priya S.', staff: 'Alice', status: 'ASSIGNED' },
  { title: 'Wrong invoice amount',    user: 'Tom R.',   staff: 'Bob',   status: 'CLOSED' },
];

const STATUS_STYLE: Record<string, { bg: string; fg: string; dot: string }> = {
  RESOLVED:    { bg: 'var(--status-resolved-bg)',  fg: 'var(--status-resolved-fg)',  dot: 'var(--status-resolved-dot)' },
  IN_PROGRESS: { bg: 'var(--status-progress-bg)',  fg: 'var(--status-progress-fg)',  dot: 'var(--status-progress-dot)' },
  ASSIGNED:    { bg: 'var(--status-assigned-bg)',  fg: 'var(--status-assigned-fg)',  dot: 'var(--status-assigned-dot)' },
  CLOSED:      { bg: 'var(--status-closed-bg)',    fg: 'var(--status-closed-fg)',    dot: 'var(--status-closed-dot)' },
};

function HeroVisual() {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 18,
        overflow: 'hidden',
        boxShadow: 'var(--shadow-xl)',
        fontSize: 12,
        fontFamily: 'var(--font-sans)',
        transform: hovered
          ? 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1.02)'
          : 'perspective(1000px) rotateY(-5deg) rotateX(2deg)',
        transition: 'transform 0.4s cubic-bezier(0.23,1,0.32,1)',
        willChange: 'transform',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Browser chrome */}
      <div style={{ background: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border-subtle)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {['#FF6057','#FFBD2E','#27C93F'].map(c => (
            <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c, opacity: 0.85 }}/>
          ))}
        </div>
        <div style={{ flex: 1, margin: '0 10px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 5, padding: '3px 10px', fontSize: 10, color: 'var(--fg-tertiary)', fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          app.smartcomplaint.io/admin/dashboard
        </div>
      </div>

      <div style={{ display: 'flex', height: 310 }}>
        {/* Sidebar */}
        <div style={{ width: 136, borderRight: '1px solid var(--border-subtle)', background: 'var(--bg-sidebar)', padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px', marginBottom: 10 }}>
            <div style={{ width: 20, height: 20, borderRadius: 6, background: 'var(--accent-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: 10.5, color: 'var(--fg-primary)', letterSpacing: '-0.01em' }}>Smart Complaint</span>
          </div>

          <div style={{ fontSize: 8.5, fontWeight: 700, color: 'var(--fg-quaternary)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 8px', marginBottom: 4 }}>Workspace</div>

          {[
            { label: 'Dashboard', active: true },
            { label: 'Complaints', active: false },
            { label: 'Staff', active: false },
            { label: 'Performance', active: false },
          ].map(item => (
            <div key={item.label} style={{
              padding: '6px 8px', borderRadius: 6, fontSize: 11,
              background: item.active ? 'var(--accent-500)' : 'transparent',
              color: item.active ? '#fff' : 'var(--fg-secondary)',
              fontWeight: item.active ? 600 : 400,
            }}>
              {item.label}
            </div>
          ))}

          <div style={{ flex: 1 }}/>
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 8, display: 'flex', alignItems: 'center', gap: 6, padding: '8px', borderRadius: 8 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: 'var(--accent-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9.5, fontWeight: 700, color: 'var(--accent-700)', flexShrink: 0 }}>A</div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--fg-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Admin</div>
              <div style={{ fontSize: 9, color: 'var(--fg-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>admin@acme.dev</div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: '14px', overflow: 'hidden', background: 'var(--bg-app)' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-primary)', marginBottom: 12, letterSpacing: '-0.015em' }}>System overview</div>

          {/* KPI cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 7, marginBottom: 12 }}>
            {[
              { label: 'Assigned',    val: '12', color: 'var(--status-assigned-fg)' },
              { label: 'In Progress', val: '4',  color: 'var(--status-progress-fg)' },
              { label: 'Resolved',    val: '31', color: 'var(--status-resolved-fg)' },
              { label: 'Closed',      val: '18', color: 'var(--status-closed-fg)' },
            ].map(k => (
              <div key={k.label} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '8px 9px' }}>
                <div style={{ fontSize: 8, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3, fontWeight: 600 }}>{k.label}</div>
                <div style={{ fontSize: 19, fontWeight: 800, color: k.color, letterSpacing: '-0.02em' }}>{k.val}</div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 9, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 52px 88px', padding: '6px 11px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-sidebar)' }}>
              {['Title', 'Staff', 'Status'].map(h => (
                <span key={h} style={{ fontSize: 8.5, fontWeight: 700, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</span>
              ))}
            </div>
            {MOCK_ROWS.map((row, i) => {
              const s = STATUS_STYLE[row.status];
              return (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 52px 88px', padding: '7px 11px', borderBottom: i < MOCK_ROWS.length - 1 ? '1px solid var(--border-subtle)' : 'none', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--fg-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8 }}>{row.title}</span>
                  <span style={{ fontSize: 10, color: 'var(--fg-tertiary)' }}>{row.staff}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 7px', borderRadius: 999, background: s.bg, color: s.fg, fontSize: 8.5, fontWeight: 700, width: 'fit-content' }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.dot, flexShrink: 0 }}/>
                    {row.status.replace('_', ' ')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-app)', fontFamily: 'var(--font-sans)', overflowX: 'hidden' }}>
      <style>{`
        @keyframes fadeUp   { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes badgePop { from { opacity:0; transform:scale(0.88); }     to { opacity:1; transform:scale(1); } }
        @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .lp-h1  { animation: fadeUp 0.75s 0.05s ease both; }
        .lp-sub { animation: fadeUp 0.75s 0.20s ease both; }
        .lp-cta { animation: fadeUp 0.75s 0.35s ease both; }
        .lp-vis { animation: fadeUp 0.9s 0.5s  ease both; }
        .lp-float { animation: float 7s ease-in-out infinite; }
        .lp-badge { animation: badgePop 0.5s ease both; }
        .feat-card { transition: border-color 180ms, box-shadow 180ms, transform 180ms; }
        .feat-card:hover { border-color: var(--accent-300) !important; box-shadow: var(--shadow-md); transform: translateY(-3px); }
        .nav-link { transition: color 120ms; }
        .nav-link:hover { color: var(--fg-primary) !important; }
        .btn-primary { transition: background 150ms, box-shadow 150ms; }
        .btn-primary:hover { background: var(--accent-600) !important; box-shadow: 0 4px 12px -2px rgb(176 82 47 / 0.35) !important; }
        .btn-primary:active { background: var(--accent-700) !important; box-shadow: none !important; }
        .btn-ghost { transition: background 120ms, border-color 120ms; }
        .btn-ghost:hover { background: var(--bg-hover) !important; border-color: var(--border-strong) !important; }
      `}</style>

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50, height: 64,
        background: scrolled ? 'rgba(255,255,255,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px) saturate(1.4)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
        transition: 'background 220ms, border-color 220ms, backdrop-filter 220ms',
        display: 'flex', alignItems: 'center', padding: '0 48px', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <BrandMark size={28}/>
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.015em', color: 'var(--fg-primary)' }}>Smart Complaint</span>
        </div>
        <div style={{ flex: 1 }}/>
        <Link href="/login" className="nav-link" style={{ padding: '7px 14px', borderRadius: 8, fontSize: 13.5, fontWeight: 600, color: 'var(--fg-secondary)', textDecoration: 'none' }}>
          Sign in
        </Link>
        <Link href="/register/org" className="btn-primary" style={{
          display: 'inline-flex', alignItems: 'center', gap: 7, padding: '7px 16px',
          borderRadius: 9, background: 'var(--accent-500)', color: '#fff',
          fontSize: 13.5, fontWeight: 700, textDecoration: 'none',
          boxShadow: '0 2px 8px -2px rgb(201 100 66 / 0.4)',
        }}>
          Get started <ArrowRight size={14}/>
        </Link>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 48px 100px', display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 72, alignItems: 'center' }}>
        <div>
          <div className="lp-badge" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '5px 13px', borderRadius: 999,
            background: 'var(--accent-50)', border: '1px solid var(--accent-200)',
            color: 'var(--accent-700)', fontSize: 12.5, fontWeight: 600, marginBottom: 28,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-500)', display: 'inline-block' }}/>
            Complaint Management Platform
          </div>

          <h1 className="lp-h1" style={{ fontSize: 56, fontWeight: 800, letterSpacing: '-0.035em', color: 'var(--fg-primary)', margin: '0 0 22px', lineHeight: 1.08 }}>
            Smart complaints.<br/>
            <span style={{ color: 'var(--accent-500)' }}>Faster resolutions.</span>
          </h1>

          <p className="lp-sub" style={{ fontSize: 17.5, color: 'var(--fg-secondary)', lineHeight: 1.72, margin: '0 0 40px', maxWidth: 490 }}>
            Give your organization a structured way to capture, assign, and resolve customer issues. Full visibility at every step.
          </p>

          <div className="lp-cta" style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <Link href="/register/org" className="btn-primary" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 24px',
              borderRadius: 11, background: 'var(--accent-500)', color: '#fff',
              fontSize: 15, fontWeight: 700, textDecoration: 'none',
              boxShadow: '0 4px 14px -2px rgb(201 100 66 / 0.38)',
            }}>
              Register your organization <ArrowRight size={16}/>
            </Link>
            <Link href="/login" className="btn-ghost" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '13px 20px',
              borderRadius: 11, color: 'var(--fg-secondary)', fontSize: 15, fontWeight: 600,
              textDecoration: 'none', border: '1px solid var(--border-soft)',
              background: 'var(--bg-surface)',
            }}>
              Sign in
            </Link>
          </div>

          <div style={{ display: 'flex', gap: 24, marginTop: 36, paddingTop: 24, borderTop: '1px solid var(--border-subtle)' }}>
            {[
              { val: '3 roles',      label: 'built in' },
              { val: 'Multi-tenant', label: 'isolation' },
              { val: 'Auto-assign',  label: 'round-robin' },
            ].map(stat => (
              <div key={stat.val}>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--fg-primary)', letterSpacing: '-0.01em' }}>{stat.val}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-tertiary)', marginTop: 1 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="lp-vis lp-float">
          <HeroVisual/>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', padding: '88px 48px' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <FadeIn style={{ textAlign: 'center', marginBottom: 60 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent-600)', marginBottom: 12 }}>Platform features</p>
            <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--fg-primary)', margin: '0 0 16px' }}>
              Everything you need to manage complaints
            </h2>
            <p style={{ fontSize: 16.5, color: 'var(--fg-tertiary)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
              Built for organizations that take customer issues seriously. From first complaint to final resolution.
            </p>
          </FadeIn>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {FEATURES.map((f, i) => (
              <FadeIn key={i} delay={i * 70}>
                <div className="feat-card" style={{
                  padding: '28px 26px', borderRadius: 14, border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-app)', height: '100%', boxSizing: 'border-box',
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: 'var(--accent-50)', border: '1px solid var(--accent-100)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--accent-600)', marginBottom: 18,
                  }}>
                    {f.icon}
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--fg-primary)', margin: '0 0 9px', letterSpacing: '-0.01em' }}>{f.title}</h3>
                  <p style={{ fontSize: 14.5, color: 'var(--fg-tertiary)', lineHeight: 1.68, margin: 0 }}>{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────────── */}
      <section style={{ padding: '88px 48px', maxWidth: 1140, margin: '0 auto' }}>
        <FadeIn style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent-600)', marginBottom: 12 }}>How it works</p>
          <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--fg-primary)', margin: '0 0 16px' }}>Up and running in minutes</h2>
          <p style={{ fontSize: 16.5, color: 'var(--fg-tertiary)', maxWidth: 440, margin: '0 auto', lineHeight: 1.7 }}>
            No complex setup. No IT team required.
          </p>
        </FadeIn>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, position: 'relative' }}>
          {/* Connector */}
          <div style={{
            position: 'absolute', top: 36, left: '16.67%', right: '16.67%', height: 1,
            background: `linear-gradient(90deg, var(--border-subtle), var(--accent-300), var(--border-subtle))`,
            zIndex: 0,
          }}/>
          {STEPS.map((s, i) => (
            <FadeIn key={i} delay={i * 100} style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ padding: '0 36px', textAlign: 'center' }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'var(--bg-surface)',
                  border: '2px solid var(--border-subtle)',
                  boxShadow: '0 0 0 6px var(--bg-app)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 24px', fontSize: 26,
                }}>
                  {s.emoji}
                </div>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent-500)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>{s.num}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--fg-primary)', margin: '0 0 10px', letterSpacing: '-0.01em' }}>{s.title}</h3>
                <p style={{ fontSize: 14.5, color: 'var(--fg-tertiary)', lineHeight: 1.68, margin: 0 }}>{s.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── Who it's for ────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', padding: '88px 48px' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <FadeIn style={{ textAlign: 'center', marginBottom: 60 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent-600)', marginBottom: 12 }}>Built for every role</p>
            <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--fg-primary)', margin: '0 0 16px' }}>One platform, three portals</h2>
            <p style={{ fontSize: 16.5, color: 'var(--fg-tertiary)', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
              Each role gets a purpose-built experience — no clutter, no irrelevant data, no confusion.
            </p>
          </FadeIn>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {ROLES.map((r, i) => (
              <FadeIn key={i} delay={i * 90}>
                <div style={{
                  padding: '32px 28px', borderRadius: 16, border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-app)', height: '100%', boxSizing: 'border-box',
                  display: 'flex', flexDirection: 'column',
                }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '5px 12px 5px 10px', borderRadius: 999,
                    background: r.tagBg, color: r.tagFg,
                    fontSize: 12.5, fontWeight: 700, marginBottom: 20, width: 'fit-content',
                  }}>
                    {r.emoji} {r.title}
                  </div>
                  <p style={{ fontSize: 14.5, color: 'var(--fg-secondary)', lineHeight: 1.68, margin: '0 0 22px', flex: 1 }}>{r.desc}</p>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9 }}>
                    {r.perks.map(p => (
                      <li key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, color: 'var(--fg-primary)', fontWeight: 500 }}>
                        <Check color={r.tagFg}/>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '24px 48px', background: 'var(--bg-surface)' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <BrandMark size={20}/>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-secondary)', letterSpacing: '-0.01em' }}>Smart Complaint</span>
          <div style={{ flex: 1 }}/>
          <span style={{ fontSize: 12, color: 'var(--fg-quaternary)' }}>© {new Date().getFullYear()} Smart Complaint. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
