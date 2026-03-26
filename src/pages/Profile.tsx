import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Mail, ShieldCheck, Globe, MapPin, CheckCircle } from 'lucide-react';
import api from '../lib/api';

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

  if (loading) return <div className="min-h-screen bg-[#F8F9FA] p-12 flex items-center justify-center font-black text-2xl uppercase tracking-widest">Loading Profile...</div>;
  if (!profile) return <div className="min-h-screen bg-[#F8F9FA] p-12 flex items-center justify-center font-black text-2xl uppercase tracking-widest">No profile found.</div>;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      <div className="max-w-4xl mx-auto px-6 pt-12">
        <header className="bg-white rounded-[40px] p-12 border border-gray-100 shadow-xl shadow-black/5 mb-12 text-center">
          <div className="w-32 h-32 bg-black rounded-[40px] flex items-center justify-center mx-auto mb-8 text-white shadow-2xl shadow-black/20">
            <UserIcon className="w-16 h-16" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-2 uppercase">{profile.name}</h1>
          <div className="flex items-center justify-center gap-2 text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-8">
            <Mail className="w-4 h-4" /> {profile.email}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="px-6 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Verified Member
            </div>
            <div className="px-6 py-2 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Trust Score: {profile.trustScore}%
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl shadow-black/5">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Global Impact</h3>
            </div>
            <p className="text-gray-500 font-medium leading-relaxed">{profile.globalImpact}</p>
          </div>
          <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl shadow-black/5">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Local Impact</h3>
            </div>
            <p className="text-gray-500 font-medium leading-relaxed">{profile.localImpact}</p>
          </div>
        </div>

        <div className="mt-12 bg-black text-white rounded-[40px] p-12 shadow-2xl shadow-black/20 text-center">
          <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Community Reputation</h3>
          <p className="text-gray-400 font-medium mb-8 max-w-xl mx-auto">
            Your reputation is built on successful swaps, claimed food, and project handoffs. Keep contributing to grow your impact.
          </p>
          <div className="w-full bg-white/10 h-4 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${profile.trustScore}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
