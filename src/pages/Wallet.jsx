import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Clock, CreditCard, Plus, ArrowRight, CheckCircle, Shield, IndianRupee, Loader, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import { walletAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Wallet = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [paying, setPaying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchWallet = useCallback(async () => {
    try {
      const response = await walletAPI.getWalletInfo();
      setBalance(response.data.balance);
      setTransactions(response.data.transactions);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  const handleTopUp = async () => {
    if (!amount || amount <= 0) return;
    setPaying(true);
    
    try {
      const order = await walletAPI.createOrder(amount);
      
      // Simulate Razorpay SDK experience
      setTimeout(async () => {
        const paymentId = `pay_${Math.random().toString(36).substring(7)}`;
        await walletAPI.verifyPayment({ orderId: order.data.id, paymentId });
        setShowSuccess(true);
        setAmount('');
        fetchWallet();
        setPaying(false);
        setTimeout(() => setShowSuccess(false), 3000);
      }, 2000);
      
    } catch (e) {
      console.error(e);
      alert('Payment failed');
      setPaying(false);
    }
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Main Wallet Card */}
        <div className="lg:col-span-2 space-y-10">
           
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="glass-card p-12 relative overflow-hidden group shadow-2xl border-primary-500/20"
           >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 blur-[100px] -z-10 group-hover:bg-primary-500/20 transition-all"></div>
              <div className="flex justify-between items-start mb-12">
                 <div>
                    <h2 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-2 italic">Total Available Balance</h2>
                    <div className="flex items-center">
                       <span className="text-6xl font-black tracking-tighter italic">₹{balance.toLocaleString()}</span>
                       <span className="ml-4 px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-500/20">Secure</span>
                    </div>
                 </div>
                 <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-2xl rotate-6 group-hover:rotate-0 transition-transform">
                    <WalletIcon size={32} className="text-white" />
                 </div>
              </div>

              <div className="flex items-center space-x-4">
                 <div className="flex -space-x-4">
                    {[1,2,3].map(i => <div key={i} className="w-10 h-10 bg-white/5 border-2 border-background-dark rounded-xl flex items-center justify-center font-black text-[10px] text-gray-400">?</div>)}
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 italic">Connected to 3 safe campus accounts</p>
              </div>
           </motion.div>

           {/* Transaction History */}
           <div className="space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="text-xl font-black uppercase tracking-widest italic flex items-center">
                    <Clock size={18} className="mr-3 text-primary-400" /> Past <span className="text-primary-400 ml-2">Transactions</span>
                 </h3>
                 <button className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all">Download Report</button>
              </div>

              <div className="space-y-3">
                 {loading ? (
                    <div className="p-10 text-center opacity-30 font-black italic uppercase tracking-widest">Auditing Ledger...</div>
                 ) : transactions.length > 0 ? (
                    transactions.map(tx => (
                      <div key={tx._id} className="p-6 glass-card border-white/5 flex items-center justify-between group hover:border-white/10 transition-all">
                         <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tx.type === 'deposit' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                               {tx.type === 'deposit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                            </div>
                            <div>
                               <h4 className="text-xs font-black uppercase tracking-tight">{tx.description || tx.type}</h4>
                               <p className="text-[8px] font-black uppercase tracking-widest text-gray-600">{new Date(tx.createdAt).toLocaleString()}</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <span className={`text-sm font-black italic tracking-tight ${tx.type === 'deposit' ? 'text-green-500' : 'text-red-500'}`}>
                               {tx.type === 'deposit' ? '+' : '-'} ₹{tx.amount}
                            </span>
                            <div className="flex items-center justify-end space-x-1 mt-1">
                               <CheckCircle size={8} className={tx.status === 'completed' ? 'text-green-500' : 'text-yellow-500'} />
                               <span className="text-[7px] font-black uppercase tracking-widest text-gray-700">{tx.status}</span>
                            </div>
                         </div>
                      </div>
                    ))
                 ) : (
                    <div className="p-20 glass-card border-dashed border-2 border-white/5 flex flex-col items-center justify-center text-center opacity-30">
                       <Clock size={48} className="mb-4" />
                       <p className="text-xs font-black uppercase tracking-widest">No transaction records found</p>
                    </div>
                 )}
              </div>
           </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-8">
           <div className="glass-card p-10 border-primary-500/20 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-primary-600/5 -z-10 group-hover:bg-primary-500/10 transition-all"></div>
              <h3 className="text-lg font-black uppercase tracking-widest mb-8 flex items-center">
                 <Plus size={18} className="mr-2 text-primary-400" /> Wallet <span className="text-primary-400 ml-2">Reload</span>
              </h3>
              
              <div className="space-y-6">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Input INR Amount</label>
                    <div className="relative">
                       <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400" size={18} />
                       <input 
                          type="number" 
                          placeholder="0.00" 
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-12 pr-6 text-xl font-black italic outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-3">
                    {[500, 1000, 2000, 5000].map(val => (
                       <button key={val} onClick={() => setAmount(val)} className="py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 hover:text-white transition-all">₹{val}</button>
                    ))}
                 </div>

                 <button 
                   onClick={handleTopUp}
                   disabled={paying || !amount}
                   className="w-full py-5 bg-primary-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-primary-500 transition-all flex items-center justify-center space-x-3 disabled:opacity-30 group"
                 >
                    {paying ? <Loader className="animate-spin" /> : (
                       <>
                         <span>Authorize Payment</span>
                         <CreditCard size={16} className="group-hover:rotate-12 transition-transform" />
                       </>
                    )}
                 </button>

                 <div className="flex items-center justify-center space-x-2 py-4 border-t border-white/5 opacity-50">
                    <Shield size={12} className="text-primary-400" />
                    <span className="text-[8px] font-black uppercase tracking-widest italic">Powered by Razorpay Secure 256-bit</span>
                 </div>
              </div>
           </div>

           <div className="glass-card p-8 border-white/5 space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Security Insights</h4>
              <div className="space-y-4">
                 <div className="flex items-start space-x-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5"></div>
                    <p className="text-[9px] font-black uppercase tracking-tight leading-relaxed text-gray-400 italic">All transactions are processed in real-time and audited for campus security compliance.</p>
                 </div>
                 <div className="flex items-start space-x-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5"></div>
                    <p className="text-[9px] font-black uppercase tracking-tight leading-relaxed text-gray-400 italic">Refunds are typically processed within 48 business hours.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <AnimatePresence>
         {showSuccess && (
           <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             exit={{ scale: 0.8, opacity: 0 }}
             className="fixed bottom-10 right-10 bg-green-500 text-white p-6 rounded-3xl shadow-2xl flex items-center space-x-6 z-[200]"
           >
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                 <CheckCircle size={24} />
              </div>
              <div>
                 <h4 className="text-sm font-black uppercase tracking-widest">Deposit Confirmed</h4>
                 <p className="text-[10px] font-bold italic opacity-80 uppercase tracking-tight">Funds added via Razorpay Gateway</p>
              </div>
           </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default Wallet;
