import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Zap, MessageSquare, BarChart3, Activity } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const features = [
    {
      icon: MessageSquare,
      title: 'AI Chat Support',
      description: 'Talk to our intelligent wellness assistant anytime',
      path: '/chat'
    },
    {
      icon: Activity,
      title: 'Wellness Tracking',
      description: 'Log your mood and monitor your emotional well-being',
      path: '/wellness'
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Visualize your wellness trends and progress',
      path: '/analytics'
    },
    {
      icon: Zap,
      title: 'Smart Recommendations',
      description: 'Get personalized wellness and productivity tips',
      path: '/wellness'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-indigo-600">MINDMATE AI</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your AI-powered wellness companion for student mental health, emotional balance, and academic success.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/chat')}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Start Chat
            </button>
            <button
              onClick={() => navigate('/wellness')}
              className="border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition"
            >
              Log Mood
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.title}
                onClick={() => navigate(feature.path)}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 text-left transform hover:scale-105"
              >
                <Icon className="w-12 h-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </button>
            );
          })}
        </div>

        {/* Welcome Message */}
        <div className="mt-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Hello, {user?.name}! 👋</h2>
          <p className="text-lg mb-6">
            We're here to support your mental wellness journey. Explore our features and start taking care of yourself today.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;