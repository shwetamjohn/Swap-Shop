import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Item } from '../types';
import { ArrowLeft, MessageSquare, Share2, Heart, ShieldCheck, Clock, User, CheckCircle, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRequests, setUserRequests] = useState<any[]>([]);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [swapMessage, setSwapMessage] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [itemRes, requestsRes] = await Promise.all([
        api.get(`/items/items/${id}`),
        user ? api.get('/items/swapRequests') : Promise.resolve({ data: [] })
      ]);
      setItem(itemRes.data);
      setUserRequests(requestsRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, user]);

  const handleSwapRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;
    try {
      await api.post('/items/swapRequest', {
        itemId: item.id || (item as any)._id,
        ownerId: item.ownerId,
        message: swapMessage,
      });
      setIsSwapModalOpen(false);
      setSwapMessage('');
      fetchData();
      alert('Swap request sent successfully!');
    } catch (err) {
      console.error('Error sending swap request:', err);
    }
  };

  const hasRequested = () => {
    if (!item) return false;
    const itemId = item.id || (item as any)._id;
    return userRequests.some(r => r.itemId?._id === itemId || r.itemId === itemId);
  };

  const getRequestStatus = () => {
    if (!item) return null;
    const itemId = item.id || (item as any)._id;
    const request = userRequests.find(r => r.itemId?._id === itemId || r.itemId === itemId);
    return request ? request.status : null;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!item) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
        <ShieldCheck className="w-10 h-10 text-gray-300" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Item not found</h2>
        <p className="text-gray-500 max-w-xs mx-auto">
          The item you're looking for might have been removed or swapped.
        </p>
      </div>
      <Link to="/" className="px-8 py-3 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-colors">
        Back to Home
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-20 selection:bg-slate-200 selection:text-slate-900">
      <div className="max-w-7xl mx-auto px-6 pt-16">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors mb-16 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Exchange
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative aspect-square rounded-[40px] overflow-hidden bg-white soft-shadow border border-slate-50 group"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-8 right-8 flex flex-col gap-4">
              <button className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center soft-shadow border border-slate-50 hover:bg-white transition-all active:scale-90">
                <Heart className="w-5 h-5 text-slate-900" />
              </button>
              <button className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center soft-shadow border border-slate-50 hover:bg-white transition-all active:scale-90">
                <Share2 className="w-5 h-5 text-slate-900" />
              </button>
            </div>
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-10">
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-slate-50 text-slate-500 rounded-full text-[9px] font-bold uppercase tracking-widest border border-slate-100 mb-8">
                <ShieldCheck className="w-3.5 h-3.5 text-green-500" /> {item.category}
              </div>
              <h1 className="text-5xl lg:text-6xl font-display font-normal tracking-tight text-slate-900 mb-6 leading-none">
                {item.title}
              </h1>
              <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4" />
                  <span>Listed {formatDistanceToNow(new Date(item.createdAt))} ago</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Verified Item</span>
                </div>
              </div>
            </div>

            <div className="prose prose-slate max-w-none mb-12">
              <p className="text-xl text-slate-500 font-normal leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Owner Info */}
            <div className="bg-white rounded-[32px] p-8 mb-12 flex items-center justify-between border border-slate-50 soft-shadow">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                  <User className="w-8 h-8 text-slate-300" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Owner</p>
                  <h4 className="text-lg font-bold text-slate-900 leading-none">{item.ownerName}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Trusted Swapper • 4.9 ★</p>
                </div>
              </div>
              <Link
                to={`/chat?user=${item.ownerId}`}
                className="px-8 py-4 bg-slate-50 text-slate-900 text-[10px] font-bold uppercase tracking-widest rounded-2xl border border-slate-100 hover:bg-white hover:border-slate-200 transition-all flex items-center gap-3 soft-shadow active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                Chat
              </Link>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 mt-auto">
              {user && user.id !== item.ownerId && item.status === 'available' && (
                hasRequested() ? (
                  <div className={`flex-1 flex items-center justify-center gap-4 px-8 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest border ${
                    getRequestStatus() === 'pending' ? 'bg-amber-50 border-amber-100 text-amber-700' :
                    getRequestStatus() === 'accepted' ? 'bg-green-50 border-green-100 text-green-700' :
                    'bg-rose-50 border-rose-100 text-rose-700'
                  }`}>
                    {getRequestStatus() === 'pending' ? (
                      <>
                        <Clock className="w-5 h-5" />
                        Request Pending
                      </>
                    ) : getRequestStatus() === 'accepted' ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Request Accepted
                      </>
                    ) : (
                      <>
                        <X className="w-5 h-5" />
                        Request Rejected
                      </>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setIsSwapModalOpen(true)}
                    className="flex-1 px-8 py-5 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all soft-shadow active:scale-95 flex items-center justify-center gap-3"
                  >
                    Propose Swap
                  </button>
                )
              )}
              {item.status === 'swapped' && (
                <div className="flex-1 px-8 py-5 bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest rounded-2xl border border-slate-100 flex items-center justify-center gap-3">
                  <ShieldCheck className="w-5 h-5" />
                  Item Swapped
                </div>
              )}
              <button className="px-10 py-5 bg-white text-slate-900 text-[10px] font-bold uppercase tracking-widest rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all soft-shadow active:scale-95">
                Offer Cash
              </button>
            </div>

            <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-300 mt-8">
              Secure swapping guaranteed by SwapShop
            </p>
          </motion.div>
        </div>
      </div>

      {/* Swap Request Modal */}
      <AnimatePresence>
        {isSwapModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSwapModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[40px] p-12 soft-shadow border border-slate-50 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-slate-900 to-slate-400" />
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-display font-normal tracking-tight text-slate-900">Propose <span className="italic text-slate-400">Swap</span></h2>
                <button 
                  onClick={() => setIsSwapModalOpen(false)}
                  className="p-2 hover:bg-slate-50 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSwapRequest} className="space-y-10">
                <div className="space-y-4">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                    Your Message to {item?.ownerName}
                  </label>
                  <textarea
                    required
                    value={swapMessage}
                    onChange={(e) => setSwapMessage(e.target.value)}
                    placeholder="Tell them what you'd like to swap or why you want this item..."
                    className="w-full px-8 py-5 bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-slate-900 focus:bg-white rounded-2xl outline-none transition-all min-h-[160px] resize-none text-sm font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-5 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all soft-shadow active:scale-95"
                >
                  Send Request
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
