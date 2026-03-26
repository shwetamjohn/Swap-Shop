import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { io, Socket } from 'socket.io-client';
import { Message, User } from '../types';
import { Send, ArrowLeft, User as UserIcon, ShieldCheck, MoreVertical, Search, Phone, Video } from 'lucide-react';
import { format } from 'date-fns';

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
    <div className="h-[calc(100vh-73px)] bg-[#F8F9FA] flex overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-96 bg-white border-r border-gray-100">
        <div className="p-8 border-b border-gray-50">
          <h2 className="text-2xl font-black tracking-tight text-gray-900 mb-6">MESSAGES</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-black outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {[targetUser, { id: 'user3', name: 'Charlie', avatar: 'https://picsum.photos/seed/charlie/100/100' }].map((user) => (
            <button
              key={user.id}
              className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all ${
                user.id === targetUser.id ? 'bg-black text-white shadow-xl shadow-black/10' : 'hover:bg-gray-50'
              }`}
            >
              <div className="relative">
                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <h4 className="font-bold truncate">{user.name}</h4>
                <p className={`text-xs truncate ${user.id === targetUser.id ? 'text-gray-400' : 'text-gray-500'}`}>
                  Is the camera still available?
                </p>
              </div>
              <div className="text-[10px] font-black opacity-50">12:45</div>
            </button>
          ))}
        </div>
      </aside>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col bg-white relative">
        {/* Chat Header */}
        <header className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Link to="/" className="lg:hidden p-2 hover:bg-gray-50 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </Link>
            <div className="relative">
              <img src={targetUser.avatar} alt={targetUser.name} className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-gray-900 leading-none">{targetUser.name}</h3>
                <ShieldCheck className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-xs text-green-500 font-bold uppercase tracking-widest mt-1">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-3 hover:bg-gray-50 rounded-xl transition-colors text-gray-400 hover:text-black">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-3 hover:bg-gray-50 rounded-xl transition-colors text-gray-400 hover:text-black">
              <Video className="w-5 h-5" />
            </button>
            <button className="p-3 hover:bg-gray-50 rounded-xl transition-colors text-gray-400 hover:text-black">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#FDFDFD]">
          <div className="flex flex-col items-center justify-center py-10">
            <div className="px-4 py-1.5 bg-gray-100 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
              Today
            </div>
            <p className="text-xs text-gray-400 font-medium max-w-xs text-center leading-relaxed">
              Messages are end-to-end encrypted. No one outside of this chat can read them.
            </p>
          </div>

          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] group ${msg.senderId === currentUser.id ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`px-6 py-4 rounded-[24px] text-sm font-medium leading-relaxed shadow-sm ${
                      msg.senderId === currentUser.id
                        ? 'bg-black text-white rounded-tr-none'
                        : 'bg-gray-100 text-gray-900 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className={`text-[10px] font-black text-gray-300 uppercase tracking-widest mt-2 px-2 ${
                    msg.senderId === currentUser.id ? 'text-right' : 'text-left'
                  }`}>
                    {format(new Date(msg.timestamp), 'HH:mm')}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={scrollRef} />
        </div>

        {/* Input */}
        <footer className="p-8 bg-white border-t border-gray-50">
          <form onSubmit={handleSendMessage} className="relative flex items-center gap-4">
            <input
              type="text"
              placeholder="Type your message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 pl-6 pr-20 py-5 bg-gray-50 border-none rounded-[24px] text-sm font-bold focus:ring-2 focus:ring-black transition-all outline-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="absolute right-3 w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center hover:bg-gray-800 transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-xl shadow-black/20"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </footer>
      </main>
    </div>
  );
}
