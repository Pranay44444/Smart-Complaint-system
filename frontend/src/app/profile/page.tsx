'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/axios';
import Link from 'next/link';
import { BrandMark, Avatar, RoleBadge, Card, Icons, Btn } from '../../components/ui';

const ROLE_HOME: Record<string, string> = {
  ADMIN: '/admin/dashboard', STAFF: '/staff/complaints',
  USER: '/dashboard', SUPER_ADMIN: '/superadmin/dashboard',
};

export default function ProfilePage() {
  const { user, loading, updateUser } = useAuth();
  const [name, setName] = useState('');
  const [nameSuccess, setNameSuccess] = useState('');
  const [nameError, setNameError] = useState('');
  const [nameSaving, setNameSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => { if (user) setName(user.name || ''); }, [user]);

  const handleUpdateName = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;
    setNameSaving(true); setNameError(''); setNameSuccess('');
    try {
      const res = await api.patch('/users/me', { name: name.trim() });
      updateUser({ name: res.data.data.name });
      setNameSuccess('Name updated.');
    } catch (err: any) {
      setNameError(err.response?.data?.message || 'Failed to update name.');
    } finally { setNameSaving(false); }
  };

  const handleChangePassword = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPwError(''); setPwSuccess('');
    if (newPassword !== confirmPassword) { setPwError('New passwords do not match.'); return; }
    if (newPassword.length < 6) { setPwError('Password must be at least 6 characters.'); return; }
    setPwSaving(true);
    try {
      await api.patch('/users/me', { currentPassword, newPassword });
      setPwSuccess('Password changed.');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (err: any) {
      setPwError(err.response?.data?.message || 'Failed to change password.');
    } finally { setPwSaving(false); }
  };

  if (loading || !user) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'var(--fg-tertiary)', fontSize: 14 }}>Loading…</div>;

  const backHref = ROLE_HOME[user.role] || '/dashboard';

  const inputStyle: React.CSSProperties = { fontFamily: 'var(--font-sans)', fontSize: 13.5, padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-soft)', background: 'var(--bg-surface)', color: 'var(--fg-primary)', outline: 'none', width: '100%' };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-app)', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ height: 64, background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', padding: '0 28px', gap: 14 }}>
        <Link href={backHref} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--fg-tertiary)', textDecoration: 'none', fontWeight: 500 }}>
          <Icons.ChevLeft size={14}/> Back
        </Link>
        <div style={{ flex: 1 }}/>
        <BrandMark size={28}/>
      </nav>

      <main style={{ flex: 1, maxWidth: 600, width: '100%', margin: '0 auto', padding: '28px 24px 48px' }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--fg-primary)', margin: '0 0 24px' }}>Profile settings</h1>

        {/* Account info */}
        <Card style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <Avatar name={user.name ?? user.email ?? ''} role={user.role} size={48}/>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--fg-primary)' }}>{user.name || '—'}</div>
              <div style={{ fontSize: 13, color: 'var(--fg-tertiary)' }}>{user.email}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: 'var(--fg-secondary)' }}>
            Role: <RoleBadge role={user.role}/>
          </div>
        </Card>

        {/* Update name */}
        <Card style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--fg-primary)', margin: '0 0 16px' }}>Display name</h2>
          <form onSubmit={handleUpdateName}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--fg-secondary)' }}>Full name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required style={inputStyle}/>
              </div>
              {nameSuccess && <span style={{ fontSize: 12, color: 'var(--success)' }}>{nameSuccess}</span>}
              {nameError && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{nameError}</span>}
              <div><Btn variant="primary" size="sm" type="submit" disabled={nameSaving || !name.trim()}>{nameSaving ? 'Saving…' : 'Save name'}</Btn></div>
            </div>
          </form>
        </Card>

        {/* Change password */}
        <Card>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--fg-primary)', margin: '0 0 16px' }}>Change password</h2>
          <form onSubmit={handleChangePassword}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Current password', value: currentPassword, onChange: setCurrentPassword },
                { label: 'New password', value: newPassword, onChange: setNewPassword },
                { label: 'Confirm new password', value: confirmPassword, onChange: setConfirmPassword },
              ].map(f => (
                <div key={f.label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--fg-secondary)' }}>{f.label}</label>
                  <input type="password" value={f.value} onChange={e => f.onChange(e.target.value)} required style={inputStyle}/>
                </div>
              ))}
              {pwSuccess && <span style={{ fontSize: 12, color: 'var(--success)' }}>{pwSuccess}</span>}
              {pwError && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{pwError}</span>}
              <div><Btn variant="secondary" size="sm" type="submit" disabled={pwSaving || !currentPassword || !newPassword || !confirmPassword}>{pwSaving ? 'Changing…' : 'Change password'}</Btn></div>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}
