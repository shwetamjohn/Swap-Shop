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
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight leading-none">SwapShop</span>
            {user?.role === 'admin' && (
              <span className="text-[8px] font-black uppercase tracking-widest text-red-600 mt-0.5">Admin Mode</span>
            )}
          </div>
        </Link>

        <div className="flex items-center gap-6">
          {user?.role === 'admin' && (
            <Link to="/admin" className="flex items-center gap-2 text-sm font-black text-red-600 hover:text-red-700 transition-colors">
              <Shield className="w-5 h-5" />
              <span className="hidden sm:inline">Admin Panel</span>
            </Link>
          )}
          <Link to="/projects" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors">
            <Globe className="w-5 h-5" />
            <span className="hidden sm:inline">Relay Board</span>
          </Link>
          <Link to="/food" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors">
            <MapPin className="w-5 h-5" />
            <span className="hidden sm:inline">Proximity Pulse</span>
          </Link>
          <Link to="/swap" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors">
            <ShoppingBag className="w-5 h-5" />
            <span className="hidden sm:inline">Swap Exchange</span>
          </Link>
          
          {user ? (
            <>
              <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors">
                <LayoutDashboard className="w-5 h-5" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors">
                <UserIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Profile</span>
              </Link>
              <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <Link to="/" className="px-6 py-2 bg-black text-white text-sm font-bold rounded-full hover:bg-gray-800 transition-colors">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
