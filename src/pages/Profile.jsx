import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Briefcase, Star, Settings, Shield, Zap, Send, LayoutDashboard, Rocket, Save, X, Phone, GraduationCap, Code, Heart, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    college: '',
    branch: '',
    year: '',
    skills: '',
    interests: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        college: user.college || '',
        branch: user.branch || '',
        year: user.year || '',
        skills: user.skills ? user.skills.join(', ') : '',
        interests: user.interests ? user.interests.join(', ') : '',
      });
    }
  }, [user]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const updatedData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        interests: formData.interests.split(',').map(s => s.trim()).filter(Boolean),
      };
      await updateProfile(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error('Update failed', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div>
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-10 md:p-16 mb-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 blur-[120px] -z-10 bg-blue-600/20"></div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="relative flex-shrink-0">
              <div className="w-28 h-28 md:w-36 md:h-36 bg-gradient-to-br from-primary-400 to-primary-700 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-300">
                <span className="text-white text-4xl md:text-6xl font-black uppercase">{formData.name[0] || user.name[0]}</span>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 md:w-10 md:h-10 bg-green-500 border-4 md:border-6 border-background-dark rounded-full"></div>
              </div>
            </div>
            
            <div className="flex-1 min-w-0 text-center md:text-left w-full">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                {isEditing ? (
                  <input 
                    className="text-3xl md:text-5xl font-black uppercase tracking-tighter bg-white/5 border border-white/10 rounded-xl px-4 py-2 w-full outline-none focus:ring-2 focus:ring-primary-600 transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                ) : (
                  <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter break-words text-white">{user.name}</h1>
                )}
                <div className="flex space-x-2 justify-center md:justify-start mt-4 md:mt-0">
                  {isEditing ? (
                    <>
                      <button onClick={handleUpdate} disabled={loading} className="p-3 bg-green-600/20 text-green-400 hover:bg-green-600 hover:text-white rounded-xl transition-all border border-green-500/30">
                        {loading ? <Zap className="animate-spin" size={20} /> : <Save size={20} />}
                      </button>
                      <button onClick={() => setIsEditing(false)} className="p-3 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-xl transition-all border border-red-500/30">
                        <X size={20} />
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setIsEditing(true)} className="btn-secondary font-black uppercase text-[10px] tracking-widest flex items-center">
                      <Settings size={14} className="mr-2" /> Edit Profile
                    </button>
                  )}
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <textarea 
                    placeholder="Describe yourself..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-gray-300 italic min-h-[100px] outline-none focus:ring-2 focus:ring-primary-600 transition-all"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative group">
                      <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                      <input placeholder="College" className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm" value={formData.college} onChange={(e) => setFormData({ ...formData, college: e.target.value })} />
                    </div>
                    <div className="relative group">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                      <input placeholder="Branch" className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm" value={formData.branch} onChange={(e) => setFormData({ ...formData, branch: e.target.value })} />
                    </div>
                    <div className="relative group">
                      <Star className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                      <input placeholder="Year" className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative group">
                      <Code className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                      <input placeholder="Skills (comma separated)" className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm" value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} />
                    </div>
                    <div className="relative group">
                      <Heart className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                      <input placeholder="Interests (comma separated)" className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm" value={formData.interests} onChange={(e) => setFormData({ ...formData, interests: e.target.value })} />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-lg text-gray-400 max-w-2xl leading-relaxed italic mb-8">
                    "{user.bio || 'This buddy hasn\'t written a bio yet.'}"
                  </p>
                  
                  <div className="flex flex-wrap gap-x-6 gap-y-3 mb-8 text-xs font-black uppercase tracking-widest text-gray-500">
                    <div className="flex items-center"><GraduationCap size={14} className="mr-2 text-primary-400" /> {user.college || 'No College'}</div>
                    <div className="flex items-center"><Briefcase size={14} className="mr-2 text-primary-400" /> {user.branch || 'No Branch'}</div>
                    <div className="flex items-center"><Star size={14} className="mr-2 text-primary-400" /> {user.year || 'No Year'}</div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {user.skills && user.skills.map(skill => (
                      <span key={skill} className="px-4 py-1.5 bg-primary-600/10 border border-primary-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest text-primary-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard icon={Users} label="Connections" value={user.connections?.length || 0} color="text-blue-400" />
            <StatCard icon={Zap} label="Requests Sent" value={user.sentRequests?.length || 0} color="text-yellow-400" />
            <StatCard icon={Shield} label="Safety Rating" value="A+" color="text-green-400" />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="glass p-10 rounded-3xl text-center group transition-all duration-300 shadow-2xl overflow-hidden relative"
  >
    <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary-600/5 blur-3xl -z-10 bg-blue-600/10"></div>
    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-600 group-hover:text-white transition-all">
      <Icon className={color + " group-hover:text-white transition-all"} size={32} />
    </div>
    <h3 className="text-4xl font-black mb-2 uppercase tracking-tighter">{value}</h3>
    <p className="text-gray-500 font-extrabold uppercase text-xs tracking-widest opacity-60 italic">{label}</p>
  </motion.div>
);

export default Profile;
