import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Globe, MapPin, ShoppingBag, CheckCircle, Clock, ArrowRight, Star, ShieldCheck } from 'lucide-react';
import api from '../lib/api';
import RatingModal from '../components/RatingModal';
import StarRating from '../components/StarRating';
import TrustBadge from '../components/TrustBadge';

interface DashboardData {
  name: string;
  email: string;
  trustScore: number;
  averageRating: number;
  totalRatings: number;
  globalImpact: string;
  localImpact: string;
  myProjects: any[];
  myFoodPosts: any[];
  myDibs: any[];
  mySwapRequests: any[];
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [ratingTarget, setRatingTarget] = useState<{ id: string; name: string } | null>(null);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/dashboard');
      setData(res.data);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleUpdateStatus = async (requestId: string, status: 'accepted' | 'rejected') => {
    try {
      await api.put(`/items/swapStatus/${requestId}`, { status });
      fetchDashboard();
    } catch (err) {
      console.error('Error updating swap status:', err);
    }
  };

  const openRating = (targetId: string, targetName: string) => {
    setRatingTarget({ id: targetId, name: targetName });
    setIsRatingModalOpen(true);
  };

  if (loading) return <div className="min-h-screen bg-[#FAF9F6] p-12 flex items-center justify-center font-bold text-2xl uppercase tracking-widest text-slate-900">Loading Dashboard...</div>;
  if (!data) return <div className="min-h-screen bg-[#FAF9F6] p-12 flex items-center justify-center font-bold text-2xl uppercase tracking-widest text-slate-900">No data found.</div>;

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-20 selection:bg-slate-200 selection:text-slate-900">
      <div className="max-w-7xl mx-auto px-6 pt-16">
        <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-slate-50 text-slate-500 rounded-full text-[9px] font-bold uppercase tracking-widest border border-slate-100 mb-8">
              <LayoutDashboard className="w-3.5 h-3.5" /> System Overview
            </div>
            <h1 className="text-6xl md:text-7xl font-display font-normal tracking-tight text-slate-900 mb-8 leading-none">
              Command <span className="italic">Center</span>
            </h1>
            <p className="text-xl text-slate-500 font-normal leading-relaxed">
              Welcome back, <span className="text-slate-900 font-bold">{data.name}</span>. Your impact is growing.
            </p>
          </div>
          <div className="flex items-center gap-5 bg-white p-4 rounded-[32px] soft-shadow border border-slate-50">
            <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-xl font-display font-normal">
              {data.name[0]}
            </div>
            <div className="pr-8">
              <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1.5">Status</div>
              <div className="text-[10px] font-bold text-green-600 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Active Protocol
              </div>
            </div>
          </div>
        </header>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
          <div className="bg-white rounded-[40px] p-12 soft-shadow border border-slate-50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 blur-[80px] -mr-24 -mt-24 group-hover:bg-slate-100 transition-all duration-700" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-12">
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400">Trust Score</span>
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>
              <div className="flex items-baseline gap-4 mb-6">
                <div className="text-7xl font-display font-normal text-slate-900 tracking-tight leading-none">{data.trustScore}%</div>
                <TrustBadge rating={data.averageRating || 0} size="lg" />
              </div>
              <div className="flex items-center gap-4 mb-8">
                <StarRating rating={data.averageRating || 0} total={data.totalRatings || 0} />
              </div>
              <p className="text-sm text-slate-500 font-normal leading-relaxed max-w-[240px]">Verified community contributor status achieved through consistent value sharing.</p>
            </div>
          </div>
          
          <div className="bg-white rounded-[40px] p-12 soft-shadow border border-slate-50 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-slate-50 blur-[60px] -mr-20 -mt-20 group-hover:bg-slate-100 transition-all" />
            <div className="flex items-center justify-between mb-12">
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400">Global Impact</span>
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 border border-slate-100">
                <Globe className="w-6 h-6" />
              </div>
            </div>
            <div className="text-4xl font-display font-normal text-slate-900 leading-tight tracking-tight mb-6">{data.globalImpact}</div>
            <p className="text-sm text-slate-500 font-normal leading-relaxed">Carbon footprint reduction through systematic community sharing.</p>
          </div>
          
