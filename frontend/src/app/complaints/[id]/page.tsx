'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/axios';
import Link from 'next/link';
import { format } from 'date-fns';

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
    const fetchData = async () => {
      try {
        const [complaintRes, commentsRes] = await Promise.all([
          api.get(`/complaints/${id}`),
          api.get(`/complaints/${id}/comments`),
        ]);
        setComplaint(complaintRes.data.data);
        setComments(commentsRes.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

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

  if (loading) return <div className="p-8 text-gray-500 text-center mt-10">Loading details...</div>;
  if (error) return <div className="p-8 text-red-600 text-center mt-10">{error}</div>;
  if (!complaint) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
          <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:text-blue-800">
            &larr; Back to Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200 mb-8">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{complaint.title}</h2>
              <p className="text-sm text-gray-500 mt-1">
                Submitted on {format(new Date(complaint.createdAt), 'MMM d, yyyy h:mm a')}
              </p>
            </div>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(complaint.status)}`}>
              {complaint.status}
            </span>
          </div>
          <div className="p-6 text-gray-700 whitespace-pre-wrap leading-relaxed">
            {complaint.description}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 font-semibold text-gray-900">
            Discussion
          </div>
          
          <div className="p-6 space-y-6">
            {comments.length === 0 ? (
              <p className="text-gray-500 italic text-sm text-center py-4">No comments yet. Start the discussion!</p>
            ) : (
              comments.map((c, i) => (
                <div key={i} className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm text-gray-900">{c.author?.name || c.author?.email || 'You'}</span>
                    <span className="text-xs text-gray-500">{c.createdAt ? format(new Date(c.createdAt), 'MMM d, h:mm a') : 'Just now'}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-800 border">
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
                placeholder="Type your comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={submittingComment || !commentText.trim()}
                className="bg-blue-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
