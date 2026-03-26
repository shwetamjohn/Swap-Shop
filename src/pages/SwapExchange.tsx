import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Plus, Search, ArrowRight, X, User as UserIcon, Tag, CheckCircle } from 'lucide-react';
import api from '../lib/api';
import TrustBadge from '../components/TrustBadge';

interface Item {
  _id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  ownerName: string;
  ownerRating?: number;
  ownerTotalRatings?: number;
  status: 'available' | 'swapped';
}

const SwapExchange: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [userRequests, setUserRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [swapMessage, setSwapMessage] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [itemsRes, requestsRes] = await Promise.all([
        api.get('/items/items'),
        user ? api.get('/items/swapRequests') : Promise.resolve({ data: [] })
      ]);
      setItems(itemsRes.data);
      setUserRequests(requestsRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/items/addItem', { title, description, image, category });
      setIsModalOpen(false);
      fetchData();
      // Reset form
      setTitle('');
      setDescription('');
      setImage('');
      setCategory('');
    } catch (err) {
      console.error('Error adding item:', err);
    }
  };

  const handleSwapRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    try {
      await api.post('/items/swapRequest', {
        itemId: selectedItem._id,
        ownerId: (selectedItem as any).ownerId,
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

  const hasRequested = (itemId: string) => {
    return userRequests.some(r => r.itemId?._id === itemId || r.itemId === itemId);
  };

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-20 selection:bg-slate-200 selection:text-slate-900">
      <div className="max-w-7xl mx-auto px-6 pt-16">
        <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-slate-50 text-slate-500 rounded-full text-[9px] font-bold uppercase tracking-widest border border-slate-100 mb-8">
              <ShoppingBag className="w-3.5 h-3.5" /> Circular Economy
            </div>
            <h1 className="text-6xl md:text-7xl font-display font-normal tracking-tight text-slate-900 mb-8 leading-none">
              Swap <span className="italic">Exchange</span>
            </h1>
            <p className="text-xl text-slate-500 font-normal leading-relaxed">
              Trade items with your neighbors. No money, just pure community value.
            </p>
          </div>
          {user && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-10 py-4 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all soft-shadow flex items-center gap-4 active:scale-95 group"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> List New Item
            </button>
          )}
        </header>

        <div className="relative w-full lg:max-w-md mb-20">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search items or categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-14 pr-8 py-4.5 bg-white border border-slate-100 rounded-[24px] soft-shadow focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm font-medium"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-96 bg-white rounded-[40px] animate-pulse soft-shadow" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {filteredItems.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[40px] overflow-hidden soft-shadow border border-slate-50 group hover:-translate-y-1.5 transition-all duration-700"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.image || `https://picsum.photos/seed/${item._id}/400/300`}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-bold uppercase tracking-widest text-slate-900 shadow-sm border border-slate-100">
                    {item.category}
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                      <UserIcon className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900">{item.ownerName}</span>
                        {item.ownerRating !== undefined && (
                          <TrustBadge rating={item.ownerRating} size="sm" />
                        )}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-display font-normal text-slate-900 mb-3 tracking-tight truncate group-hover:text-slate-600 transition-colors">{item.title}</h3>
                  <p className="text-sm text-slate-500 mb-8 line-clamp-2 font-normal leading-relaxed">{item.description}</p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    {user && user.id !== (item as any).ownerId && item.status === 'available' ? (
                      hasRequested(item._id) ? (
                        <div className="flex items-center justify-center w-full gap-3 text-[10px] font-bold uppercase tracking-widest text-green-600 bg-green-50 px-5 py-3.5 rounded-2xl border border-green-100">
                          <CheckCircle className="w-4 h-4" /> Request Sent
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setIsSwapModalOpen(true);
                          }}
                          className="w-full py-4 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                          Propose Swap <ArrowRight className="w-4 h-4" />
                        </button>
                      )
                    ) : (
                      <div className="w-full py-4 bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest rounded-2xl flex items-center justify-center italic border border-slate-100">
                        {item.status === 'swapped' ? 'Item Swapped' : 'Your Listing'}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* List Item Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/10 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-[40px] p-12 soft-shadow border border-slate-50"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-10 right-10 p-2 text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-4xl font-display font-normal text-slate-900 mb-10 tracking-tight">List <span className="italic">Item</span></h2>
              <form onSubmit={handleAddItem} className="space-y-8">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 px-1">Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm font-medium"
                    placeholder="e.g. Vintage Camera"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 px-1">Description</label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm font-medium min-h-[120px]"
                    placeholder="Describe the item and its condition..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 px-1">Image URL</label>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm font-medium"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 px-1">Category</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm font-medium"
                    placeholder="e.g. Electronics, Books, Fashion"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-5 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all active:scale-95"
                >
                  List Item
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Swap Request Modal */}
      <AnimatePresence>
        {isSwapModalOpen && selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSwapModalOpen(false)}
              className="absolute inset-0 bg-slate-900/10 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-[40px] p-12 soft-shadow border border-slate-50"
            >
              <button
                onClick={() => setIsSwapModalOpen(false)}
                className="absolute top-10 right-10 p-2 text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-3xl font-display font-normal text-slate-900 mb-3 tracking-tight">Swap <span className="italic">Request</span></h2>
              <p className="text-sm text-slate-500 mb-10 font-normal leading-relaxed">Propose a trade for <span className="text-slate-900 font-bold">{selectedItem.title}</span></p>
              <form onSubmit={handleSwapRequest} className="space-y-8">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 px-1">Your Offer / Message</label>
                  <textarea
                    required
                    value={swapMessage}
                    onChange={(e) => setSwapMessage(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm font-medium min-h-[140px]"
                    placeholder="Tell the owner what you'd like to trade or offer..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-5 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all active:scale-95"
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
};

export default SwapExchange;
