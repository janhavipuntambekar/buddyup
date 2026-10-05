import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Wallet, Star, LayoutDashboard, PlusCircle, CheckCircle, Shield, Rocket, Send, ArrowRight, DollarSign, Zap, Bell, Check, Loader, Lock, MoreVertical } from 'lucide-react';

const Payment = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const balance = 1250.75; // Mock balance
  const plans = [
    { name: 'Starter', price: 500, credits: 550, popular: false },
    { name: 'Pro', price: 1000, credits: 1200, popular: true },
    { name: 'Premium', price: 2500, credits: 3000, popular: false },
  ];

  const handlePurchase = (plan) => {
    setSelectedPlan(plan);
    setIsProcessing(true);
    setError('');
    
    // Simulate payment gateway (Razorpay style)
    setTimeout(() => {
        setIsProcessing(false);
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 3000);
    }, 2500);
  };

  const [error, setError] = useState('');

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row items-center justify-between mb-16 animate-fade-in text-center md:text-left">
          <div>
            <h1 className="text-4xl md:text-5xl font-black mb-1 uppercase tracking-tighter tracking-widest leading-tight">Campus <span className="gradient-text">Credit Wallet</span></h1>
            <p className="text-gray-400 font-bold italic opacity-70 uppercase tracking-widest text-[10px] tracking-widest">Manage your transactions and Top-up credits for campus tasks</p>
          </div>
          <div className="flex space-x-4 mt-8 md:mt-0">
             <div className="glass p-4 rounded-2xl flex items-center space-x-4 shadow-2xl shadow-primary-600/10 border border-white/10 group hover:border-primary-500/30 transition-all">
                <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-2xl group-hover:rotate-6 transition-all">
                   <Wallet size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase text-white tracking-widest leading-none">₹{balance.toLocaleString()}</h3>
                  <span className="text-[10px] text-gray-500 font-bold italic uppercase tracking-widest opacity-60">Current Credit</span>
                </div>
             </div>
          </div>
        </header>

        {/* Payment Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Top up Plans */}
          <div className="lg:col-span-2 space-y-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
             <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 flex items-center">
                <Zap size={24} className="text-yellow-400 mr-2" /> Top-Up <span className="text-primary-400 ml-2">Credits</span>
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan, idx) => (
                  <PlanCard 
                    key={plan.name} 
                    plan={plan} 
                    delay={idx * 0.1} 
                    onSelect={() => handlePurchase(plan)}
                    isProcessing={isProcessing && selectedPlan?.name === plan.name}
                  />
                ))}
             </div>

             {/* Transaction History */}
             <div className="glass-card p-10 mt-16 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-primary-600/5 blur-3xl -z-10 bg-blue-600/10"></div>
                <div className="flex items-center justify-between mb-12">
                   <h2 className="text-xl font-black uppercase tracking-widest leading-tight">Recent <span className="text-primary-400">Transactions</span></h2>
                   <button className="text-[10px] text-gray-500 hover:text-white transition-all font-black uppercase tracking-widest italic opacity-60">See Full History</button>
                </div>
                <div className="space-y-6">
                    <TransactionItem type="Top-up" amount="+ ₹1000.00" date="2 days ago" status="Success" icon={PlusCircle} />
                    <TransactionItem type="Service Payment (Tutor)" amount="- ₹450.00" date="3 days ago" status="Success" icon={Send} />
                    <TransactionItem type="Top-up" amount="+ ₹500.00" date="1 week ago" status="Success" icon={PlusCircle} />
                </div>
             </div>
          </div>

          {/* Checkout Component */}
          <div className="space-y-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
             <div className="glass-card p-10 border-primary-500/20 shadow-2xl relative overflow-hidden">
                 <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-primary-600/10 blur-[100px] -z-10 bg-blue-600/20"></div>
                 <h2 className="text-xl font-black uppercase tracking-widest leading-tight mb-10 flex items-center">
                    <Shield size={20} className="text-blue-400 mr-2" /> Secure <span className="text-white ml-2">Checkout</span>
                 </h2>
                 
                 <div className="space-y-6 mb-12">
                    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all cursor-pointer shadow-2xl">
                       <div className="flex items-center space-x-4">
                          <CreditCard size={20} className="text-primary-400" />
                          <span className="text-xs font-black uppercase tracking-widest">Visa .... 4242</span>
                       </div>
                       <CheckCircle size={16} className="text-green-500" />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl opacity-60 hover:opacity-100 transition-all cursor-pointer shadow-2xl">
                       <div className="flex items-center space-x-4">
                          <Wallet size={20} className="text-gray-500" />
                          <span className="text-xs font-black uppercase tracking-widest">UPI / Razorpay</span>
                       </div>
                    </div>
                 </div>

                 {isSuccess ? (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-12 text-center">
                       <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/40">
                          <Check size={32} className="text-white" />
                       </div>
                       <h3 className="text-2xl font-black uppercase text-green-400 tracking-tighter mb-2">Success!</h3>
                       <p className="text-xs text-gray-400 font-bold uppercase tracking-widest italic leading-relaxed">Credits added to your wallet successfully. Refreshing balance...</p>
                    </motion.div>
                 ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-gray-500 text-xs font-black uppercase tracking-widest">
                           <span>Subtotal</span>
                           <span>₹0.00</span>
                        </div>
                        <div className="flex items-center justify-between text-white text-lg font-black uppercase tracking-tighter">
                           <span>Total Due</span>
                           <span>₹0.00</span>
                        </div>
                        <p className="text-[10px] text-gray-500 font-bold italic uppercase tracking-widest mb-10 opacity-60 leading-tight">By completing the transaction, you agree to our terms of service.</p>
                        <button className="btn-primary w-full py-5 text-lg font-black uppercase tracking-widest flex items-center justify-center shadow-2xl mt-8">
                           Select a Plan Above
                        </button>
                    </div>
                 )}
                 <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-600">
                    <Lock size={12} />
                    <span>SSL Encrypted Payment</span>
                 </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PlanCard = ({ plan, delay, onSelect, isProcessing }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ scale: 1.05 }}
    className={`p-8 rounded-3xl text-center relative overflow-hidden transition-all duration-300 shadow-2xl ${plan.popular ? 'border-2 border-primary-500 bg-primary-600/10' : 'border border-white/10 glass'}`}
  >
    {plan.popular && (
      <div className="absolute top-4 right-[-30px] rotate-45 bg-primary-600 text-white text-[8px] font-black uppercase tracking-widest px-10 py-1 shadow-2xl">
         Popular
      </div>
    )}
    <h3 className="text-lg font-black uppercase tracking-widest mb-2 leading-none text-gray-300">{plan.name}</h3>
    <div className="mb-6">
       <span className="text-4xl font-black uppercase tracking-tighter transition-all">₹{plan.price}</span>
       <span className="text-xs text-gray-500 font-bold uppercase ml-1 opacity-60">One-time</span>
    </div>
    <div className="bg-white/5 p-4 rounded-2xl mb-8 border border-white/5">
       <h4 className="text-xs font-black uppercase tracking-widest text-primary-400 mb-1 leading-none">{plan.credits} Credits</h4>
       <p className="text-[10px] text-gray-500 font-bold italic leading-none">Instant Activation</p>
    </div>
    <button 
      onClick={onSelect}
      disabled={isProcessing}
      className={`w-full py-4 rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center transition-all ${
        plan.popular ? 'bg-primary-600 text-white hover:bg-primary-500 shadow-2xl shadow-primary-600/30' : 'bg-white/10 text-white hover:bg-white/20'
      }`}
    >
      {isProcessing ? <Loader className="animate-spin" size={18} /> : 'Buy Credits'}
    </button>
  </motion.div>
);

const TransactionItem = ({ type, amount, date, status, icon: Icon }) => (
  <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group shadow-2xl">
     <div className="flex items-center space-x-6">
        <div className="p-3 bg-white/5 rounded-xl group-hover:bg-primary-600 group-hover:text-white transition-all shadow-2xl">
           <Icon size={18} className="text-primary-400 group-hover:text-white transition-all" />
        </div>
        <div>
           <h4 className="text-sm font-black uppercase tracking-widest">{type}</h4>
           <p className="text-[10px] text-gray-500 font-bold italic tracking-widest uppercase opacity-60">{date}</p>
        </div>
     </div>
     <div className="text-right">
        <h4 className={`text-sm font-black uppercase tracking-tighter ${amount.includes('+') ? 'text-green-500' : 'text-red-400'}`}>{amount}</h4>
        <div className="text-[10px] text-green-500 font-black uppercase tracking-widest tracking-tighter mt-1 italic flex items-center justify-end">
           <Check size={10} className="mr-1" /> {status}
        </div>
     </div>
  </div>
);

export default Payment;
