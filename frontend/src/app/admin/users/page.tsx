'use client';
import { useEffect, useState } from 'react';
import api from '../../../lib/axios';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api.patch(`/users/${userId}/role`, { role: newRole });
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update role');
    }
  };

  if (loading) return <p className="text-gray-500">Loading users...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">User Management</h1>
      <div className="bg-white shadow overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(u => (
              <tr key={u._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'ADMIN' ? 'bg-red-100 text-red-800' : u.role === 'STAFF' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <select 
                    title="Change user role"
                    className="border border-gray-300 rounded text-sm py-1.5 focus:ring-blue-500 focus:border-blue-500"
                    value={u.role}
                    onChange={e => handleRoleChange(u._id, e.target.value)}
                  >
                    <option value="USER">USER</option>
                    <option value="STAFF">STAFF</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
