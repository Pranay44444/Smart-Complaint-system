'use client';
import { useEffect, useState } from 'react';
import api from '../../../lib/axios';

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [org, setOrg] = useState<{ name: string; slug: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, orgRes] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/dashboard/org'),
        ]);
        setSummary(summaryRes.data.data);
        setOrg(orgRes.data.data ?? orgRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const joinLink = org ? `${window.location.origin}/join/${org.slug}` : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(joinLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <p className="text-gray-500">Loading stats...</p>;
  if (!summary) return <p className="text-red-600">Failed to load dashboard data.</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">System Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-500">Total</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{summary.total}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-500">Closed</p>
            <p className="text-3xl font-bold text-gray-600 mt-2">{summary.byStatus['CLOSED'] || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-500">Assigned</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{summary.byStatus['ASSIGNED'] || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-500">In Progress</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{summary.byStatus['IN_PROGRESS'] || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-500">Resolved</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{summary.byStatus['RESOLVED'] || 0}</p>
          </div>
        </div>
      </div>

      {org && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-100">
          <p className="text-sm font-medium text-gray-700 mb-1">
            User / Staff Join Link — <span className="text-gray-500">{org.name}</span>
          </p>
          <p className="text-xs text-gray-400 mb-3">Share this link so users can self-register under your organization.</p>
          <div className="flex items-center gap-3">
            <code className="flex-1 bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-800 truncate">
              {joinLink}
            </code>
            <button
              onClick={handleCopy}
              className="shrink-0 px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
