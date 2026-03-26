import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Globe, MapPin, ShoppingBag, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import api from '../lib/api';

interface DashboardData {
  user: {
    name: string;
    email: string;
    trustScore: number;
    globalImpact: string;
    localImpact: string;
  };
  projects: any[];
  foodPosts: any[];
  dibs: any[];
  swapRequests: any[];
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchDashboard();
  }, []);

  if (loading) return <div className="min-h-screen bg-[#F8F9FA] p-12 flex items-center justify-center font-black text-2xl uppercase tracking-widest">Loading Dashboard...</div>;
  if (!data) return <div className="min-h-screen bg-[#F8F9FA] p-12 flex items-center justify-center font-black text-2xl uppercase tracking-widest">No data found.</div>;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-12">
        <header className="mb-12">
          <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-2 uppercase">Command Center</h1>
          <p className="text-gray-500 font-medium">Welcome back, <span className="text-black font-black">{data.user.name}</span>. Your impact is growing.</p>
        </header>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-black text-white rounded-[40px] p-10 shadow-2xl shadow-black/20">
            <div className="flex items-center justify-between mb-8">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Trust Score</span>
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-blue-400">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
            <div className="text-6xl font-black mb-4">{data.user.trustScore}%</div>
            <p className="text-sm text-gray-400 font-medium leading-relaxed">Verified community contributor status.</p>
          </div>
          <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl shadow-black/5">
            <div className="flex items-center justify-between mb-8">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Global Impact</span>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Globe className="w-6 h-6" />
              </div>
            </div>
            <p className="text-lg font-black text-gray-900 leading-tight uppercase tracking-tight">{data.user.globalImpact}</p>
          </div>
          <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl shadow-black/5">
            <div className="flex items-center justify-between mb-8">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Local Impact</span>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <MapPin className="w-6 h-6" />
              </div>
            </div>
            <p className="text-lg font-black text-gray-900 leading-tight uppercase tracking-tight">{data.user.localImpact}</p>
          </div>
        </div>

        {/* Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Projects & Food */}
          <div className="space-y-12">
            <section>
              <h2 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-2">
                <Globe className="w-5 h-5" /> Your Projects
              </h2>
              <div className="space-y-4">
                {data.projects.length === 0 ? (
                  <div className="bg-white rounded-3xl p-8 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px] border border-dashed border-gray-200">No active projects</div>
                ) : (
                  data.projects.map((p) => (
                    <div key={p._id} className="bg-white rounded-3xl p-6 border border-gray-100 flex items-center justify-between group hover:border-black transition-all">
                      <div>
                        <h4 className="font-black text-gray-900 uppercase tracking-tight mb-1">{p.title}</h4>
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">{p.type}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Status</div>
                        <div className="text-xs font-bold text-gray-900">Active</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-2">
                <MapPin className="w-5 h-5" /> Your Food Posts
              </h2>
              <div className="space-y-4">
                {data.foodPosts.length === 0 ? (
                  <div className="bg-white rounded-3xl p-8 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px] border border-dashed border-gray-200">No active food posts</div>
                ) : (
                  data.foodPosts.map((f) => (
                    <div key={f._id} className="bg-white rounded-3xl p-6 border border-gray-100 flex items-center justify-between group hover:border-black transition-all">
                      <div>
                        <h4 className="font-black text-gray-900 uppercase tracking-tight mb-1">{f.title}</h4>
                        <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {new Date(f.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Claimed By</div>
                        <div className="text-xs font-bold text-gray-900">{f.claimedBy ? 'Neighbor' : 'Available'}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Dibs & Swaps */}
          <div className="space-y-12">
            <section>
              <h2 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> Your Active Dibs
              </h2>
              <div className="space-y-4">
                {data.dibs.length === 0 ? (
                  <div className="bg-white rounded-3xl p-8 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px] border border-dashed border-gray-200">No active dibs</div>
                ) : (
                  data.dibs.map((d) => (
                    <div key={d._id} className="bg-white rounded-3xl p-6 border border-gray-100 flex items-center justify-between group hover:border-black transition-all">
                      <div>
                        <h4 className="font-black text-gray-900 uppercase tracking-tight mb-1">{d.title}</h4>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">By {d.ownerName}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Dibs Code</div>
                        <div className="text-xs font-black tracking-widest text-green-600">{d.dibsCode}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> Swap Requests
              </h2>
              <div className="space-y-4">
                {data.swapRequests.length === 0 ? (
                  <div className="bg-white rounded-3xl p-8 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px] border border-dashed border-gray-200">No active swap requests</div>
                ) : (
                  data.swapRequests.map((s) => (
                    <div key={s._id} className="bg-white rounded-3xl p-6 border border-gray-100 flex items-center justify-between group hover:border-black transition-all">
                      <div>
                        <h4 className="font-black text-gray-900 uppercase tracking-tight mb-1">Swap Request</h4>
                        <span className="text-[10px] font-black uppercase tracking-widest text-purple-600">{s.status}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">From</div>
                        <div className="text-xs font-bold text-gray-900">{s.requesterName || 'Neighbor'}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
