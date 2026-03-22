'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '../../../../context/AuthContext';
import api from '../../../../lib/axios';
import Link from 'next/link';
import { format } from 'date-fns';

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
      api.get(`/users`)
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
      alert('Complaint assigned successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to assign');
    }
  };

  const handleClose = async () => {
    if (!confirm('Are you sure you want to permanently close this complaint?')) return;
    try {
      const res = await api.patch(`/complaints/${id}/close`);
      setComplaint(res.data.data);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to close');
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmittingComment(true);
    try {
      const res = await api.post(`/complaints/${id}/comments`, { content: commentText });
      setComments([...comments, { ...res.data.data, author: { email: user?.email, role: 'ADMIN', name: 'Admin User' } }]);
      setCommentText('');
    } catch (err) {
      alert('Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ASSIGNED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'IN_PROGRESS': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'RESOLVED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CLOSED': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-50 text-gray-500 border-gray-200';
    }
  };

  if (loading) return <p className="text-gray-500 mt-10 text-center">Loading details...</p>;
  if (!complaint) return <p className="text-red-500 mt-10 text-center">Complaint not found.</p>;

  const staffUsers = users.filter((u: any) => u.role === 'STAFF');

  return (
    <div className="max-w-4xl space-y-6">
      <Link href="/admin/complaints" className="text-sm font-medium text-blue-600 hover:underline">
        &larr; Back to All Complaints
      </Link>

      {/* Complaint Header */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{complaint.title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              By <span className="font-medium">{complaint.createdBy?.email}</span> · {format(new Date(complaint.createdAt), 'MMM d, yyyy h:mm a')}
            </p>
          </div>
          <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(complaint.status)}`}>
            {complaint.status}
          </span>
        </div>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{complaint.description}</p>

        {/* Admin Controls */}
        {complaint.status !== 'CLOSED' && (
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Admin Controls</h3>

            {/* Assignment */}
            <div className="flex items-center space-x-3 flex-wrap gap-y-2">
              <span className="text-sm text-gray-600">
                Assigned to: <span className="font-semibold text-gray-900">{complaint.assignedTo?.email || 'Unassigned'}</span>
              </span>
              <div className="flex items-center space-x-2">
                <select
                  title="Select staff to assign"
                  className="border border-gray-300 rounded-md text-sm py-2 pl-3 pr-8 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedStaff}
                  onChange={e => setSelectedStaff(e.target.value)}
                >
                  <option value="">Select staff member...</option>
                  {staffUsers.map((s: any) => (
                    <option key={s._id} value={s._id}>{s.name} ({s.email})</option>
                  ))}
                </select>
                <button
                  onClick={handleAssign}
                  disabled={!selectedStaff}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-40 transition-colors"
                >
                  Assign
                </button>
              </div>
            </div>

            {/* Close button */}
            <div>
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Close Complaint
              </button>
            </div>
          </div>
        )}

        {/* Closed banner */}
        {complaint.status === 'CLOSED' && (
          <div className="mt-4 bg-gray-100 border border-gray-200 rounded-md p-3 text-sm text-gray-600 font-medium">
            This complaint is closed. No further actions available.
          </div>
        )}
      </div>

      {/* Discussion */}
      <div className="bg-white shadow rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 font-semibold text-gray-900">
          Discussion & Audit Log
        </div>
        <div className="p-6 space-y-6">
          {comments.length === 0 ? (
            <p className="text-gray-400 italic text-sm text-center py-4">No comments yet.</p>
          ) : (
            comments.map((c, i) => (
              <div key={i} className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <span className={`font-medium text-sm ${c.author?.role === 'ADMIN' ? 'text-red-700' : c.author?.role === 'STAFF' ? 'text-blue-700' : 'text-gray-900'}`}>
                    {c.author?.name || c.author?.email || 'Unknown'}
                    {c.author?.role && c.author.role !== 'USER' && <span className="ml-1 text-xs font-normal opacity-70">({c.author.role})</span>}
                  </span>
                  <span className="text-xs text-gray-400">{c.createdAt ? format(new Date(c.createdAt), 'MMM d, h:mm a') : 'Just now'}</span>
                </div>
                <div className={`p-3 rounded-lg text-sm border ${c.author?.role === 'ADMIN' ? 'bg-red-50 border-red-100 text-red-900' : c.author?.role === 'STAFF' ? 'bg-blue-50 border-blue-100 text-blue-900' : 'bg-gray-50 border-gray-200 text-gray-800'}`}>
                  {c.content}
                </div>
              </div>
            ))
          )}
        </div>

        {complaint.status !== 'CLOSED' && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <form onSubmit={handlePostComment} className="flex space-x-3">
              <input
                type="text"
                placeholder="Post an admin update or response..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={submittingComment || !commentText.trim()}
                className="bg-blue-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                Reply
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
