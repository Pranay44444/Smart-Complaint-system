'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/axios';
import Link from 'next/link';

interface Organization {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
  adminEmail: string | null;
  totalComplaints: number;
}

export default function SuperAdminDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'SUPER_ADMIN') {
        router.push('/login');
      } else {
        fetchOrganizations();
      }
    }
  }, [user, loading, router]);

  const fetchOrganizations = async () => {
    try {
      const res = await api.get('/superadmin/orgs');
      setOrganizations(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch organizations', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuspend = async (id: string) => {
    if (!confirm('Suspend this organization? Their users will not be able to log in.')) return;
    try {
      await api.patch(`/superadmin/orgs/${id}/suspend`);
      setOrganizations(organizations.map(org => org._id === id ? { ...org, isActive: false } : org));
    } catch (err) {
      console.error('Failed to suspend', err);
    }
  };

  const handleActivate = async (id: string) => {
    if (!confirm('Reactivate this organization?')) return;
    try {
      await api.patch(`/superadmin/orgs/${id}/activate`);
      setOrganizations(organizations.map(org => org._id === id ? { ...org, isActive: true } : org));
    } catch (err) {
      console.error('Failed to activate', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this organization? This cannot be undone.')) return;
    try {
      await api.delete(`/superadmin/orgs/${id}`);
      setOrganizations(organizations.filter(org => org._id !== id));
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  if (loading || isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading portal...</div>;
  }

  const totalOrgs = organizations.length;
  const activeOrgs = organizations.filter(org => org.isActive).length;
  const totalComplaints = organizations.reduce((acc, org) => acc + (org.totalComplaints || 0), 0);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-800 mb-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-white font-bold text-xl tracking-wider">SUPER ADMIN</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 text-sm">{user?.email}</span>
              <button
                onClick={logout}
                className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Organizations Overview</h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500">Total Organizations</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{totalOrgs}</dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500">Total Active Orgs</dt>
              <dd className="mt-1 text-3xl font-semibold text-green-600">{activeOrgs}</dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500">Platform Complaints</dt>
              <dd className="mt-1 text-3xl font-semibold text-blue-600">{totalComplaints}</dd>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Org Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complaints</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {organizations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">No organizations found.</td>
                </tr>
              ) : organizations.map((org) => (
                <tr key={org._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-gray-900">{org.name}</p>
                    <p className="text-xs text-gray-400">/{org.slug}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {org.adminEmail ?? <span className="text-gray-400 italic">No admin yet</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {org.totalComplaints}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      org.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {org.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <Link
                      href={`/superadmin/orgs/${org._id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Manage
                    </Link>
                    {org.isActive ? (
                      <button onClick={() => handleSuspend(org._id)} className="text-orange-600 hover:text-orange-900">
                        Suspend
                      </button>
                    ) : (
                      <button onClick={() => handleActivate(org._id)} className="text-green-600 hover:text-green-900">
                        Activate
                      </button>
                    )}
                    <button onClick={() => handleDelete(org._id)} className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
