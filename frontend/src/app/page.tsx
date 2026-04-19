import Link from 'next/link';
import { BrandMark } from '../components/ui';

export default function Home() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-app)', padding: '24px 16px' }}>
      <div style={{ textAlign: 'center', maxWidth: 420, width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <BrandMark size={56}/>
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--fg-primary)', margin: '0 0 8px' }}>Smart Complaint</h1>
        <p style={{ fontSize: 16, color: 'var(--fg-tertiary)', margin: '0 0 40px', lineHeight: 1.6 }}>
          The intelligent platform to manage and resolve complaints.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Link href="/login" style={{
            display: 'flex', justifyContent: 'center', padding: '11px 20px',
            borderRadius: 'var(--radius-md)', background: 'var(--accent-500)', color: '#fff',
            fontSize: 14, fontWeight: 600, textDecoration: 'none', letterSpacing: '-0.005em',
            transition: 'background 120ms',
          }}>
            Sign in
          </Link>
          <Link href="/register/org" style={{
            display: 'flex', justifyContent: 'center', padding: '11px 20px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface)', color: 'var(--fg-primary)',
            border: '1px solid var(--border-soft)', boxShadow: 'var(--shadow-xs)',
            fontSize: 14, fontWeight: 600, textDecoration: 'none', letterSpacing: '-0.005em',
          }}>
            Register your organization
          </Link>
        </div>
      </div>
    </div>
  );
}