          <div className="bg-white rounded-[40px] p-12 soft-shadow border border-slate-50 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-slate-50 blur-[60px] -mr-20 -mt-20 group-hover:bg-slate-100 transition-all" />
            <div className="flex items-center justify-between mb-12">
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400">Local Impact</span>
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 border border-slate-100">
                <MapPin className="w-6 h-6" />
              </div>
            </div>
            <div className="text-4xl font-display font-normal text-slate-900 leading-tight tracking-tight mb-6">{data.localImpact}</div>
            <p className="text-sm text-slate-500 font-normal leading-relaxed">Direct items and food resources shared within your immediate neighborhood.</p>
          </div>
        </div>

        {/* Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column */}
          <div className="space-y-16">
            <section>
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-display font-normal text-slate-900 tracking-tight flex items-center gap-4">
                  <Globe className="w-6 h-6 text-slate-400" /> Your Projects
                </h2>
                <div className="h-px flex-1 bg-slate-100 mx-8" />
              </div>
              <div className="space-y-6">
                {data.myProjects.length === 0 ? (
                  <div className="bg-white rounded-[32px] p-16 text-center text-slate-400 font-bold uppercase tracking-widest text-[9px] border border-dashed border-slate-200 soft-shadow">No active projects in relay</div>
                ) : (
                  data.myProjects.map((p) => (
                    <div key={p._id} className="bg-white rounded-[32px] p-8 border border-slate-50 flex items-center justify-between group hover:border-slate-200 transition-all soft-shadow">
                      <div>
                        <h4 className="text-lg font-display font-normal text-slate-900 tracking-tight mb-2 group-hover:text-slate-600 transition-colors">{p.title}</h4>
                        <span className="text-[9px] font-bold uppercase tracking-widest px-4 py-1.5 bg-slate-50 text-slate-500 rounded-full border border-slate-100">{p.type}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1.5">Status</div>
                        <div className="text-[9px] font-bold text-green-600 uppercase tracking-widest">Active</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-display font-normal text-slate-900 tracking-tight flex items-center gap-4">
                  <MapPin className="w-6 h-6 text-slate-400" /> Your Food Posts
                </h2>
                <div className="h-px flex-1 bg-slate-100 mx-8" />
              </div>
              <div className="space-y-6">
                {data.myFoodPosts.length === 0 ? (
                  <div className="bg-white rounded-[32px] p-16 text-center text-slate-400 font-bold uppercase tracking-widest text-[9px] border border-dashed border-slate-200 soft-shadow">No active food posts</div>
                ) : (
                  data.myFoodPosts.map((f) => (
                    <div key={f._id} className="bg-white rounded-[32px] p-8 border border-slate-50 flex items-center justify-between group hover:border-slate-200 transition-all soft-shadow">
                      <div>
                        <h4 className="text-lg font-display font-normal text-slate-900 tracking-tight mb-2 group-hover:text-slate-600 transition-colors">{f.title}</h4>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2.5 px-4 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                          <Clock className="w-3.5 h-3.5" /> {new Date(f.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1.5">Claim Status</div>
                        <div className={`text-[9px] font-bold uppercase tracking-widest ${f.claimedBy ? 'text-slate-900' : 'text-green-600'}`}>
                          {f.claimedBy ? 'Neighbor Claimed' : 'Available'}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-16">
            <section>
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-display font-normal text-slate-900 tracking-tight flex items-center gap-4">
                  <CheckCircle className="w-6 h-6 text-slate-400" /> Your Active Dibs
                </h2>
                <div className="h-px flex-1 bg-slate-100 mx-8" />
              </div>
              <div className="space-y-6">
                {data.myDibs.length === 0 ? (
                  <div className="bg-white rounded-[32px] p-16 text-center text-slate-400 font-bold uppercase tracking-widest text-[9px] border border-dashed border-slate-200 soft-shadow">No active dibs</div>
                ) : (
                  data.myDibs.map((d) => (
                    <div key={d._id} className="bg-white rounded-[32px] p-8 border border-slate-50 flex items-center justify-between group hover:border-slate-200 transition-all soft-shadow">
                      <div>
                        <h4 className="text-lg font-display font-normal text-slate-900 tracking-tight mb-2 group-hover:text-slate-600 transition-colors">{d.title}</h4>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">By {d.ownerName}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1.5">Dibs Code</div>
                        <div className="text-xs font-mono font-bold tracking-[0.2em] text-slate-900 bg-slate-50 px-4 py-1.5 rounded-xl border border-slate-100">{d.dibsCode}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-display font-normal text-slate-900 tracking-tight flex items-center gap-4">
                  <ShoppingBag className="w-6 h-6 text-slate-400" /> Swap Requests
                </h2>
                <div className="h-px flex-1 bg-slate-100 mx-8" />
              </div>
              <div className="space-y-6">
                {data.mySwapRequests.length === 0 ? (
                  <div className="bg-white rounded-[32px] p-16 text-center text-slate-400 font-bold uppercase tracking-widest text-[9px] border border-dashed border-slate-200 soft-shadow">No active swap requests</div>
                ) : (
                  data.mySwapRequests.map((s) => (
                    <div key={s._id} className="bg-white rounded-[40px] p-10 border border-slate-50 flex flex-col gap-8 group hover:border-slate-200 transition-all soft-shadow relative overflow-hidden">
                      <div className="flex items-center justify-between relative z-10">
                        <div>
                          <h4 className="text-xl font-display font-normal text-slate-900 tracking-tight mb-4 group-hover:text-slate-600 transition-colors">
                            {s.itemDetails?.title || 'Unknown Item'}
                          </h4>
                          <div className="flex items-center gap-4">
                            <span className={`text-[8px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border ${
                              s.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                              s.status === 'accepted' ? 'bg-green-50 text-green-700 border-green-100' :
                              'bg-red-50 text-red-700 border-red-100'
                            }`}>
                              {s.status}
                            </span>
                            <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400 px-4 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                              {s.requesterId === user?.id ? 'Outgoing Request' : 'Incoming Request'}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1.5">
                            {s.requesterId === user?.id ? 'Target Custodian' : 'Requesting Neighbor'}
                          </div>
                          <div className="text-xs font-bold text-slate-900 uppercase tracking-tight">
                            {s.requesterId === user?.id ? s.ownerName || 'Owner' : s.requesterName || 'Neighbor'}
                          </div>
                        </div>
                      </div>
                      
                      {s.message && (
                        <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-100 relative z-10">
                          <p className="text-xs text-slate-500 italic leading-relaxed">
                            "{s.message}"
                          </p>
                        </div>
                      )}

                      {s.status === 'pending' && s.ownerId === user?.id && (
                        <div className="flex gap-4 pt-4 relative z-10">
                          <button
                            onClick={() => handleUpdateStatus(s._id, 'accepted')}
                            className="flex-1 py-4 bg-slate-900 text-white text-[9px] font-bold uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all active:scale-95"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(s._id, 'rejected')}
                            className="flex-1 py-4 bg-white text-slate-900 border border-slate-200 text-[9px] font-bold uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {s.status === 'accepted' && (
                        <div className="pt-4 relative z-10">
                          <button
                            onClick={() => {
                              const targetId = s.requesterId === user?.id ? s.ownerId : s.requesterId;
                              const targetName = s.requesterId === user?.id ? s.ownerName : s.requesterName;
                              openRating(targetId, targetName || 'Neighbor');
                            }}
                            className="w-full py-4 bg-slate-900 text-white text-[9px] font-bold uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-95"
                          >
                            <Star className="w-4 h-4" /> Rate {s.requesterId === user?.id ? 'Owner' : 'Requester'}
                          </button>
                        </div>
                      )}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 blur-[50px] -mr-16 -mt-16 group-hover:bg-slate-100 transition-all" />
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
      {ratingTarget && (
        <RatingModal
          isOpen={isRatingModalOpen}
          onClose={() => setIsRatingModalOpen(false)}
          targetUserId={ratingTarget.id}
          targetUserName={ratingTarget.name}
          onSuccess={fetchDashboard}
        />
      )}
    </div>
  );
};

export default Dashboard;
