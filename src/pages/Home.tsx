import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { Globe, MapPin, ShoppingBag, Zap, ShieldCheck, ArrowRight, X } from 'lucide-react';
import api from '../lib/api';

const Home: React.FC = () => {
  const { login } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);
      setIsLoginModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/register', { name, email, password });
      login(res.data.token, res.data.user);
      setIsSignupModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-black text-white px-6">
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://picsum.photos/seed/swap/1920/1080?blur=10"
            alt="Hero Background"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest mb-8"
          >
            <Zap className="w-4 h-4 text-blue-400" />
            The Community Exchange
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tight mb-6 leading-[0.85]"
          >
            SWAP SHOP.<br />COMMUNITY DRIVEN.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto font-medium"
          >
            Exchange skills, share food, and trade items. A collaborative ecosystem where nothing goes to waste.
          </motion.p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <button
              onClick={() => setIsSignupModalOpen(true)}
              className="px-10 py-5 bg-white text-black font-black text-lg rounded-3xl hover:bg-gray-100 transition-all shadow-xl shadow-white/10 active:scale-95 flex items-center gap-3"
            >
              GET STARTED <ArrowRight className="w-6 h-6" />
            </button>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black text-lg rounded-3xl hover:bg-white/20 transition-all active:scale-95"
            >
              LOGIN
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl shadow-black/5 hover:shadow-2xl transition-all group">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-8 group-hover:rotate-12 transition-transform">
            <Globe className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">Relay Board</h3>
          <p className="text-gray-500 font-medium leading-relaxed">
            Pass on unfinished research, durable projects, or urgent community tasks. Ensure continuity through digital handoff contracts.
          </p>
        </div>
        <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl shadow-black/5 hover:shadow-2xl transition-all group">
          <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-8 group-hover:rotate-12 transition-transform">
            <MapPin className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">Proximity Pulse</h3>
          <p className="text-gray-500 font-medium leading-relaxed">
            Share surplus food with neighbors in real-time. Use atomic dibs claiming to reduce waste and build local trust.
          </p>
        </div>
        <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl shadow-black/5 hover:shadow-2xl transition-all group">
          <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-8 group-hover:rotate-12 transition-transform">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">Swap Exchange</h3>
          <p className="text-gray-500 font-medium leading-relaxed">
            Trade items and skills directly. Propose swaps, offer cash, and manage your exchange requests in one clean interface.
          </p>
        </div>
      </section>

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[40px] p-10 shadow-2xl"
            >
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-3xl font-black text-gray-900 mb-8 uppercase tracking-tight">Login</h2>
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all text-sm font-bold"
                    placeholder="alice@example.com"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-2">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all text-sm font-bold"
                    placeholder="••••••••"
                  />
                </div>
                {error && <p className="text-red-500 text-xs font-bold px-2">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-black text-white font-black rounded-3xl hover:bg-gray-800 transition-all shadow-xl shadow-black/20 active:scale-95 disabled:opacity-50"
                >
                  {loading ? 'LOGGING IN...' : 'LOGIN'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Signup Modal */}
      <AnimatePresence>
        {isSignupModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSignupModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[40px] p-10 shadow-2xl"
            >
              <button
                onClick={() => setIsSignupModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-3xl font-black text-gray-900 mb-8 uppercase tracking-tight">Sign Up</h2>
              <form onSubmit={handleSignup} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all text-sm font-bold"
                    placeholder="Alice Cooper"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all text-sm font-bold"
                    placeholder="alice@example.com"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-2">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all text-sm font-bold"
                    placeholder="••••••••"
                  />
                </div>
                {error && <p className="text-red-500 text-xs font-bold px-2">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-black text-white font-black rounded-3xl hover:bg-gray-800 transition-all shadow-xl shadow-black/20 active:scale-95 disabled:opacity-50"
                >
                  {loading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
