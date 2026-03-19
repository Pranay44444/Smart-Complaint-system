'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '../../../../lib/axios';

export default function AdminComplaintDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [complaint, setComplaint] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStaff, setSelectedStaff] = useState('');
  
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
    });
  }, [id]);

  const handleAssign = async () => {
    if (!selectedStaff) return;
    try {
      const res = await api.patch(`/complaints/${id}/assign`, { staffId: selectedStaff });
      setComplaint(res.data.data);
      alert('Assigned successfully');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to assign');
    }
  };

  const handleClose = async () => {
    if (!confirm('Are you sure you want to close this complaint?')) return;
    try {
      const res = await api.patch(`/complaints/${id}/close`);
      setComplaint(res.data.data);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to close');
    }
  };

  if (loading) return <p className="text-gray-500">Loading details...</p>;

  const staffUsers = users.filter((u: any) => u.role === 'STAFF');

  return (
    <div className="max-w-4xl space-y-6">
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{complaint.title}</h1>
            <p className="text-sm text-gray-500 mt-1">Status: <span className="font-semibold text-gray-800">{complaint.status}</span></p>
          </div>
          <div className="flex space-x-3">
            {complaint.status !== 'CLOSED' && (
              <button onClick={handleClose} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium">
                Force Close
              </button>
            )}
          </div>
        </div>
        
        <p className="text-gray-700 mt-4 whitespace-pre-wrap">{complaint.description}</p>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Assignment & Controls</h3>
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-600">Currently assigned: <span className="font-semibold text-gray-900">{complaint.assignedTo?.email || 'Unassigned'}</span></p>
            <div className="flex items-center space-x-2">
              <select 
                title="Select staff member"
                className="border border-gray-300 rounded text-sm py-1.5 pl-3 pr-8 focus:ring-blue-500 focus:border-blue-500 block"
                value={selectedStaff}
                onChange={e => setSelectedStaff(e.target.value)}
              >
                <option value="">Select Staff</option>
                {staffUsers.map((s: any) => (
                  <option key={s._id} value={s._id}>{s.email}</option>
                ))}
              </select>
              <button 
                onClick={handleAssign}
                disabled={!selectedStaff}
                className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Audit & Discussion Log</h3>
        <div className="space-y-4">
          {comments.map((c: any, i) => (
            <div key={i} className="bg-gray-50 p-4 rounded border border-gray-100">
              <p className="text-xs text-gray-500 font-medium mb-1">{c.author?.email} <span className="text-gray-400 font-normal ml-1">({c.author?.role})</span></p>
              <p className="text-sm text-gray-800">{c.content}</p>
            </div>
          ))}
          {comments.length === 0 && <p className="text-sm text-gray-500 italic">No activity logs exist for this complaint.</p>}
        </div>
      </div>
    </div>
  );
}
