import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './Home';
import Auth from './Auth';
import Profile from './Profile';
import Event from './Event';
import Reg from './Reg';

// Reusable Protected Route Wrapper
function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  return user ? children : <Navigate to="/auth" replace />;
}

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simulate startup loading
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(storedUser);
    const timer = setTimeout(() => setLoading(false), 500); // half-second load
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-medium tracking-wide">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Redirect to /auth if no user */}
      <Route path="/" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />

      {/* Auth route (redirect to / if already logged in) */}
      <Route
        path="/auth"
        element={user ? <Navigate to="/" replace /> : <Auth />}
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/event/:name"
        element={
          <ProtectedRoute>
            <Event />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reg"
        element={
          <ProtectedRoute>
            <Reg />
          </ProtectedRoute>
        }
      />

      {/* Fallback for unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
