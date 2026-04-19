'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/axios';
import Link from 'next/link';
import { format } from 'date-fns';
import { BrandMark, Card, StatusPill, Avatar, Btn, Icons } from '../../../components/ui';

export default function ComplaintDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { user } = useAuth();

  const [complaint, setComplaint] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.get(`/complaints/${id}`),
      api.get(`/complaints/${id}/comments`),
    ]).then(([compRes, commRes]) => {
      setComplaint(compRes.data.data);
      setComments(commRes.data.data);
    }).catch((err: any) => {
      setError(err.response?.data?.message || 'Failed to load details');
    }).finally(() => setLoading(false));
  }, [id]);

  const handlePostComment = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmittingComment(true);
    try {
      const res = await api.post(`/complaints/${id}/comments`, { content: commentText });
      setComments([...comments, { ...res.data.data, author: user }]);
      setCommentText('');
    } catch {
      alert('Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'var(--fg-tertiary)', fontSize: 14 }}>Loading…</div>;
  if (error) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'var(--danger)', fontSize: 14 }}>{error}</div>;
  if (!complaint) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-app)', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ height: 64, background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', padding: '0 28px', gap: 14 }}>
        <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--fg-tertiary)', textDecoration: 'none', fontWeight: 500 }}>
          <Icons.ChevLeft size={14}/> Back to dashboard
        </Link>
        <div style={{ flex: 1 }}/>
        <BrandMark size={28}/>
      </nav>

      <main style={{ flex: 1, maxWidth: 860, width: '100%', margin: '0 auto', padding: '28px 24px 48px' }}>
        {/* Header card */}
        <Card hero style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ flex: 1, paddingRight: 24 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--fg-primary)', margin: '0 0 8px' }}>{complaint.title}</h2>
              <div style={{ fontSize: 13, color: 'var(--fg-tertiary)' }}>
                Submitted {format(new Date(complaint.createdAt), 'MMM d, yyyy · h:mm a')}
                {complaint.assignedTo && (
                  <> · Assigned to <strong style={{ color: 'var(--fg-primary)', fontWeight: 500 }}>{complaint.assignedTo.name || complaint.assignedTo.email}</strong></>
                )}
              </div>
            </div>
            <StatusPill status={complaint.status}/>
          </div>
          <p style={{ fontSize: 14, color: 'var(--fg-secondary)', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>{complaint.description}</p>
        </Card>

        {/* Discussion */}
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', fontWeight: 600, fontSize: 15, color: 'var(--fg-primary)' }}>
            Discussion
          </div>
          <div style={{ padding: '8px 24px' }}>
            {comments.length === 0 ? (
              <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--fg-quaternary)', fontSize: 13 }}>No comments yet. Start the discussion!</div>
            ) : comments.map((c: any, i: number) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '14px 0', borderBottom: i < comments.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                <Avatar name={c.author?.name || c.author?.email || '?'} role={c.author?.role ?? 'USER'}/>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--fg-primary)' }}>{c.author?.name || c.author?.email || 'You'}</span>
                    {c.author?.role && c.author.role !== 'USER' && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-tertiary)', padding: '1px 6px', background: 'var(--bg-sunken)', borderRadius: 4 }}>{c.author.role}</span>
                    )}
                    <span style={{ fontSize: 12, color: 'var(--fg-tertiary)' }}>{c.createdAt ? format(new Date(c.createdAt), 'MMM d, h:mm a') : 'Just now'}</span>
                  </div>
                  <div style={{ fontSize: 13.5, color: 'var(--fg-secondary)', lineHeight: 1.6 }}>{c.content}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-sunken)' }}>
            <form onSubmit={handlePostComment} style={{ display: 'flex', gap: 10 }}>
              <input
                type="text"
                placeholder="Type your comment…"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                style={{ flex: 1, fontFamily: 'var(--font-sans)', fontSize: 13.5, padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-soft)', background: 'var(--bg-surface)', color: 'var(--fg-primary)', outline: 'none' }}
              />
              <Btn variant="primary" type="submit" disabled={submittingComment || !commentText.trim()}>Send</Btn>
            </form>
          </div>
        </Card>
      </main>
    </div>
  );
}
