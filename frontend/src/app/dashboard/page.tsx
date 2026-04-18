'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

const PAGE_SIZE = 10;

interface Complaint {
  _id: string;
  title: string;
  status: string;
  createdAt: string;
  assignedTo?: { name?: string; email?: string } | null;
}

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'ADMIN') router.replace('/admin/dashboard');
      else if (user.role === 'STAFF') router.replace('/staff/complaints');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    if (!user || user.role !== 'USER') return;
    setFetchLoading(true);
    const params: Record<string, string> = { page: String(page), limit: String(PAGE_SIZE) };
    if (search) params.search = search;
    if (statusFilter) params.status = statusFilter;
    api.get('/complaints', { params })
      .then(res => {
        const payload = res.data.data;
        setComplaints(payload.items);
        setTotal(payload.total);
      })
      .catch(() => setError('Failed to load complaints'))
      .finally(() => setFetchLoading(false));
  }, [user, page, search, statusFilter]);

  const handleStatusFilter = (s: string) => {
    setStatusFilter(s);
    setPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-yellow-100 text-yellow-800';
      case 'ASSIGNED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-purple-100 text-purple-800';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-50 text-gray-500';
    }
  };

  if (loading || !user || user.role !== 'USER') {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">My Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/profile" className="text-sm text-gray-500 hover:text-gray-700">
                {user?.name || user?.email}
              </Link>
              <button
                onClick={logout}
                className="text-sm font-medium text-red-600 hover:text-red-500"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Complaints</h2>
          <Link
            href="/complaints/new"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + New Complaint
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder="Search complaints..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
          <select
            title="Filter by status"
            value={statusFilter}
            onChange={e => handleStatusFilter(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        {fetchLoading ? (
          <p className="text-gray-500">Loading complaints...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : complaints.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
            {search || statusFilter ? 'No complaints match your filters.' : (
              <>You haven&apos;t submitted any complaints yet.{' '}
                <Link href="/complaints/new" className="text-blue-600 font-medium hover:underline">
                  Submit your first one
                </Link>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {complaints.map((complaint) => (
                  <li key={complaint._id}>
                    <Link href={`/complaints/${complaint._id}`} className="block hover:bg-gray-50">
                      <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                        <div className="flex flex-col">
                          <p className="text-sm font-medium text-blue-600 truncate">
                            {complaint.title}
                          </p>
                          <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
                            <span>{format(new Date(complaint.createdAt), 'MMM d, yyyy h:mm a')}</span>
                            {complaint.assignedTo && (
                              <>
                                <span>•</span>
                                <span className="font-medium text-gray-700">Assigned: {complaint.assignedTo.name || complaint.assignedTo.email}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(complaint.status)}`}>
                          {complaint.status}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-500">
                  Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => p - 1)}
                    disabled={page === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm text-gray-700">{page} / {totalPages}</span>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={page === totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
