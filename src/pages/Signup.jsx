import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Rocket, Loader, AlertCircle, Eye, EyeOff, Search, ChevronDown } from 'lucide-react';
import Navbar from '../components/Navbar';
import GoogleAuthButton from '../components/GoogleAuthButton';
import { useAuth } from '../context/AuthContext';
import { countryCodes } from '../utils/countryCodes';

const Signup = () => {
  const { signup, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const [countryCode, setCountryCode] = useState('+1');
  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
        }

        const fullPhone = `${countryCode}${formData.phone}`;
        const submitData = { ...formData, phone: fullPhone };

        try {
        await signup(submitData);
        navigate('/otp-verification', { state: { email: formData.email, phone: fullPhone } });
        } catch (err) {
        setError(err.response?.data?.message || 'Error occurred during signup');
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-40 px-6 bg-background-dark/95 flex items-center justify-center relative overflow-hidden">
        <Navbar />
        <div className="absolute top-40 left-10 w-64 h-64 bg-primary-600/30 blur-[150px] -z-10 rounded-full animate-float"></div>
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-blue-600/20 blur-[150px] -z-10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl glass-card p-12 md:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-600/10 blur-3xl -z-10 bg-blue-600/20"></div>
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter leading-tight tracking-widest">Join <span className="gradient-text">BuddyUp</span></h2>
                <p className="text-gray-400 font-bold italic opacity-70 mb-6 uppercase tracking-widest text-[10px] tracking-widest">Create your premium campus profile</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-600/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center shadow-xl font-bold uppercase text-[10px] animate-fade-in tracking-widest">
                <AlertCircle size={18} className="mr-2" /> {error}
                </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative w-full flex items-center group">
                    <User className="absolute pointer-events-none text-gray-500 group-focus-within:text-primary-400 transition-colors" size={20} style={{ left: '1.25rem' }} />
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      required 
                      className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-4 focus:ring-2 focus:ring-primary-600 transition-all outline-none font-bold text-sm" 
                      style={{ paddingLeft: '3.5rem', paddingRight: '1.5rem' }}
                      value={formData.name} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    />
                    </div>
                    <div className="relative w-full flex items-center group">
                    <Mail className="absolute pointer-events-none text-gray-500 group-focus-within:text-primary-400 transition-colors" size={20} style={{ left: '1.25rem' }} />
                    <input 
                      type="email" 
                      placeholder="Email (Edu)" 
                      required 
                      className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-4 focus:ring-2 focus:ring-primary-600 transition-all outline-none font-bold text-sm" 
                      style={{ paddingLeft: '3.5rem', paddingRight: '1.5rem' }}
                      value={formData.email} 
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                    />
                    </div>
                </div>
                <div className="flex gap-4">
                    {/* Searchable Country Code Selector */}
                    <div className="w-1/3 relative group">
                        <button
                          type="button"
                          onClick={() => setIsCountryPickerOpen(!isCountryPickerOpen)}
                          className="w-full h-full bg-white/5 border border-white/10 text-white rounded-2xl py-4 px-3 flex items-center justify-between focus:ring-2 focus:ring-primary-600 transition-all outline-none font-bold text-xs cursor-pointer hover:bg-white/10"
                          style={{ minHeight: '54px' }}
                        >
                          <span className="truncate font-bold text-white text-xs">
                            {countryCode} ({countryCodes.find(c => c.code === countryCode)?.country || 'US'})
                          </span>
                          <ChevronDown size={16} className={`text-gray-400 transition-transform ${isCountryPickerOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                          {isCountryPickerOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: 8, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 8, scale: 0.95 }}
                              className="absolute top-full mt-2 left-0 w-72 p-3 rounded-2xl shadow-2xl"
                              style={{
                                zIndex: 99999,
                                background: '#ffffff',
                                border: '1px solid rgba(0, 0, 0, 0.12)',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.15)'
                              }}
                            >
                              <div className="relative mb-2 flex items-center">
                                <Search size={14} className="absolute left-3 text-gray-400 pointer-events-none" />
                                <input
                                  type="text"
                                  placeholder="Search country or code"
                                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-2 pl-9 pr-3 text-xs outline-none focus:border-primary-500/50"
                                  value={countrySearch}
                                  onChange={(e) => setCountrySearch(e.target.value)}
                                  autoFocus
                                />
                              </div>

                              <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-1">
                                {countryCodes
                                  .filter(item => 
                                    item.code.toLowerCase().includes(countrySearch.toLowerCase()) ||
                                    item.country.toLowerCase().includes(countrySearch.toLowerCase())
                                  )
                                  .map((item, index) => (
                                    <button
                                      key={index}
                                      type="button"
                                      onClick={() => {
                                        setCountryCode(item.code);
                                        setIsCountryPickerOpen(false);
                                        setCountrySearch('');
                                      }}
                                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${countryCode === item.code ? 'bg-primary-600 text-white' : 'hover:bg-white/10 text-gray-300'}`}
                                    >
                                      <span className="font-extrabold">{item.country}</span>
                                      <span className="text-primary-300">{item.code}</span>
                                    </button>
                                  ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                    </div>
                    <div className="w-2/3 relative flex items-center group">
                        <Phone className="absolute pointer-events-none text-gray-500 group-focus-within:text-primary-400 transition-colors" size={20} style={{ left: '1.25rem' }} />
                        <input 
                          type="text" 
                          placeholder="Phone Number" 
                          required 
                          className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-4 focus:ring-2 focus:ring-primary-600 transition-all outline-none font-bold text-sm" 
                          style={{ paddingLeft: '3.5rem', paddingRight: '1.5rem' }}
                          value={formData.phone} 
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })} 
                        />
                    </div>
                </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative w-full flex items-center group">
                    <Lock className="absolute pointer-events-none text-gray-500 group-focus-within:text-primary-400 transition-colors" size={20} style={{ left: '1.25rem' }} />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Password" 
                      required 
                      className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-4 focus:ring-2 focus:ring-primary-600 transition-all outline-none font-bold text-sm" 
                      style={{ paddingLeft: '3.5rem', paddingRight: '3.5rem' }}
                      value={formData.password} 
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute text-gray-400 hover:text-white transition-colors p-1.5 flex items-center justify-center cursor-pointer"
                      style={{ right: '1.25rem' }}
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                <div className="relative w-full flex items-center group">
                    <Lock className="absolute pointer-events-none text-gray-500 group-focus-within:text-primary-400 transition-colors" size={20} style={{ left: '1.25rem' }} />
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="Confirm Password" 
                      required 
                      className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-4 focus:ring-2 focus:ring-primary-600 transition-all outline-none font-bold text-sm" 
                      style={{ paddingLeft: '3.5rem', paddingRight: '3.5rem' }}
                      value={formData.confirmPassword} 
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute text-gray-400 hover:text-white transition-colors p-1.5 flex items-center justify-center cursor-pointer"
                      style={{ right: '1.25rem' }}
                      title={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>
            <button disabled={loading} className="btn-primary w-full py-5 text-lg font-black uppercase tracking-widest flex items-center justify-center shadow-2xl relative">
              {loading ? <Loader className="animate-spin text-white" /> : 'Begin Your Journey'}
            </button>

            <div className="flex items-center justify-center space-x-4 my-4 opacity-50">
               <div className="flex-1 h-px bg-white/20"></div>
               <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">OR</span>
               <div className="flex-1 h-px bg-white/20"></div>
            </div>

            <GoogleAuthButton buttonText="Sign up with Google" />

            <div className="text-center mt-8 p-4 glass rounded-xl border-white/10 cursor-pointer hover:bg-white/5 transition-all">
                <p className="text-gray-400 text-xs font-bold uppercase transition-all tracking-widest italic opacity-60">
                   Already have an account? <Link to="/login" className="text-primary-400 hover:text-white underline underline-offset-4 decoration-dashed tracking-widest">Sign In</Link>
                </p>
            </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Signup;
