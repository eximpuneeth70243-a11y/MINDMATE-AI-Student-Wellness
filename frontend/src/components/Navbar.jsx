import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Menu, LogOut, Settings } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition"
          >
            MINDMATE
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => navigate('/')}
              className="text-gray-700 hover:text-indigo-600 transition font-semibold"
            >
              Home
            </button>
            <button
              onClick={() => navigate('/chat')}
              className="text-gray-700 hover:text-indigo-600 transition font-semibold"
            >
              Chat
            </button>
            <button
              onClick={() => navigate('/wellness')}
              className="text-gray-700 hover:text-indigo-600 transition font-semibold"
            >
              Wellness
            </button>
            <button
              onClick={() => navigate('/analytics')}
              className="text-gray-700 hover:text-indigo-600 transition font-semibold"
            >
              Analytics
            </button>
            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="text-gray-700 hover:text-indigo-600 transition font-semibold"
              >
                Admin
              </button>
            )}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-gray-700 font-semibold">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 hover:text-indigo-600"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <button
              onClick={() => {
                navigate('/');
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Home
            </button>
            <button
              onClick={() => {
                navigate('/chat');
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Chat
            </button>
            <button
              onClick={() => {
                navigate('/wellness');
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Wellness
            </button>
            <button
              onClick={() => {
                navigate('/analytics');
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Analytics
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;