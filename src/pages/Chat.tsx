import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { io, Socket } from 'socket.io-client';
import { Message, User } from '../types';
import { Send, ArrowLeft, User as UserIcon, ShieldCheck, MoreVertical, Search, Phone, Video } from 'lucide-react';
import { format } from 'date-fns';
import TrustBadge from '../components/TrustBadge';

export default function Chat() {
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get('user');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mock current user
  const currentUser: User = {
    id: 'user1',
    name: 'Alice',
    email: 'alice@example.com',
    avatar: 'https://picsum.photos/seed/alice/100/100',
    trustScore: 98,
    verified: true,
    role: 'user',
    averageRating: 4.8,
    totalRatings: 12,
    globalImpact: '12.4kg CO2 saved',
    localImpact: '45 items swapped'
  };

  // Mock target user
  const targetUser: User = {
    id: targetUserId || 'user2',
    name: targetUserId === 'user2' ? 'Bob' : 'Charlie',
    email: 'target@example.com',
    avatar: `https://picsum.photos/seed/${targetUserId || 'user2'}/100/100`,
    trustScore: 95,
    verified: true,
    role: 'user',
    averageRating: 4.5,
    totalRatings: 8,
    globalImpact: '8.2kg CO2 saved',
    localImpact: '23 items swapped'
  };

  const roomId = [currentUser.id, targetUser.id].sort().join('-');

  useEffect(() => {
    const newSocket = io(window.location.origin);
    setSocket(newSocket);

    newSocket.emit('join_room', roomId);

    newSocket.on('receive_message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !socket) return;

    const messageData = {
      roomId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: inputText
    };

    socket.emit('send_message', messageData);
    setInputText('');
  };

  return (
    <div className="h-[calc(100vh-73px)] bg-[#FAF9F6] flex overflow-hidden selection:bg-slate-200 selection:text-slate-900">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-[400px] bg-white border-r border-slate-100">
        <div className="p-10 border-b border-slate-50">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-4xl font-display font-normal tracking-tight text-slate-900">Pulse <span className="italic text-slate-400">Chat</span></h2>
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
              <MoreVertical className="w-5 h-5" />
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border border-slate-100 rounded-[24px] text-sm font-medium focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
          {[targetUser, { id: 'user3', name: 'Charlie', avatar: 'https://picsum.photos/seed/charlie/100/100' }].map((user) => (
            <button
              key={user.id}
              className={`w-full p-6 rounded-[32px] flex items-center gap-5 transition-all group relative overflow-hidden ${
                user.id === targetUser.id 
                  ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/10' 
                  : 'hover:bg-slate-50 border border-transparent hover:border-slate-100'
              }`}
            >
              <div className="relative z-10">
                <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-2xl object-cover shadow-lg" referrerPolicy="no-referrer" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full" />
              </div>
              <div className="text-left flex-1 min-w-0 relative z-10">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest truncate">{user.name}</h4>
                    <TrustBadge rating={(user as any).averageRating || 0} showLabel={false} className="py-0 px-1.5" />
                  </div>
                  <span className={`text-[8px] font-bold uppercase tracking-widest ${user.id === targetUser.id ? 'text-slate-500' : 'text-slate-300'}`}>12:45</span>
                </div>
                <p className={`text-xs truncate font-normal leading-relaxed ${user.id === targetUser.id ? 'text-slate-400' : 'text-slate-500'}`}>
                  Is the camera still available?
                </p>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col bg-white relative">
        {/* Chat Header */}
        <header className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-xl sticky top-0 z-20">
          <div className="flex items-center gap-8">
            <Link to="/" className="lg:hidden p-3 hover:bg-slate-50 rounded-2xl transition-colors">
              <ArrowLeft className="w-6 h-6 text-slate-500" />
            </Link>
            <div className="relative group">
              <img src={targetUser.avatar} alt={targetUser.name} className="w-16 h-16 rounded-2xl object-cover soft-shadow group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h3 className="text-2xl font-display font-normal text-slate-900 tracking-tight">{targetUser.name}</h3>
                <TrustBadge rating={targetUser.averageRating} showLabel={false} className="py-0 px-2" />
                <div className="w-5 h-5 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <p className="text-[9px] text-green-600 font-bold uppercase tracking-widest">Active Now</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-12 h-12 flex items-center justify-center hover:bg-slate-50 rounded-2xl transition-all text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-100">
              <Phone className="w-5 h-5" />
            </button>
            <button className="w-12 h-12 flex items-center justify-center hover:bg-slate-50 rounded-2xl transition-all text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-100">
              <Video className="w-5 h-5" />
            </button>
            <button className="w-12 h-12 flex items-center justify-center hover:bg-slate-50 rounded-2xl transition-all text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-100">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-12 space-y-10 bg-[#FDFDFD] no-scrollbar">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="px-6 py-2 bg-slate-50 border border-slate-100 rounded-full text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-8">
              Session Initialized • Today
            </div>
            <p className="text-sm text-slate-400 font-normal max-w-sm text-center leading-relaxed italic">
              This secure channel is end-to-end encrypted. Your privacy is protected by the SwapShop continuity protocol.
            </p>
          </div>

          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] group flex flex-col ${msg.senderId === currentUser.id ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`px-8 py-5 rounded-[32px] text-sm font-normal leading-relaxed soft-shadow relative overflow-hidden ${
                      msg.senderId === currentUser.id
                        ? 'bg-slate-900 text-white rounded-tr-none'
                        : 'bg-white border border-slate-100 text-slate-900 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className={`text-[8px] font-bold text-slate-300 uppercase tracking-widest mt-4 px-4 ${
                    msg.senderId === currentUser.id ? 'text-right' : 'text-left'
                  }`}>
                    {format(new Date(msg.timestamp), 'HH:mm')} • Sent
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={scrollRef} />
        </div>

        {/* Input */}
        <footer className="p-10 bg-white border-t border-slate-50">
          <form onSubmit={handleSendMessage} className="relative flex items-center gap-6 max-w-4xl mx-auto w-full">
            <div className="flex-1 relative group">
              <input
                type="text"
                placeholder="Type your message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full pl-8 pr-24 py-6 bg-slate-50 border border-slate-100 rounded-[32px] text-sm font-medium focus:ring-2 focus:ring-slate-900 transition-all outline-none group-hover:bg-slate-100 focus:bg-white"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="w-14 h-14 bg-slate-900 text-white rounded-[24px] flex items-center justify-center hover:bg-slate-800 transition-all disabled:opacity-20 disabled:cursor-not-allowed soft-shadow active:scale-95 group/send"
                >
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
            </div>
          </form>
        </footer>
      </main>
    </div>
  );
}
