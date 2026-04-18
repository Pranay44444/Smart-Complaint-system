'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../../context/AuthContext';
import api from '../../../../lib/axios';
import Link from 'next/link';
import { format } from 'date-fns';

interface Member {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Complaint {
  _id: string;
  title: string;
  status: string;
  createdAt: string;
  createdBy?: { name?: string; email?: string };
  assignedTo?: { name?: string; email?: string } | null;
}

interface OrgDetail {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  OPEN: 'bg-yellow-100 text-yellow-800',
  ASSIGNED: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  RESOLVED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-800',
};

const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'bg-red-100 text-red-800',
  STAFF: 'bg-blue-100 text-blue-800',
  USER: 'bg-gray-100 text-gray-800',
};

export default function OrgDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading } = useAuth();
  const router = useRouter();

  const [org, setOrg] = useState<OrgDetail | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'members' | 'complaints'>('members');

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'SUPER_ADMIN') {
        router.push('/login');
        return;
      }
      loadAll();
    }
  }, [user, loading]);

  const loadAll = async () => {
    try {
      const [orgRes, membersRes, complaintsRes] = await Promise.all([
        api.get(`/superadmin/orgs/${id}`),
        api.get(`/superadmin/orgs/${id}/members`),
        api.get(`/superadmin/orgs/${id}/complaints`),
      ]);
      setOrg(orgRes.data.data);
      setMembers(membersRes.data.data);
      setComplaints(complaintsRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (!org) return <div className="p-8 text-center text-red-600">Organization not found.</div>;

  const adminCount = members.filter(m => m.role === 'ADMIN').length;
  const staffCount = members.filter(m => m.role === 'STAFF').length;
  const userCount = members.filter(m => m.role === 'USER').length;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-800 mb-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
          <div className="flex items-center gap-4">
            <Link href="/superadmin/dashboard" className="text-gray-400 hover:text-white text-sm">
              ← Back
            </Link>
            <span className="text-white font-bold text-xl tracking-wider">SUPER ADMIN</span>
          </div>
          <span className="text-gray-300 text-sm">{user?.email}</span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Org Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{org.name}</h1>
            <p className="text-sm text-gray-500 mt-1">/{org.slug}</p>
            <p className="text-xs text-gray-400 mt-1">Created {format(new Date(org.createdAt), 'MMM d, yyyy')}</p>
          </div>
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${org.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {org.isActive ? 'Active' : 'Suspended'}
          </span>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Members', value: members.length, color: 'text-gray-900' },
            { label: 'Admins', value: adminCount, color: 'text-red-600' },
            { label: 'Staff', value: staffCount, color: 'text-blue-600' },
            { label: 'Users', value: userCount, color: 'text-gray-600' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-lg shadow p-4">
              <p className="text-xs text-gray-500">{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {(['members', 'complaints'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab} {tab === 'members' ? `(${members.length})` : `(${complaints.length})`}
                </button>
              ))}
            </nav>
          </div>

          {activeTab === 'members' && (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {members.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">No members yet.</td></tr>
                ) : members.map(m => (
                  <tr key={m._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{m.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{m.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ROLE_COLORS[m.role] ?? 'bg-gray-100 text-gray-800'}`}>
                        {m.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {m.createdAt ? format(new Date(m.createdAt), 'MMM d, yyyy') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'complaints' && (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {complaints.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">No complaints yet.</td></tr>
                ) : complaints.map(c => (
                  <tr key={c._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.createdBy?.name || c.createdBy?.email || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.assignedTo?.name || c.assignedTo?.email || <span className="text-gray-400">Unassigned</span>}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{format(new Date(c.createdAt), 'MMM d, yyyy')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUS_COLORS[c.status] ?? 'bg-gray-100 text-gray-800'}`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
