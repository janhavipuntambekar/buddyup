import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Rocket, Check, ArrowRight, DollarSign, Briefcase, GraduationCap, Code, Heart, Info, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const BecomeProvider = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: '',
    hourlyRate: '',
    skills: user?.skills?.join(', ') || '',
    bio: user?.bio || '',
    authenticConfirm: false
  });

  const handleRegister = async () => {
    if (!formData.authenticConfirm) {
      alert('You must confirm your authenticity as a student buddy!');
      return;
    }
    
    setLoading(true);
    try {
      const updatedData = {
        isProvider: true,
        providerCategory: formData.category,
        hourlyRate: Number(formData.hourlyRate),
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        bio: formData.bio
      };
      await updateProfile(updatedData);
      setStep(3); // Result Step
    } catch (e) {
      console.error(e);
      alert('Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-16 animate-fade-in">
           <div className="inline-flex items-center space-x-2 px-6 py-2 bg-primary-600/10 border border-primary-500/20 rounded-full mb-6">
              <Zap size={14} className="text-primary-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary-300">Monetize Your Skills</span>
           </div>
           <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 leading-none italic">Apply as a <span className="text-primary-400">Provider</span></h1>
           <p className="text-gray-500 font-bold uppercase tracking-widest text-xs italic opacity-60">Complete your professional campus profile</p>
        </header>

        <div className="glass-card p-10 md:p-16 relative overflow-hidden shadow-2xl transition-all duration-300">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 blur-[120px] -z-10 bg-blue-600/10"></div>
           
           <AnimatePresence mode="wait">
             {step === 1 && (
               <motion.div 
                 key="step1"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-10"
               >
                  <div>
                     <h2 className="text-2xl font-black uppercase tracking-widest mb-2">Step 01: <span className="text-primary-400">The Basics</span></h2>
                     <p className="text-[10px] font-black uppercase tracking-widest text-gray-700 italic">Core information & Niche selection</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Service Category</label>
                       <select 
                          className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-primary-500 outline-none transition-all appearance-none"
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                       >
                          <option value="">Select Niche</option>
                          <option value="Academic Support">Academic Support</option>
                          <option value="Tech & Coding">Tech & Coding</option>
                          <option value="Design & Creative">Design & Creative</option>
                          <option value="Course Mentorship">Course Mentorship</option>
                          <option value="Other">Other</option>
                       </select>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Service Fee (₹ per session)</label>
                       <div className="relative">
                          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400" size={18} />
                          <input 
                             type="number" 
                             placeholder="e.g. 500" 
                             className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 pl-12 text-sm font-bold focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                             value={formData.hourlyRate}
                             onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
                          />
                       </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Professional Bio</label>
                     <textarea 
                        placeholder="Explain why someone should choose you as their buddy..." 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm italic font-bold min-h-[150px] focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                     />
                  </div>

                  <button 
                    onClick={() => setStep(2)}
                    disabled={!formData.category || !formData.hourlyRate}
                    className="w-full py-5 btn-primary font-black uppercase tracking-widest text-sm flex items-center justify-center shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                     Review Skills & Verify <ArrowRight className="ml-2" size={18} />
                  </button>
               </motion.div>
             )}

             {step === 2 && (
               <motion.div 
                 key="step2"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-10"
               >
                  <div>
                     <h2 className="text-2xl font-black uppercase tracking-widest mb-2">Step 02: <span className="text-primary-400">Final Verification</span></h2>
                     <p className="text-[10px] font-black uppercase tracking-widest text-gray-700 italic">Authenticity check & Marketplace sync</p>
                  </div>

                  <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Review Your Skills (Comma Separated)</label>
                     <div className="relative group">
                        <Code className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-400 transition-colors" size={18} />
                        <input 
                           type="text" 
                           placeholder="React, Algebra, Figma, Writing..." 
                           className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-12 pr-6 text-sm font-bold focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                           value={formData.skills}
                           onChange={(e) => setFormData({...formData, skills: e.target.value})}
                        />
                     </div>
                  </div>

                  <div 
                    onClick={() => setFormData({...formData, authenticConfirm: !formData.authenticConfirm})}
                    className={`p-8 rounded-3xl border transition-all cursor-pointer flex items-start space-x-6 ${formData.authenticConfirm ? 'border-primary-500 bg-primary-600/10 shadow-2xl' : 'border-white/10 hover:bg-white/5'}`}
                  >
                     <div className={`mt-1 w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${formData.authenticConfirm ? 'bg-primary-600 border-primary-400' : 'border-white/20'}`}>
                        {formData.authenticConfirm && <Check size={14} className="text-white" />}
                     </div>
                     <div className="flex-1">
                        <h4 className="text-xs font-black uppercase tracking-widest mb-2">I am an Authentic Student Buddy</h4>
                        <p className="text-[10px] text-gray-500 font-bold italic leading-relaxed uppercase tracking-tight">I confirm that all provided skills are genuine, and I represent myself honestly within the BuddyUp ecosystem. Any reports of fraud will result in immediate session termination.</p>
                     </div>
                  </div>

                  <div className="flex space-x-4 pt-10">
                     <button onClick={() => setStep(1)} className="flex-1 py-5 bg-white/5 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all">Back</button>
                     <button 
                       onClick={handleRegister} 
                       disabled={loading || !formData.authenticConfirm}
                       className="flex-[2] py-5 bg-primary-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-primary-500 transition-all flex items-center justify-center disabled:opacity-30"
                     >
                        {loading ? <Loader className="animate-spin" /> : 'Activate Provider Profile'}
                     </button>
                  </div>
               </motion.div>
             )}

             {step === 3 && (
               <motion.div 
                 key="step3"
                 initial={{ scale: 0.9, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 className="text-center py-10"
               >
                  <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-green-500/30">
                     <Check size={48} className="text-white" />
                  </div>
                  <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 italic">Provider <span className="text-primary-400">Activated!</span></h2>
                  <p className="max-w-md mx-auto text-gray-400 font-bold italic tracking-widest text-xs uppercase leading-relaxed mb-12">
                     Your profile has been updated. You are now visible to buddies looking for expertise in <strong>{formData.category}</strong>. Start accepting secure connections!
                  </p>
                  <button onClick={() => navigate('/dashboard')} className="btn-primary px-12 py-5 font-black uppercase text-sm tracking-widest shadow-2xl">Return to Dashboard</button>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default BecomeProvider;
