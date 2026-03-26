import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Item } from '../types';
import { ArrowLeft, MessageSquare, Share2, Heart, ShieldCheck, Clock, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/items/${id}`)
      .then(res => res.json())
      .then(data => {
        setItem(data);
        setLoading(false);
      });
  }, [id]);

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
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-6 right-6 flex flex-col gap-3">
              <button className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                <Heart className="w-6 h-6 text-gray-900" />
              </button>
              <button className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                <Share2 className="w-6 h-6 text-gray-900" />
              </button>
            </div>
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-8">
              <span className="inline-block px-4 py-1.5 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-6">
                {item.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-4 leading-tight">
                {item.title}
              </h1>
              <div className="flex items-center gap-6 text-sm text-gray-500 font-medium">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Listed {formatDistanceToNow(new Date(item.createdAt))} ago</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span>Verified Item</span>
                </div>
              </div>
            </div>

            <div className="prose prose-gray max-w-none mb-10">
              <p className="text-lg text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Owner Info */}
            <div className="bg-gray-50 rounded-3xl p-6 mb-10 flex items-center justify-between border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{item.ownerName}</h4>
                  <p className="text-xs text-gray-500 font-medium">Trusted Swapper • 4.9 ★</p>
                </div>
              </div>
              <Link
                to={`/chat?user=${item.ownerId}`}
                className="px-6 py-3 bg-white text-black font-bold rounded-2xl border border-gray-200 hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-sm"
              >
                <MessageSquare className="w-5 h-5" />
                Chat
              </Link>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 px-8 py-5 bg-black text-white font-black text-lg rounded-3xl hover:bg-gray-800 transition-all shadow-xl shadow-black/20 active:scale-95">
                PROPOSE SWAP
              </button>
              <button className="px-8 py-5 bg-white text-black font-black text-lg rounded-3xl border-2 border-black hover:bg-gray-50 transition-all active:scale-95">
                OFFER CASH
              </button>
            </div>

            <p className="text-center text-xs text-gray-400 mt-6 font-medium">
              Secure swapping guaranteed. Your items are protected by SwapShop.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
