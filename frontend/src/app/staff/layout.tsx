'use client';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'STAFF') {
        router.replace('/dashboard');
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'STAFF') {
    return <div className="p-8 text-center text-gray-500">Loading staff tools...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center space-x-8">
              <span className="text-xl font-bold text-gray-900 border-r pr-6 border-gray-300">Staff Portal</span>
              <Link href="/staff/complaints" className="text-sm font-medium text-gray-600 hover:text-gray-900">Assignments</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/profile" className="text-sm text-gray-500 hover:text-gray-700">{user.name || user.email}</Link>
              <button onClick={logout} className="text-sm font-medium text-red-600 hover:text-red-500">Log out</button>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-7xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
