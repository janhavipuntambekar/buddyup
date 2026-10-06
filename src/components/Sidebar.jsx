import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  LayoutDashboard, 
  User, 
  MessageSquare, 
  Wallet, 
  Search, 
  LogOut, 
  Settings, 
  Zap, 
  Home as HomeIcon,
  ShieldCheck,
  Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Find Buddies', icon: Search, path: '/find-buddies' },
    { name: 'Messages', icon: MessageSquare, path: '/messages' },
    { name: 'My Wallet', icon: Wallet, path: '/wallet' },
    { name: 'Professional Profile', icon: User, path: '/profile' },
  ];

  return (
    <div className="hidden lg:flex flex-col w-72 h-screen fixed left-0 top-0 bg-background-dark/50 border-r border-white/5 backdrop-blur-3xl z-[150] p-8">
      {/* Brand */}
      <Link to="/" className="flex items-center space-x-3 group mb-16">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-700 rounded-xl flex items-center justify-center shadow-lg transform rotate-6 group-hover:rotate-0 transition-all duration-300">
          <span className="text-white font-black text-xl italic uppercase">B</span>
        </div>
        <span className="text-2xl font-black tracking-tighter uppercase italic group-hover:text-primary-400 transition-all">
          Buddy<span className="text-primary-400">Up</span>
        </span>
      </Link>

      {/* Profile Summary Slot — click to go to profile */}
      <Link
        to="/profile"
        className="glass-card mb-8 p-4 border-white/5 relative group block"
        style={{
          textDecoration: 'none',
          cursor: 'pointer',
          padding: '14px 16px',
          borderRadius: '16px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxSizing: 'border-box'
        }}
      >
         <div className="flex items-center space-x-3">
            <div 
              className="bg-primary-600/20 text-primary-400 font-black flex items-center justify-center flex-shrink-0"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                fontSize: '16px',
                background: 'rgba(124,58,237,0.2)'
              }}
            >
               {user?.name?.[0] || 'U'}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
               <h4 
                 className="text-xs font-black uppercase tracking-tight text-white" 
                 style={{ 
                   margin: 0, 
                   fontSize: '11px', 
                   fontWeight: 900, 
                   overflow: 'hidden', 
                   textOverflow: 'ellipsis', 
                   whiteSpace: 'nowrap' 
                 }} 
                 title={user?.name}
               >
                 {user?.name || 'User'}
               </h4>
               <p style={{ margin: 0, fontSize: '9px', fontWeight: 800, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', fontStyle: 'italic' }}>View Profile →</p>
            </div>
         </div>
      </Link>

      {/* Navigation */}
      <div className="space-y-3 flex-1">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-700 mb-6 px-4">Main Experience</p>
        
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink 
              key={item.name} 
              to={item.path}
              className={`flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${isActive ? 'bg-primary-600 text-white shadow-2xl' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
            >
              <item.icon size={18} className={`${isActive ? 'text-white' : 'text-gray-500 group-hover:text-primary-400'}`} />
              <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'} transition-transform`}>{item.name}</span>
              {isActive && (
                <motion.div 
                  layoutId="sidebar-pill" 
                  className="ml-auto w-1 h-4 bg-white rounded-full"
                />
              )}
            </NavLink>
          );
        })}

        <div className="pt-10 space-y-3">
           <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-700 mb-6 px-4">Support & More</p>
           <button onClick={() => alert('Security audit passed.')} className="w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-gray-500 hover:text-white hover:bg-white/5 transition-all group">
              <ShieldCheck size={18} className="group-hover:text-primary-400" />
              <span className="text-[10px] font-black uppercase tracking-widest">Trust Guard</span>
           </button>
           <Link to="/" className="w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-gray-500 hover:text-white hover:bg-white/5 transition-all group">
              <HomeIcon size={18} className="group-hover:text-primary-400" />
              <span className="text-[10px] font-black uppercase tracking-widest">Back to Home</span>
           </Link>
        </div>
      </div>

      {/* Logout Footer */}
      <div className="pt-8 border-t border-white/5 mt-auto">
         <button 
           onClick={logout}
           className="w-full flex items-center space-x-4 px-4 py-4 rounded-2xl text-red-500/50 hover:text-red-500 hover:bg-red-500/5 transition-all group"
         >
            <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
               <LogOut size={16} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Destroy Session</span>
         </button>
      </div>
    </div>
  );
};

export default Sidebar;
