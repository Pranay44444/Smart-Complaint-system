'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/axios';
import Link from 'next/link';

const ROLE_HOME: Record<string, string> = {
  ADMIN: '/admin/dashboard',
  STAFF: '/staff/complaints',
  USER: '/dashboard',
  SUPER_ADMIN: '/superadmin/dashboard',
};

export default function ProfilePage() {
  const { user, loading, updateUser } = useAuth();

  const [name, setName] = useState('');
  const [nameSuccess, setNameSuccess] = useState('');
  const [nameError, setNameError] = useState('');
  const [nameSaving, setNameSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    if (user) setName(user.name || '');
  }, [user]);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setNameSaving(true);
    setNameError('');
    setNameSuccess('');
    try {
      const res = await api.patch('/users/me', { name: name.trim() });
      updateUser({ name: res.data.data.name });
      setNameSuccess('Name updated successfully.');
    } catch (err: any) {
      setNameError(err.response?.data?.message || 'Failed to update name.');
    } finally {
      setNameSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');
    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setPwError('New password must be at least 6 characters.');
      return;
    }
    setPwSaving(true);
    try {
      await api.patch('/users/me', { currentPassword, newPassword });
      setPwSuccess('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPwError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setPwSaving(false);
    }
  };

  if (loading || !user) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  const backHref = ROLE_HOME[user.role] || '/dashboard';

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={backHref} className="text-sm text-blue-600 hover:text-blue-800">
              &larr; Back
            </Link>
            <span className="text-xl font-bold text-gray-900">Profile Settings</span>
          </div>
          <span className="text-sm text-gray-500">{user.email}</span>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto py-10 px-4 sm:px-6 space-y-6">
        {/* Account info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Info</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p><span className="font-medium text-gray-700">Email:</span> {user.email}</p>
            <p>
              <span className="font-medium text-gray-700">Role:</span>{' '}
              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                user.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                user.role === 'STAFF' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>{user.role}</span>
            </p>
          </div>
        </div>

        {/* Update name */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Update Display Name</h2>
          <form onSubmit={handleUpdateName} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            {nameSuccess && <p className="text-sm text-green-600">{nameSuccess}</p>}
            {nameError && <p className="text-sm text-red-600">{nameError}</p>}
            <button
              type="submit"
              disabled={nameSaving || !name.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {nameSaving ? 'Saving...' : 'Save Name'}
            </button>
          </form>
        </div>

        {/* Change password */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            {pwSuccess && <p className="text-sm text-green-600">{pwSuccess}</p>}
            {pwError && <p className="text-sm text-red-600">{pwError}</p>}
            <button
              type="submit"
              disabled={pwSaving || !currentPassword || !newPassword || !confirmPassword}
              className="px-4 py-2 bg-gray-800 text-white rounded-md text-sm font-medium hover:bg-gray-900 disabled:opacity-50 transition-colors"
            >
              {pwSaving ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
