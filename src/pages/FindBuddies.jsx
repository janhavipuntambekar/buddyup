import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Rocket, Star, Shield, LayoutDashboard, Send, PlusCircle, CheckCircle, Briefcase, Mail, Users, AlertCircle, Zap } from 'lucide-react';
import UserCard from '../components/UserCard';
import { useAuth } from '../context/AuthContext';

const FindBuddies = () => {
  const { getAllUsers, loading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [buddies, setBuddies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterBranch, setFilterBranch] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setBuddies(data);
      } catch (error) {
        console.error('Failed to fetch users', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [getAllUsers]);

  const filteredBuddies = buddies.filter(buddy => {
    const matchesSearch = buddy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (buddy.skills && buddy.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))) ||
      (buddy.branch && buddy.branch.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesBranch = filterBranch === 'All' || buddy.branch === filterBranch;
    
    return matchesSearch && matchesBranch;
  });

  const branches = ['All', ...new Set(buddies.map(b => b.branch).filter(Boolean))];

  return (
    <div>
      {/* Search Header */}
      <section className="container mx-auto py-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto glass shadow-2xl p-2 mb-16 rounded-2xl animate-fade-in relative z-50 overflow-visible border border-white/10"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/10 blur-3xl -z-10 animate-float bg-blue-600/20"></div>
          
          <div className="flex items-center gap-2 relative">
            {/* Search icon */}
            <div className="pl-3 text-gray-400 flex-shrink-0 flex items-center justify-center">
              <Search size={18} />
            </div>

            {/* Input field */}
            <input 
              type="text" 
              placeholder="Search Skills, Names, or Branches..." 
              className="flex-1 bg-transparent border-none text-white outline-none font-black uppercase tracking-widest text-xs px-2 py-3.5"
              style={{ minWidth: 0 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Filter button */}
            <div className="relative z-50 flex-shrink-0">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center space-x-2 px-5 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-all shadow-lg font-black uppercase tracking-widest text-[10px] cursor-pointer flex-shrink-0"
              >
                <Filter size={15} />
                <span>{filterBranch === 'All' ? 'Filter' : filterBranch}</span>
              </button>
              
              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full mt-3 right-0 w-60 p-5 rounded-2xl shadow-2xl"
                    style={{ 
                      zIndex: 99999,
                      background: '#ffffff',
                      border: '1px solid rgba(0, 0, 0, 0.12)',
                      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.12)'
                    }}
                  >
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 px-1 border-b border-white/10 pb-2">Filter by Branch</h4>
                    <div className="space-y-1.5 max-h-60 overflow-y-auto custom-scrollbar">
                      {branches.map(branch => (
                        <button 
                          key={branch}
                          onClick={() => { setFilterBranch(branch); setIsFilterOpen(false); }}
                          className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterBranch === branch ? 'bg-primary-600 text-white shadow-lg' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}
                        >
                          {branch}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Dynamic Empty State / Grid */}
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40">
               <Zap size={48} className="text-primary-400 animate-spin mb-4" />
               <p className="text-gray-500 font-black uppercase tracking-widest">Scanning Campus Network...</p>
            </div>
          ) : filteredBuddies.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-40 glass rounded-3xl border-dashed border-2 border-white/10 shadow-2xl"
            >
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <Users size={48} className="text-gray-500 animate-pulse" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">No <span className="text-primary-400">Buddies</span> Found</h2>
              <p className="text-lg text-gray-500 font-bold italic mb-10 uppercase tracking-widest opacity-60">Try searching for different skills or branches.</p>
            </motion.div>
          ) : (
            <>
              <div className="mb-8 animate-fade-in flex items-center justify-between">
                 <h2 className="text-2xl font-black uppercase tracking-tighter opacity-70">
                    Discovered <span className="text-primary-400">{filteredBuddies.length}</span> active buddies
                 </h2>
                 <span className="px-4 py-1.5 bg-green-500/10 text-green-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20">Live Network</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-32">
                <AnimatePresence mode="popLayout">
                  {filteredBuddies.map((buddy) => (
                    <UserCard key={buddy._id} user={buddy} />
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default FindBuddies;
