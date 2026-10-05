import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import FindBuddies from './pages/FindBuddies';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OTPVerification from './pages/OTPVerification';
import Payment from './pages/Payment';
import Messages from './pages/Messages';
import BecomeProvider from './pages/BecomeProvider';
import Wallet from './pages/Wallet';
import Layout from './components/Layout';

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
);

const ProtectedRoute = ({ children }) => {
  const { token, user, loading } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center">
       <div className="text-primary-400 font-black animate-pulse uppercase tracking-widest leading-tight">Authenticating Session...</div>
    </div>
  );

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App selection:bg-primary-500 selection:text-white">
          <Layout>
            <AnimatePresence mode="wait">
              <Routes>
              <Route path="/" element={<PageTransition><Home /></PageTransition>} />
              <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
              <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
              <Route path="/otp-verification" element={<PageTransition><OTPVerification /></PageTransition>} />
              
              {/* Protected Routes */}
              <Route path="/find-buddies" element={
                <ProtectedRoute>
                  <PageTransition><FindBuddies /></PageTransition>
                </ProtectedRoute>
              } />

              <Route path="/become-provider" element={
                <ProtectedRoute>
                  <PageTransition><BecomeProvider /></PageTransition>
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <PageTransition><Dashboard /></PageTransition>
                </ProtectedRoute>
              } />

              <Route path="/messages" element={
                <ProtectedRoute>
                  <PageTransition><Messages /></PageTransition>
                </ProtectedRoute>
              } />

              <Route path="/wallet" element={
                <ProtectedRoute>
                  <PageTransition><Wallet /></PageTransition>
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <PageTransition><Profile /></PageTransition>
                </ProtectedRoute>
              } />

              <Route path="/payments" element={
                <ProtectedRoute>
                  <PageTransition><Payment /></PageTransition>
                </ProtectedRoute>
              } />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
          </Layout>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
