import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import MainLayout from './components/layout/MainLayout';
import Home from './components/Home';
import SubmitProject from './components/SubmitProject';
import History from './components/History';
import Profile from './components/Profile';
import ContactHelp from './components/ContactHelp';
import AdminDashboard from './components/AdminDashboard';
import { useAuth } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';

// Helper component to route based on role
const DashboardRouter = () => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.roles.includes('ROLE_ADMIN');

  if (isAdmin) {
    return (
      <MainLayout>
        <AdminDashboard />
      </MainLayout>
    );
  }
  return <Navigate to="/dashboard" replace />;
};

// New helper for the /dashboard route
const DashboardHome = () => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.roles.includes('ROLE_ADMIN');

  if (isAdmin) {
    return <AdminDashboard />;
  }
  return <Home />;
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Show loading screen for 2.0s

    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-900 text-white">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'linear-gradient(135deg, rgba(255, 107, 157, 0.1), rgba(192, 111, 255, 0.1))',
              color: '#fff',
              border: '1px solid rgba(255, 107, 157, 0.3)',
              backdropFilter: 'blur(20px)',
            },
            success: {
              iconTheme: {
                primary: '#4FACFE',
                secondary: '#1e293b',
              },
            },
            error: {
              iconTheme: {
                primary: '#FF6B9D',
                secondary: '#1e293b',
              },
            },
          }}
        />
        
        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingScreen key="loading" onComplete={() => setLoading(false)} />
          ) : (
            <Routes key="routes">
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Root route redirects based on role */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardRouter />
                  </ProtectedRoute>
                }
              />

              {/* Submitter Routes wrapped in MainLayout */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <DashboardHome />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/submit"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <SubmitProject />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <History />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Profile />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/contact-help"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ContactHelp />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          )}
        </AnimatePresence>
      </div>
    </AuthProvider>
  );
}

export default App;
