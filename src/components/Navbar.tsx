import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, LayoutDashboard, MapPin, Globe, User as UserIcon, LogOut, Shield } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4 group">
          <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-all duration-500 soft-shadow">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-display font-normal tracking-tight text-slate-900 leading-none">Swap<span className="italic">Shop</span></span>
            {user?.role === 'admin' && (
              <span className="text-[7px] font-bold uppercase tracking-[0.3em] text-slate-400 mt-1">Admin Protocol</span>
            )}
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-12">
          <Link to="/projects" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors">Relay Board</Link>
          <Link to="/food" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors">Proximity Pulse</Link>
          <Link to="/swap" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors">Swap Exchange</Link>
          <Link to="/chat" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors">Pulse Chat</Link>
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-2xl border border-slate-100">
              <Link to="/dashboard" className="p-2.5 hover:bg-white hover:soft-shadow rounded-xl transition-all text-slate-400 hover:text-slate-900 group">
                <LayoutDashboard className="w-4 h-4" />
              </Link>
              <Link to="/profile" className="p-2.5 hover:bg-white hover:soft-shadow rounded-xl transition-all text-slate-400 hover:text-slate-900 group">
                <UserIcon className="w-4 h-4" />
              </Link>
              <div className="w-px h-5 bg-slate-200 mx-1" />
              <button onClick={handleLogout} className="p-2.5 hover:bg-white hover:soft-shadow rounded-xl transition-all text-slate-400 hover:text-red-500">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link to="/" className="px-8 py-3 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-slate-800 transition-all active:scale-95">
              Access Portal
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
