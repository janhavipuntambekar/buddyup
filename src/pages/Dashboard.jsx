import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, Send, Settings, Bell, Star, MoreVertical, Plus, Zap, Shield, Rocket, ClipboardList, Check, X, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, acceptConnectionRequest, rejectConnectionRequest, getAllUsers, fetchCurrentUser } = useAuth();
  const [pendingBuddies, setPendingBuddies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [broadcastData, setBroadcastData] = useState({ title: '', category: 'Study' });

  useEffect(() => {
    const fetchPending = async () => {
      if (user?.pendingRequests?.length > 0) {
        try {
          const allUsers = await getAllUsers();
          const pending = allUsers.filter(u => user.pendingRequests.includes(u._id));
          setPendingBuddies(pending);
        } catch (e) {
          console.error(e);
        }
      } else {
        setPendingBuddies([]);
      }
      setLoading(false);
    };
    fetchPending();
  }, [user, getAllUsers]);

  const handleAccept = async (id) => {
    try {
      await acceptConnectionRequest(id);
      setPendingBuddies(prev => prev.filter(p => p._id !== id));
      if (fetchCurrentUser) await fetchCurrentUser();
    } catch (e) {
      console.error('Accept error:', e);
    }
  };

  const handleDecline = async (id) => {
    try {
      await rejectConnectionRequest(id);
      setPendingBuddies(prev => prev.filter(p => p._id !== id));
      if (fetchCurrentUser) await fetchCurrentUser();
    } catch (e) {
      console.error('Decline error:', e);
    }
  };

  const stats = [
    { label: 'Pending Invitations', value: user?.pendingRequests?.length || 0, icon: UserPlus, color: 'text-yellow-400' },
    { label: 'Active Buddies', value: user?.connections?.length || 0, icon: Users, color: 'text-blue-400' },
    { label: 'Discovery Range', value: 'Campus', icon: Rocket, color: 'text-purple-400' },
    { label: 'Safety Index', value: '100%', icon: Shield, color: 'text-green-400' },
  ];

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row items-center justify-between mb-16 animate-fade-in">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black mb-1 uppercase tracking-tighter">Your <span className="gradient-text tracking-widest">Dashboard</span></h1>
            <p className="text-gray-400 font-bold italic opacity-70 uppercase tracking-widest text-xs tracking-widest">Welcome back, <span className="text-white font-bold">{user?.name || 'Buddy'}</span>!</p>
          </div>
          <div className="flex space-x-4 mt-6 md:mt-0">
             <button onClick={() => setIsModalOpen(true)} className="btn-primary py-3 px-8 shadow-2xl font-black uppercase text-[10px] tracking-widest flex items-center">
                <Plus size={16} className="mr-2" /> Broadcast Need
             </button>
          </div>
        </header>

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
              style={{ zIndex: 999999 }}
            >
               <motion.div 
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="glass-card max-w-lg w-full p-10 border-primary-500/30"
               >
                  <h2 className="text-2xl font-black uppercase tracking-widest mb-2">Create <span className="text-primary-400">Broadcast</span></h2>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest italic mb-8 opacity-60">Notify students in your network about your current need.</p>
                  
                  <div className="space-y-6">
                     <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">What do you need?</label>
                        <input 
                           type="text" 
                           placeholder="e.g. Need help with Quantum Mechanics lab" 
                           className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-bold focus:ring-2 focus:ring-primary-500 outline-none"
                           value={broadcastData.title}
                           onChange={(e) => setBroadcastData({...broadcastData, title: e.target.value})}
                        />
                     </div>
                     <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Category</label>
                        <select 
                           className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-bold focus:ring-2 focus:ring-primary-500 outline-none appearance-none"
                           value={broadcastData.category}
                           onChange={(e) => setBroadcastData({...broadcastData, category: e.target.value})}
                        >
                           <option value="Study">Study Session</option>
                           <option value="Project">Project Collaboration</option>
                           <option value="Sports">Sports / Event</option>
                           <option value="Other">Other</option>
                        </select>
                     </div>
                     
                     <div className="flex space-x-4 pt-4">
                        <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-white/5 border border-white/10 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10">Discard</button>
                        <button onClick={() => { alert('Broadcast sent to ' + (user?.connections?.length || 0) + ' buddies!'); setIsModalOpen(false); }} className="flex-1 py-4 bg-primary-600 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-2xl hover:bg-primary-500">Launch Sync</button>
                     </div>
                  </div>
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, idx) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass p-8 rounded-3xl group hover:border-primary-500/50 transition-all duration-300 relative overflow-hidden shadow-2xl"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-600/5 blur-3xl -z-10 bg-blue-600/10"></div>
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`${stat.color} filter drop-shadow-lg`} size={28} />
              </div>
              <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-1">{stat.value}</h3>
              <p className="text-gray-500 font-extrabold text-[9px] uppercase tracking-widest opacity-60 italic">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
                <h2 className="text-xl font-black uppercase tracking-widest mb-8 opacity-50 flex items-center">
                   <Zap size={18} className="mr-2 text-primary-400" /> Incoming Requests
                </h2>

                {pendingBuddies.length === 0 ? (
                    <div className="glass p-12 rounded-3xl text-center border-dashed border-2 border-white/5 opacity-40">
                       <p className="text-xs font-black uppercase tracking-widest italic">No pending requests at the moment</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence>
                            {pendingBuddies.map((buddy) => (
                                <motion.div 
                                    key={buddy._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="glass-card p-6 flex items-center justify-between group"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-primary-600/20 rounded-xl flex items-center justify-center font-black text-primary-400">
                                            {buddy.name[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-black uppercase text-sm tracking-tight">{buddy.name}</h4>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{buddy.branch} · {buddy.year}</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleAccept(buddy._id)} className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-lg transition-all border border-green-500/20">
                                            <Check size={18} />
                                        </button>
                                        <button onClick={() => handleDecline(buddy._id)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all border border-red-500/20">
                                            <X size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <div className="glass-card p-10 h-fit">
                <h3 className="text-lg font-black uppercase tracking-widest mb-6">Quick Links</h3>
                <div className="space-y-4">
                    <QuickLink icon={Users} label="Search Buddies" href="/find-buddies" />
                    <QuickLink icon={ClipboardList} label="My Connections" href="/profile" />
                    <QuickLink icon={Settings} label="Edit Identity" href="/profile" />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const QuickLink = ({ icon: Icon, label, href }) => (
    <a href={href} className="flex items-center p-4 bg-white/5 hover:bg-primary-600/20 border border-white/5 hover:border-primary-500/30 rounded-2xl transition-all group">
        <Icon size={18} className="text-gray-500 group-hover:text-primary-400 transition-colors mr-4" />
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white">{label}</span>
    </a>
);

export default Dashboard;
