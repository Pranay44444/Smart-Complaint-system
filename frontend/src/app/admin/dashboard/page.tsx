'use client';
import { useEffect, useState } from 'react';
import api from '../../../lib/axios';

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/dashboard/summary');
        setSummary(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return <p className="text-gray-500">Loading stats...</p>;
  if (!summary) return <p className="text-red-600">Failed to load dashboard data.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">System Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-500">Total Complaints</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{summary.total}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-500">Open</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{summary.byStatus['OPEN'] || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-500">Resolved</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{summary.byStatus['RESOLVED'] || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-500">Closed</p>
          <p className="text-3xl font-bold text-gray-600 mt-2">{summary.byStatus['CLOSED'] || 0}</p>
        </div>
      </div>
    </div>
  );
}
