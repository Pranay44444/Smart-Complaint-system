'use client';
import { useEffect, useState } from 'react';
import api from '../../../lib/axios';
import Link from 'next/link';
import { format } from 'date-fns';

export default function StaffComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/complaints').then(res => {
      // Backend automatically filters this to complaints assigned to the logged-in staff member
      setComplaints(res.data.data);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ASSIGNED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-purple-100 text-purple-800';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-50 text-gray-500';
    }
  };

  if (loading) return <p className="text-gray-500 text-center mt-10">Loading assignments...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Assigned Complaints</h1>

      {complaints.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
          You currently have no assigned complaints.
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {complaints.map(c => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.createdBy?.name || c.createdBy?.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(c.updatedAt), 'MMM d, yyyy')}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(c.status)}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/staff/complaints/${c._id}`} className="text-blue-600 hover:text-blue-900">Manage</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
