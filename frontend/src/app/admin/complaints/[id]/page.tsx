'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '../../../../context/AuthContext';
import api from '../../../../lib/axios';
import Link from 'next/link';
import { format } from 'date-fns';
import { Card, StatusPill, Avatar, Segmented, Btn, Icons } from '../../../../components/ui';

const STATUS_OPTS = [
  { label: 'OPEN', value: 'OPEN' },
  { label: 'ASSIGNED', value: 'ASSIGNED' },
  { label: 'IN_PROGRESS', value: 'IN_PROGRESS' },
  { label: 'RESOLVED', value: 'RESOLVED' },
];

export default function AdminComplaintDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { user } = useAuth();

  const [complaint, setComplaint] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.get(`/complaints/${id}`),
      api.get(`/complaints/${id}/comments`),
      api.get(`/users`),
    ]).then(([compRes, commRes, usersRes]) => {
      setComplaint(compRes.data.data);
      setComments(commRes.data.data);
      setUsers(usersRes.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleAssign = async () => {
    if (!selectedStaff) return;
    try {
      const res = await api.patch(`/complaints/${id}/assign`, { staffId: selectedStaff });
      setComplaint(res.data.data);
      setSelectedStaff('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to assign');
    }
  };

  const handleClose = async () => {
    if (!confirm('Close this complaint? No further actions will be available.')) return;
    try {
      const res = await api.patch(`/complaints/${id}/close`);
      setComplaint(res.data.data);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to close');
    }
  };

  const handlePostComment = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmittingComment(true);
    try {
      const res = await api.post(`/complaints/${id}/comments`, { content: commentText });
      setComments([...comments, { ...res.data.data, author: { email: user?.email, role: 'ADMIN', name: user?.name || 'Admin' } }]);
      setCommentText('');
    } catch {
      alert('Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) return <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--fg-tertiary)' }}>Loading…</div>;
  if (!complaint) return <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--danger)' }}>Complaint not found.</div>;

  const staffUsers = users.filter((u: any) => u.role === 'STAFF');

  return (
    <div style={{ maxWidth: 860 }}>
      <Link href="/admin/complaints" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--fg-tertiary)', textDecoration: 'none', marginBottom: 20, fontWeight: 500 }}>
        <Icons.ChevLeft size={14}/> Back to complaints
      </Link>

      {/* Header card */}
      <Card hero style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ flex: 1, paddingRight: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', marginBottom: 6 }}>
              Complaint · <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{complaint._id}</span>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--fg-primary)', margin: '0 0 8px' }}>{complaint.title}</h2>
            <div style={{ fontSize: 13, color: 'var(--fg-tertiary)' }}>
              By <strong style={{ color: 'var(--fg-primary)', fontWeight: 500 }}>{complaint.createdBy?.name || complaint.createdBy?.email}</strong>
              {' · '}{format(new Date(complaint.createdAt), 'MMM d, yyyy · h:mm a')}
            </div>
          </div>
          <StatusPill status={complaint.status}/>
        </div>

        <p style={{ fontSize: 14, color: 'var(--fg-secondary)', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>{complaint.description}</p>

        {complaint.status !== 'CLOSED' && (
          <>
            <hr style={{ border: 0, borderTop: '1px solid var(--border-subtle)', margin: '20px 0' }}/>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', marginBottom: 12 }}>Admin controls</div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: 'var(--fg-tertiary)' }}>
                Assigned to: <strong style={{ color: 'var(--fg-primary)', fontWeight: 500 }}>{complaint.assignedTo?.name || complaint.assignedTo?.email || 'Unassigned'}</strong>
              </span>
              <select
                title="Select staff"
                value={selectedStaff}
                onChange={e => setSelectedStaff(e.target.value)}
                style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-soft)', background: 'var(--bg-surface)', color: 'var(--fg-primary)', outline: 'none' }}
              >
                <option value="">Select staff member…</option>
                {staffUsers.map((s: any) => <option key={s._id} value={s._id}>{s.name} ({s.email})</option>)}
              </select>
              <Btn variant="primary" size="sm" onClick={handleAssign} disabled={!selectedStaff}>Assign</Btn>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <Segmented options={STATUS_OPTS} value={complaint.status} onChange={() => {}}/>
              <Btn variant="danger" size="sm" onClick={handleClose}>Close complaint</Btn>
            </div>
          </>
        )}

        {complaint.status === 'CLOSED' && (
          <>
            <hr style={{ border: 0, borderTop: '1px solid var(--border-subtle)', margin: '20px 0' }}/>
            <div style={{ background: 'var(--bg-sunken)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: 13, color: 'var(--fg-tertiary)' }}>
              This complaint is closed. No further actions available.
            </div>
          </>
        )}
      </Card>

      {/* Discussion */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', fontWeight: 600, fontSize: 15, color: 'var(--fg-primary)' }}>
          Discussion &amp; audit log
        </div>
        <div style={{ padding: '8px 24px' }}>
          {comments.length === 0 ? (
            <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--fg-quaternary)', fontSize: 13 }}>No comments yet.</div>
          ) : comments.map((c: any, i: number) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '14px 0', borderBottom: i < comments.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
              <Avatar name={c.author?.name || c.author?.email || '?'} role={c.author?.role ?? 'USER'}/>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--fg-primary)' }}>{c.author?.name || c.author?.email || 'Unknown'}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-tertiary)', padding: '1px 6px', background: 'var(--bg-sunken)', borderRadius: 4 }}>{c.author?.role}</span>
                  <span style={{ fontSize: 12, color: 'var(--fg-tertiary)' }}>{c.createdAt ? format(new Date(c.createdAt), 'MMM d, h:mm a') : 'Just now'}</span>
                </div>
                <div style={{ fontSize: 13.5, color: 'var(--fg-secondary)', lineHeight: 1.6 }}>{c.content}</div>
              </div>
            </div>
          ))}
        </div>

        {complaint.status !== 'CLOSED' && (
          <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-sunken)' }}>
            <form onSubmit={handlePostComment} style={{ display: 'flex', gap: 10 }}>
              <input
                type="text"
                placeholder="Post an update or response…"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 13.5, padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-soft)', background: 'var(--bg-surface)', color: 'var(--fg-primary)', outline: 'none' }}
              />
              <Btn variant="primary" type="submit" disabled={submittingComment || !commentText.trim()}>Reply</Btn>
            </form>
          </div>
        )}
      </Card>
    </div>
  );
}
