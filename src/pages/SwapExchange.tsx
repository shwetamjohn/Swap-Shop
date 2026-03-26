import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Plus, Search, ArrowRight, X, User as UserIcon, Tag } from 'lucide-react';
import api from '../lib/api';

interface Item {
  _id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  ownerName: string;
  status: 'available' | 'swapped';
}

const SwapExchange: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
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

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get('/items');
      setItems(res.data);
    } catch (err) {
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/items/addItem', { title, description, image, category });
      setIsModalOpen(false);
      fetchItems();
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
      alert('Swap request sent successfully!');
    } catch (err) {
      console.error('Error sending swap request:', err);
    }
  };

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-12">
        <header className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-2 uppercase">Swap Exchange</h1>
            <p className="text-gray-500 font-medium">Direct trade and direct impact. Swap anything.</p>
          </div>
          {user && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-4 bg-black text-white font-black rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-black/20 active:scale-95 flex items-center gap-3"
            >
              <Plus className="w-5 h-5" /> LIST ITEM
            </button>
          )}
        </header>

        <div className="relative w-full lg:max-w-md mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search items or categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-black transition-all text-sm font-bold"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 bg-white rounded-[32px] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredItems.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[32px] border border-gray-100 overflow-hidden hover:shadow-2xl transition-all group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image || `https://picsum.photos/seed/${item._id}/400/300`}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-black">
                    {item.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-black text-gray-900 mb-2 uppercase tracking-tight truncate">{item.title}</h3>
                  <p className="text-xs text-gray-500 mb-6 line-clamp-2 font-medium leading-relaxed">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="text-[10px] font-bold text-gray-900">{item.ownerName}</span>
                    </div>
                    {user && user.id !== (item as any).ownerId && item.status === 'available' && (
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setIsSwapModalOpen(true);
                        }}
                        className="p-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-all active:scale-95"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
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
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[40px] p-10 shadow-2xl"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-3xl font-black text-gray-900 mb-8 uppercase tracking-tight">List Item</h2>
              <form onSubmit={handleAddItem} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-2">Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all text-sm font-bold"
                    placeholder="e.g. Vintage Camera"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-2">Description</label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all text-sm font-bold min-h-[100px]"
                    placeholder="Describe the item and its condition..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-2">Image URL</label>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all text-sm font-bold"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-2">Category</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all text-sm font-bold"
                    placeholder="e.g. Electronics, Books, Fashion"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-5 bg-black text-white font-black rounded-3xl hover:bg-gray-800 transition-all shadow-xl shadow-black/20 active:scale-95"
                >
                  LIST ITEM
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
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[40px] p-10 shadow-2xl"
            >
              <button
                onClick={() => setIsSwapModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Swap Request</h2>
              <p className="text-sm text-gray-500 mb-8 font-medium">Propose a trade for <span className="text-black font-black">{selectedItem.title}</span></p>
              <form onSubmit={handleSwapRequest} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-2">Your Offer / Message</label>
                  <textarea
                    required
                    value={swapMessage}
                    onChange={(e) => setSwapMessage(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all text-sm font-bold min-h-[120px]"
                    placeholder="Tell the owner what you'd like to trade or offer..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-5 bg-black text-white font-black rounded-3xl hover:bg-gray-800 transition-all shadow-xl shadow-black/20 active:scale-95"
                >
                  SEND REQUEST
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
