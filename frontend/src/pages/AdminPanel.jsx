import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Users, MessageSquare, TrendingUp, LogOut } from 'lucide-react';

const AdminPanel = () => {
  const { token, logout } = useAuthStore();
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [analyticsRes, usersRes] = await Promise.all([
        fetch('/api/admin/analytics', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const analyticsData = await analyticsRes.json();
      const usersData = await usersRes.json();

      if (analyticsData.success) setAnalytics(analyticsData.data);
      if (usersData.success) setUsers(usersData.data);
    } catch (error) {
      console.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading admin panel...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <Users className="w-12 h-12 text-blue-600 mb-3" />
            <p className="text-gray-500 text-sm">Total Users</p>
            <p className="text-3xl font-bold text-blue-600">{analytics.totalUsers}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <Users className="w-12 h-12 text-green-600 mb-3" />
            <p className="text-gray-500 text-sm">Active Users (7d)</p>
            <p className="text-3xl font-bold text-green-600">{analytics.activeUsers}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <MessageSquare className="w-12 h-12 text-purple-600 mb-3" />
            <p className="text-gray-500 text-sm">Total Chats</p>
            <p className="text-3xl font-bold text-purple-600">{analytics.totalChats}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <TrendingUp className="w-12 h-12 text-orange-600 mb-3" />
            <p className="text-gray-500 text-sm">Engagement Rate</p>
            <p className="text-3xl font-bold text-orange-600">{analytics.engagementRate}%</p>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Registered Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Joined</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Last Login</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'admin'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;