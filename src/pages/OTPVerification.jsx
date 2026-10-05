import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Shield, Phone, Mail, Loader, CheckCircle, AlertCircle, Rocket, ArrowRight, RefreshCw } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const OTPVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sendEmailOTP, sendPhoneOTP, verifyOTP } = useAuth();

  const email = location.state?.email;
  const phone = location.state?.phone;

  const [emailOTP, setEmailOTP] = useState('');
  const [phoneOTP, setPhoneOTP] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email || !phone) {
      navigate('/login');
      return;
    }
    
    // Auto-send OTPs on mount
    const initialSend = async () => {
      try {
        const [emailRes, phoneRes] = await Promise.all([
          sendEmailOTP(email),
          sendPhoneOTP(phone)
        ]);
        setInfo('Verification codes sent to your email and phone.');
        
        // Auto-fill in development environment
        if (emailRes?.devOtp) setEmailOTP(emailRes.devOtp);
        if (phoneRes?.devOtp) setPhoneOTP(phoneRes.devOtp);
        
      } catch (err) {
        setError('Failed to send initial verification codes. Please try manually.');
      }
    };
    
    initialSend();
  }, [email, phone, navigate, sendEmailOTP, sendPhoneOTP]);

  const handleSendOTP = async (type) => {
    setLoading(true);
    setError('');
    setInfo('');
    try {
      let res;
      if (type === 'email') res = await sendEmailOTP(email);
      else res = await sendPhoneOTP(phone);
      
      setInfo(`New ${type} verification code sent!`);
      
      // Auto-fill in development environment
      if (res?.devOtp) {
        if (type === 'email') setEmailOTP(res.devOtp);
        else setPhoneOTP(res.devOtp);
      }
    } catch (err) {
      setError(`Failed to send ${type} OTP. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (val, type) => {
    if (val.length !== 6) return;
    setLoading(true);
    setError('');
    setInfo('');
    try {
      await verifyOTP(type === 'email' ? email : phone, val, type);
      if (type === 'email') setEmailVerified(true);
      else setPhoneVerified(true);
      setInfo(`${type.charAt(0).toUpperCase() + type.slice(1)} verified successfully!`);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen pt-24 pb-40 px-6 bg-background-dark/95 flex items-center justify-center relative overflow-hidden text-center">
      <Navbar />
      
      {/* Background Orbs */}
      <div className="absolute top-40 left-10 w-64 h-64 bg-primary-600/30 blur-[150px] -z-10 rounded-full animate-float"></div>
      <div className="absolute bottom-40 right-10 w-96 h-96 bg-blue-600/20 blur-[150px] -z-10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl glass-card p-12 md:p-16 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-600/10 blur-3xl -z-10 bg-blue-600/20"></div>
        
        <header className="mb-12">
            <div className="w-20 h-20 bg-primary-600/20 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-2xl border border-primary-500/30">
               <Shield size={40} className="text-primary-400" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter tracking-widest leading-tight">Secure <span className="gradient-text">Verification</span></h2>
            <p className="text-gray-400 font-bold italic opacity-70 uppercase tracking-widest text-xs tracking-widest">Enter the 6-digit synchronization codes</p>
        </header>

        {error && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8 p-4 bg-red-600/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center shadow-xl font-bold uppercase text-xs tracking-widest">
               <AlertCircle size={18} className="mr-2" /> {error}
            </motion.div>
        )}
        
        {info && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="mb-8 p-4 bg-green-600/10 border border-green-500/20 text-green-400 rounded-2xl flex items-center shadow-xl font-bold uppercase text-xs tracking-widest">
               <CheckCircle size={18} className="mr-2" /> {info}
            </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <OTPSection 
            title="Email Sync" 
            subtitle={email} 
            icon={Mail} 
            value={emailOTP} 
            setValue={setEmailOTP} 
            isVerified={emailVerified} 
            onVerify={() => handleVerify(emailOTP, 'email')}
            onResend={() => handleSendOTP('email')}
            loading={loading}
          />
          <OTPSection 
            title="Phone Sync" 
            subtitle={phone} 
            icon={Phone} 
            value={phoneOTP} 
            setValue={setPhoneOTP} 
            isVerified={phoneVerified} 
            onVerify={() => handleVerify(phoneOTP, 'phone')}
            onResend={() => handleSendOTP('phone')}
            loading={loading}
          />
        </div>

        <AnimatePresence>
          {emailVerified && phoneVerified && (
            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleComplete}
              className="btn-primary w-full mt-12 py-5 text-lg font-black uppercase tracking-widest flex items-center justify-center shadow-2xl"
            >
              Continue to Dashboard <ArrowRight size={20} className="ml-2" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const OTPSection = ({ title, subtitle, icon: Icon, value, setValue, isVerified, onVerify, onResend, loading }) => (
  <div className={`p-8 rounded-3xl transition-all duration-300 relative overflow-hidden ${isVerified ? 'bg-green-600/10 border border-green-500/30' : 'bg-white/5 border border-white/10'}`}>
    <div className="flex items-center space-x-4 mb-6">
      <div className={`p-3 rounded-xl ${isVerified ? 'bg-green-500 text-white' : 'bg-primary-600/20 text-primary-400'}`}>
        <Icon size={20} />
      </div>
      <div className="text-left">
        <h4 className="text-sm font-black uppercase tracking-widest">{title}</h4>
        <p className="text-[10px] text-gray-500 font-bold truncate w-32">{subtitle}</p>
      </div>
    </div>

    {!isVerified ? (
      <div className="space-y-4">
        <input 
          type="text" 
          placeholder="000 000" 
          maxLength="6"
          className="w-full bg-white/5 border border-white/10 text-white text-center rounded-2xl py-4 font-black text-2xl tracking-[0.5em] focus:ring-2 focus:ring-primary-600 transition-all outline-none"
          value={value}
          onChange={(e) => {
             const val = e.target.value.replace(/\D/g, '');
             setValue(val);
             if (val.length === 6) onVerify();
          }}
        />
        <div className="flex space-x-2">
            <button 
                onClick={onVerify}
                disabled={loading || value.length !== 6}
                className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-black uppercase text-[10px] tracking-widest transition-all disabled:opacity-50"
            >
                Verify
            </button>
            <button 
                onClick={onResend}
                disabled={loading}
                className="p-3 bg-white/5 hover:bg-white/10 text-gray-400 rounded-xl transition-all"
                title="Resend OTP"
            >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
        </div>
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center py-4">
         <CheckCircle size={32} className="text-green-500 mb-2" />
         <span className="text-[10px] text-green-400 font-black uppercase tracking-widest">Verified</span>
      </div>
    )}
  </div>
);

export default OTPVerification;
