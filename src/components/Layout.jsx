import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const { token, user } = useAuth();
  const location = useLocation();
  const isLoggedIn = !!token && !!user;
  
  // Public pages or pages where sidebar shouldn't show (Home, Login, Signup)
  const isPublicPage = ['/', '/login', '/signup', '/otp-verification'].includes(location.pathname);
  
  if (isPublicPage || !isLoggedIn) {
    return (
      <div className="min-h-screen bg-background-dark/95 selection:bg-primary-500 selection:text-white">
        <Navbar />
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-dark/95 flex selection:bg-primary-500 selection:text-white overflow-hidden">
      {/* Fixed Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 min-h-screen overflow-y-auto w-full transition-all duration-300 custom-scrollbar">
        <div className="p-4 md:p-10 lg:p-20 pt-24 lg:pt-20">
           {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
