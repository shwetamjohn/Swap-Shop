import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Mail, ShieldCheck, Globe, MapPin, CheckCircle, Star } from 'lucide-react';
import api from '../lib/api';
import TrustBadge from '../components/TrustBadge';
import StarRating from '../components/StarRating';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/profile');
        setProfile(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="min-h-screen bg-[#FAF9F6] p-12 flex items-center justify-center font-bold text-2xl uppercase tracking-widest text-slate-900">Loading Profile...</div>;
  if (!profile) return <div className="min-h-screen bg-[#FAF9F6] p-12 flex items-center justify-center font-bold text-2xl uppercase tracking-widest text-slate-900">No profile found.</div>;

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-20 selection:bg-slate-200 selection:text-slate-900">
      <div className="max-w-5xl mx-auto px-6 pt-16">
        <header className="bg-white rounded-[40px] p-16 soft-shadow border border-slate-50 mb-16 text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-slate-900" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-slate-100/50 blur-[100px] group-hover:bg-slate-200/50 transition-all duration-700" />
          
          <div className="relative z-10">
            <div className="w-40 h-40 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto mb-10 text-slate-400 border border-slate-100 soft-shadow group-hover:scale-105 transition-all duration-700">
              <UserIcon className="w-16 h-16" />
            </div>
            
            <h1 className="text-6xl md:text-7xl font-display font-normal tracking-tight text-slate-900 mb-6 leading-none">
              {profile.name}
            </h1>
            
            <div className="flex flex-col items-center gap-6 mb-10">
              {profile.averageRating !== undefined && (
                <div className="flex flex-col items-center bg-slate-50/50 px-10 py-6 rounded-[32px] border border-slate-100">
                  <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-4">Reputation Tier</div>
                  <TrustBadge rating={profile.averageRating} className="mb-4 scale-110" />
                  <StarRating rating={profile.averageRating} total={profile.totalRatings} />
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-3 text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mb-10 bg-slate-50/50 backdrop-blur-sm inline-flex px-6 py-3 rounded-full border border-slate-100">
              <Mail className="w-3.5 h-3.5" /> {profile.email}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="px-8 py-3 bg-slate-50 text-slate-600 rounded-full text-[9px] font-bold uppercase tracking-widest border border-slate-100 flex items-center gap-3">
                <ShieldCheck className="w-4 h-4" /> Verified Member
              </div>
              <div className="px-8 py-3 bg-green-50 text-green-600 rounded-full text-[9px] font-bold uppercase tracking-widest border border-green-100 flex items-center gap-3">
                <CheckCircle className="w-4 h-4" /> Trust Score: {profile.trustScore}%
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white rounded-[40px] p-12 soft-shadow border border-slate-50 group">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-display font-normal text-slate-900 tracking-tight">Global Impact</h3>
            </div>
            <p className="text-slate-500 font-normal leading-relaxed text-lg">{profile.globalImpact}</p>
          </div>
          
          <div className="bg-white rounded-[40px] p-12 soft-shadow border border-slate-50 group">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-display font-normal text-slate-900 tracking-tight">Local Impact</h3>
            </div>
            <p className="text-slate-500 font-normal leading-relaxed text-lg">{profile.localImpact}</p>
          </div>
        </div>

        <div className="mt-10 bg-white rounded-[40px] p-16 soft-shadow border border-slate-50 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 blur-3xl" />
          <div className="relative z-10">
            <h3 className="text-3xl font-display font-normal text-slate-900 tracking-tight mb-6">Community <span className="italic">Reputation</span></h3>
            <p className="text-slate-500 font-normal text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
              Your reputation is built on successful swaps, claimed food, and project handoffs. Keep contributing to grow your impact.
            </p>
            <div className="max-w-xl mx-auto">
              <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest mb-4 text-slate-400">
                <span>Progress to next tier</span>
                <span>{profile.trustScore}%</span>
              </div>
              <div className="w-full bg-slate-50 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${profile.trustScore}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="h-full bg-slate-900 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
