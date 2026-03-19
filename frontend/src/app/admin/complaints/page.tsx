'use client';
import { useEffect, useState } from 'react';
import api from '../../../lib/axios';
import Link from 'next/link';
import { format } from 'date-fns';

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    api.get('/complaints').then(res => {
      setComplaints(res.data.data);
      setLoading(false);
    });
  }, []);

  const filtered = filter === 'ALL' ? complaints : complaints.filter(c => c.status === filter);

  if (loading) return <p className="text-gray-500">Loading complaints...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Complaints</h1>
        <select 
          value={filter} 
          onChange={e => setFilter(e.target.value)}
          className="border border-gray-300 rounded-md py-2 pl-3 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          title="Filter complaints by status"
        >
          <option value="ALL">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.map(c => (
              <tr key={c._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.createdBy?.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(c.createdAt), 'MMM d, yyyy')}</td>
                <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{c.status}</span></td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/admin/complaints/${c._id}`} className="text-blue-600 hover:text-blue-900">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
