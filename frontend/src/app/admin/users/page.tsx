'use client';
import { useEffect, useState } from 'react';
import api from '../../../lib/axios';
import { TableWrap, TH, TD, TR, Avatar, RoleBadge } from '../../../components/ui';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api.patch(`/users/${userId}/role`, { role: newRole });
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update role');
    }
  };

  if (loading) return <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--fg-tertiary)' }}>Loading users…</div>;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--fg-primary)', margin: '0 0 4px' }}>Team &amp; users</h1>
        <p style={{ fontSize: 14, color: 'var(--fg-tertiary)', margin: 0 }}>Manage staff and end-user accounts for your organization.</p>
      </div>

      <TableWrap>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
          <thead>
            <tr><TH>Name</TH><TH>Email</TH><TH>Role</TH><TH>Joined</TH><TH right>Change role</TH></tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--fg-tertiary)' }}>No users found.</td></tr>
            ) : users.map(u => (
              <TR key={u._id}>
                <TD strong>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar name={u.name || u.email} role={u.role}/>
                    <span>{u.name || '—'}</span>
                  </div>
                </TD>
                <TD mono>{u.email}</TD>
                <TD><RoleBadge role={u.role}/></TD>
                <TD muted>{u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</TD>
                <TD right>
                  <select
                    title="Change role"
                    value={u.role}
                    onChange={e => handleRoleChange(u._id, e.target.value)}
                    style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, padding: '5px 10px', borderRadius: 8, border: '1px solid var(--border-soft)', background: 'var(--bg-surface)', color: 'var(--fg-primary)', outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="USER">USER</option>
                    <option value="STAFF">STAFF</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </TD>
              </TR>
            ))}
          </tbody>
        </table>
      </TableWrap>
    </div>
  );
}
