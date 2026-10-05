import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Search, MoreVertical, Phone, Video, MessageSquare, Zap, Clock, CheckCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Messages = () => {
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  
  // Mock chats based on connections
  const chats = [
    { id: 1, name: "Sarah Williams", lastMsg: "Can we sync on the React project?", time: "2m", online: true, branch: "CS" },
    { id: 2, name: "John Doe", lastMsg: "The lab report is ready.", time: "1h", online: false, branch: "Physics" },
    { id: 3, name: "Alex Johnson", lastMsg: "Did you check the new assignment?", time: "3h", online: true, branch: "Maths" },
  ];

  const messages = [
    { id: 1, text: "Hey! Are you free for a quick study session?", sender: 'them', time: "10:00 AM" },
    { id: 2, text: "Yeah, sure! What subject?", sender: 'me', time: "10:05 AM" },
    { id: 3, text: "Quantum Mechanics. I'm stuck on Chapter 4.", sender: 'them', time: "10:06 AM" },
    { id: 4, text: "I can help with that. Meet in the library?", sender: 'me', time: "10:10 AM" },
  ];

  const handleSend = () => {
    if (!message.trim()) return;
    setMessage('');
    alert('Message sent to ' + activeChat.name + ' via campus secure link!');
  };

  return (
    <div className="h-full">
      <div className="max-w-7xl mx-auto h-[calc(100vh-140px)] flex gap-6 pb-10">
        
        {/* Sidebar */}
        <div className="w-full md:w-80 lg:w-96 flex flex-col glass-card border-white/5 p-0 overflow-hidden shadow-2xl">
           <div className="p-6 border-b border-white/5 bg-white/5">
              <h2 className="text-xl font-black uppercase tracking-widest mb-6 flex items-center">
                 <MessageSquare size={18} className="mr-2 text-primary-400" /> My <span className="text-primary-400 ml-2">Chats</span>
              </h2>
              <div className="relative group">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-400 transition-colors" size={16} />
                 <input 
                    type="text" 
                    placeholder="Search Buddies..." 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                 />
              </div>
           </div>

           <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
              {chats.map(chat => (
                <button 
                  key={chat.id}
                  onClick={() => setActiveChat(chat)}
                  className={`w-full flex items-center p-4 rounded-2xl transition-all group ${activeChat?.id === chat.id ? 'bg-primary-600 shadow-2xl scale-[0.98]' : 'hover:bg-white/5'}`}
                >
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black ${activeChat?.id === chat.id ? 'bg-white/20 text-white' : 'bg-primary-600/20 text-primary-400 font-black'}`}>
                       {chat.name[0]}
                    </div>
                    {chat.online && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-background-dark rounded-full"></div>}
                  </div>
                  <div className="ml-4 text-left flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                       <h4 className={`text-xs font-black uppercase tracking-tighter truncate ${activeChat?.id === chat.id ? 'text-white' : 'text-gray-300'}`}>{chat.name}</h4>
                       <span className={`text-[8px] font-black uppercase tracking-widest ${activeChat?.id === chat.id ? 'text-white/60' : 'text-gray-600'}`}>{chat.time}</span>
                    </div>
                    <p className={`text-[10px] font-bold italic truncate ${activeChat?.id === chat.id ? 'text-white/80' : 'text-gray-500 font-extrabold'}`}>{chat.lastMsg}</p>
                  </div>
                </button>
              ))}
           </div>
        </div>

        {/* Chat Window */}
        <div className="hidden md:flex flex-1 flex-col glass-card border-white/5 p-0 overflow-hidden shadow-2xl relative">
           {activeChat ? (
             <>
               {/* Header */}
               <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                  <div className="flex items-center">
                     <div className="w-10 h-10 bg-primary-600/20 rounded-xl flex items-center justify-center font-black text-primary-400">
                        {activeChat.name[0]}
                     </div>
                     <div className="ml-4">
                        <h3 className="text-sm font-black uppercase tracking-tight leading-none mb-1">{activeChat.name}</h3>
                        <div className="flex items-center">
                           <div className={`w-1.5 h-1.5 rounded-full mr-2 ${activeChat.online ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></div>
                           <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">{activeChat.online ? 'Live Now' : 'Last seen 2h ago'}</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center space-x-2">
                     <button onClick={() => alert('Call feature coming soon!')} className="p-2.5 text-gray-400 hover:text-primary-400 hover:bg-white/5 rounded-xl transition-all"><Phone size={18} /></button>
                     <button onClick={() => alert('Video chat encrypted and coming soon!')} className="p-2.5 text-gray-400 hover:text-primary-400 hover:bg-white/5 rounded-xl transition-all"><Video size={18} /></button>
                     <button className="p-2.5 text-gray-400 hover:text-primary-400 hover:bg-white/5 rounded-xl transition-all"><MoreVertical size={18} /></button>
                  </div>
               </div>

               {/* Messages */}
               <div className="flex-1 overflow-y-auto p-10 space-y-6 custom-scrollbar pb-32">
                  <div className="flex justify-center mb-10">
                     <span className="text-[8px] font-black uppercase tracking-widest px-4 py-1.5 bg-white/5 rounded-full text-gray-600 border border-white/5 italic">Secure end-to-end encryption active</span>
                  </div>
                  {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                       <div className={`max-w-[70%] ${msg.sender === 'me' ? 'items-end' : 'items-start'} flex flex-col`}>
                          <div className={`p-5 rounded-3xl text-xs font-bold leading-relaxed shadow-xl ${msg.sender === 'me' ? 'bg-primary-600 text-white rounded-tr-none shadow-primary-600/20' : 'bg-white/5 border border-white/10 text-gray-300 rounded-tl-none'}`}>
                             {msg.text}
                          </div>
                          <div className="mt-2 flex items-center space-x-2 px-1">
                             <span className="text-[8px] font-black uppercase tracking-widest text-gray-600">{msg.time}</span>
                             {msg.sender === 'me' && <CheckCheck size={10} className="text-primary-400" />}
                          </div>
                       </div>
                    </div>
                  ))}
               </div>

               {/* Input */}
               <div className="p-6 border-t border-white/5 absolute bottom-0 left-0 right-0 bg-background-dark/95 backdrop-blur-md">
                  <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative group">
                     <input 
                        type="text" 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message buddy..." 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-6 pr-16 text-xs font-bold italic outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-2xl"
                     />
                     <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-primary-600 text-white rounded-xl shadow-2xl hover:bg-primary-500 transition-all group-hover:rotate-6">
                        <Send size={18} />
                     </button>
                  </form>
               </div>
             </>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-center p-12 select-none">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-12 border-dashed border-2 border-white/10 relative">
                   <Zap size={48} className="text-primary-400/20 group-hover:text-primary-400 transition-all" />
                   <div className="absolute inset-0 bg-primary-600/5 blur-3xl rounded-full"></div>
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 italic">No Active <span className="text-primary-400">Sync</span></h3>
                <p className="max-w-xs text-xs font-bold uppercase tracking-widest leading-relaxed text-gray-600">Select a verified buddy from your list to initiate a secure campus communication and start collaborating.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
