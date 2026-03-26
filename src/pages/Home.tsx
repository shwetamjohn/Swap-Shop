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

  const [signupSuccess, setSignupSuccess] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSignupSuccess('');
    try {
      await api.post('/auth/register', { name, email, password });
      setSignupSuccess('Account created! Please log in.');
      setTimeout(() => {
        setIsSignupModalOpen(false);
        setIsLoginModalOpen(true);
        setSignupSuccess('');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] selection:bg-slate-200 selection:text-slate-900">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&q=80&w=2000"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-10"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F6]/0 via-[#FAF9F6]/50 to-[#FAF9F6]" />
        </div>
        
        <div className="relative z-10 max-w-7xl w-full mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-10 text-slate-500"
          >
            <Zap className="w-3.5 h-3.5" />
            The Community Exchange
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-7xl lg:text-9xl font-display font-normal tracking-tight text-slate-900 mb-8 leading-[1.1]"
          >
            Trade with <br />
            <span className="italic">Intention.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg lg:text-xl text-slate-500 mb-12 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            A minimalist ecosystem for sharing skills, food, and items. <br />
            Built on trust, designed for community.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-6"
          >
            <button
              onClick={() => setIsSignupModalOpen(true)}
              className="px-10 py-4 bg-slate-900 text-white font-bold text-sm rounded-full hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center gap-3 group"
            >
              Get Started 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-10 py-4 bg-white text-slate-900 border border-slate-200 font-bold text-sm rounded-full hover:bg-slate-50 transition-all active:scale-95"
            >
              Login
            </button>
          </motion.div>
        </div>
      </section>

      {/* Marquee */}
      <div className="py-10 bg-white/30 backdrop-blur-sm border-y border-slate-100 overflow-hidden whitespace-nowrap">
        <div className="flex animate-marquee gap-20">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-20 text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">
              <span>Direct Trade</span>
              <span>•</span>
              <span>Zero Waste</span>
              <span>•</span>
              <span>Community Trust</span>
              <span>•</span>
              <span>Local Impact</span>
              <span>•</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-24">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-4">Our Ecosystem</div>
          <h2 className="text-4xl lg:text-6xl font-display font-normal text-slate-900 tracking-tight">Three Pillars of Exchange</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-[40px] p-10 soft-shadow border border-slate-50 hover:border-slate-200 transition-all group">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 mb-8 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-500">
              <Globe className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-display font-normal text-slate-900 mb-4 tracking-tight">Relay Board</h3>
            <p className="text-slate-500 font-normal leading-relaxed text-base">
              Pass on unfinished research, durable projects, or urgent community tasks. Ensure continuity through digital handoff contracts.
            </p>
          </div>
          
          <div className="bg-white rounded-[40px] p-10 soft-shadow border border-slate-50 hover:border-slate-200 transition-all group">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 mb-8 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-500">
              <MapPin className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-display font-normal text-slate-900 mb-4 tracking-tight">Proximity Pulse</h3>
            <p className="text-slate-500 font-normal leading-relaxed text-base">
              Share surplus food with neighbors in real-time. Use atomic dibs claiming to reduce waste and build local trust.
            </p>
          </div>
          
          <div className="bg-white rounded-[40px] p-10 soft-shadow border border-slate-50 hover:border-slate-200 transition-all group">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 mb-8 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-500">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-display font-normal text-slate-900 mb-4 tracking-tight">Swap Exchange</h3>
            <p className="text-slate-500 font-normal leading-relaxed text-base">
              Trade items and skills directly. Propose swaps, offer cash, and manage your exchange requests in one clean interface.
            </p>
          </div>
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
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-[40px] p-12 shadow-2xl border border-slate-100"
            >
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-3xl font-display font-normal text-slate-900 mb-8 tracking-tight">Login</h2>
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2 px-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm font-medium"
                    placeholder="alice@example.com"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2 px-1">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm font-medium"
                    placeholder="••••••••"
                  />
                </div>
                {error && <p className="text-red-500 text-[11px] font-bold px-1">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? 'Logging in...' : 'Login'}
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
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-[40px] p-12 shadow-2xl border border-slate-100"
            >
              <button
                onClick={() => setIsSignupModalOpen(false)}
                className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-3xl font-display font-normal text-slate-900 mb-8 tracking-tight">Sign Up</h2>
              <form onSubmit={handleSignup} className="space-y-6">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2 px-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm font-medium"
                    placeholder="Alice Cooper"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2 px-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm font-medium"
                    placeholder="alice@example.com"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2 px-1">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm font-medium"
                    placeholder="••••••••"
                  />
                </div>
                {error && <p className="text-red-500 text-[11px] font-bold px-1">{error}</p>}
                {signupSuccess && <p className="text-green-500 text-[11px] font-bold px-1">{signupSuccess}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? 'Creating account...' : 'Sign Up'}
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
