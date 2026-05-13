import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, AlertCircle, Heart } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const Analytics = () => {
  const { token } = useAuthStore();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setDashboard(data.data);
      }
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading analytics...</div>;

  const emotionData = [
    { name: 'Happy', value: 30 },
    { name: 'Sad', value: 15 },
    { name: 'Anxious', value: 25 },
    { name: 'Stressed', value: 20 },
    { name: 'Motivated', value: 10 }
  ];

  const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#6366f1', '#8b5cf6'];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Wellness Analytics</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Wellness Score</p>
              <p className="text-3xl font-bold text-indigo-600">{dashboard?.wellnessScore || 0}</p>
            </div>
            <Heart className="w-12 h-12 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Mood Trend</p>
              <p className="text-2xl font-bold capitalize text-green-600">{dashboard?.emotionTrend || 'stable'}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Burnout Risk</p>
              <p className="text-3xl font-bold text-orange-600">{dashboard?.burnoutRisk || 0}%</p>
            </div>
            <AlertCircle className="w-12 h-12 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Tasks Completed</p>
              <p className="text-3xl font-bold text-blue-600">{dashboard?.taskStats?.completed || 0}</p>
            </div>
            <Activity className="w-12 h-12 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mood Trends Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">7-Day Mood Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboard?.moodLogs || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="moodScore" stroke="#6366f1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Emotion Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Emotion Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={emotionData} cx="50%" cy="50%" labelLine={false} label>
                {emotionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Task Completion */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
        <h2 className="text-xl font-bold mb-4">Task Completion Rate</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={[
            { name: 'Total', tasks: dashboard?.taskStats?.total || 0 },
            { name: 'Completed', tasks: dashboard?.taskStats?.completed || 0 },
            { name: 'Pending', tasks: dashboard?.taskStats?.pending || 0 }
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="tasks" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;