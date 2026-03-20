'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '../../../../context/AuthContext';
import api from '../../../../lib/axios';
import Link from 'next/link';
import { format } from 'date-fns';

export default function StaffComplaintDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { user } = useAuth();
  
  const [complaint, setComplaint] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.get(`/complaints/${id}`),
      api.get(`/complaints/${id}/comments`)
    ]).then(([compRes, commRes]) => {
      setComplaint(compRes.data.data);
      setComments(commRes.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleUpdateStatus = async (status: string) => {
    try {
      const res = await api.patch(`/complaints/${id}/status`, { status });
      setComplaint(res.data.data);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    setSubmittingComment(true);
    try {
      const res = await api.post(`/complaints/${id}/comments`, { content: commentText });
      setComments([...comments, { ...res.data.data, author: user }]);
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

  if (loading) return <p className="text-gray-500 text-center mt-10">Loading details...</p>;
  if (!complaint) return <p className="text-red-500 text-center mt-10">Complaint not found or you lack permission.</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-4">
        <Link href="/staff/complaints" className="text-sm font-medium text-blue-600 hover:underline">
          &larr; Back to Assignments
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{complaint.title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Reported by {complaint.createdBy?.email}
            </p>
          </div>
          <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(complaint.status)}`}>
            {complaint.status}
          </span>
        </div>
        
        <p className="text-gray-700 whitespace-pre-wrap">{complaint.description}</p>
        
        {/* Status Controllers */}
        {(complaint.status === 'ASSIGNED' || complaint.status === 'IN_PROGRESS') && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3 uppercase tracking-wider">Update Status Action</h3>
            <div className="flex space-x-3">
              {complaint.status === 'ASSIGNED' && (
                <button 
                  onClick={() => handleUpdateStatus('IN_PROGRESS')}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm font-medium shadow-sm transition-colors"
                >
                  Mark as In Progress
                </button>
              )}
              {(complaint.status === 'ASSIGNED' || complaint.status === 'IN_PROGRESS') && (
                <button 
                  onClick={() => handleUpdateStatus('RESOLVED')}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium shadow-sm transition-colors"
                >
                  Mark as Resolved
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 font-semibold text-gray-900">
          User Communication Log
        </div>
        
        <div className="p-6 space-y-6">
          {comments.length === 0 ? (
            <p className="text-gray-500 italic text-sm text-center py-2">No comments exist.</p>
          ) : (
            comments.map((c, i) => (
              <div key={i} className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <span className={`font-medium text-sm ${c.author?.role === 'STAFF' ? 'text-blue-700' : 'text-gray-900'}`}>
                    {c.author?.name || c.author?.email || 'You'} {c.author?.role === 'STAFF' && '(Staff)'}
                  </span>
                  <span className="text-xs text-gray-500">{c.createdAt ? format(new Date(c.createdAt), 'MMM d, h:mm a') : 'Just now'}</span>
                </div>
                <div className={`p-3 rounded-lg text-sm border ${c.author?.role === 'STAFF' ? 'bg-blue-50 border-blue-100 text-blue-900' : 'bg-gray-50 border-gray-200 text-gray-800'}`}>
                  {c.content}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <form onSubmit={handlePostComment} className="flex space-x-3">
            <input
              type="text"
              placeholder="Post a public update or response..."
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
      </div>
    </div>
  );
}
