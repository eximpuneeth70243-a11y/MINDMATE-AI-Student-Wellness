import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Analytics from './pages/Analytics';
import Wellness from './pages/Wellness';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import { useAuthStore } from './store/authStore';
import { Toaster } from 'react-hot-toast';
import './styles/globals.css';

function App() {
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        {isAuthenticated && <Navbar />}
        
        <Routes>
          <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
          
          {isAuthenticated && (
            <>
              <Route path="/chat" element={<Chat />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/wellness" element={<Wellness />} />
              <Route path="/admin" element={<AdminPanel />} />
            </>
          )}
          
          <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
        </Routes>

        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;