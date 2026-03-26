import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Camera, ArrowLeft, Upload, ShieldCheck, Info } from 'lucide-react';

export default function CreateItem() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Electronics',
    image: '',
    ownerId: 'user1', // Mock current user
    ownerName: 'Alice'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        navigate('/');
      }
    } catch (error) {
      console.error('Error creating item:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Electronics', 'Sports', 'Music', 'Books', 'Home', 'Fashion'];

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      <div className="max-w-4xl mx-auto px-6 pt-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-colors mb-12 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] shadow-2xl p-10 lg:p-16 border border-gray-100"
        >
          <div className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-gray-900 mb-4 leading-tight">
              LIST YOUR ITEM
            </h1>
            <p className="text-lg text-gray-500 font-medium max-w-lg">
              Give your items a second life. Describe it well to find the perfect swap.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Image Upload Mock */}
            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400">
                Item Photo
              </label>
              <div className="relative aspect-[16/9] bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-4 group hover:border-black transition-colors cursor-pointer overflow-hidden">
                {formData.image ? (
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-900">Click to upload photo</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  </>
                )}
                <input
                  type="text"
                  placeholder="Paste image URL here for now..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="absolute bottom-6 left-6 right-6 px-6 py-3 bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-black outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400">
                  Item Title
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Vintage Polaroid Camera"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-6 py-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all text-sm font-bold"
                />
              </div>

              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-6 py-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all text-sm font-bold appearance-none"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400">
                Description
              </label>
              <textarea
                required
                rows={5}
                placeholder="Tell us about the condition, age, and why you're swapping it..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-6 py-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all text-sm font-bold resize-none"
              />
            </div>

            <div className="bg-blue-50/50 rounded-3xl p-6 flex items-start gap-4 border border-blue-100">
              <Info className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-blue-900 mb-1">Swap Tip</h4>
                <p className="text-xs text-blue-700 leading-relaxed font-medium">
                  Be honest about the condition of your item. Good descriptions lead to faster and more successful swaps.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 pt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-12 py-5 bg-black text-white font-black text-lg rounded-3xl hover:bg-gray-800 transition-all shadow-xl shadow-black/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Upload className="w-6 h-6" />
                    PUBLISH LISTING
                  </>
                )}
              </button>
              <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-widest">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                Secure Listing
              </div>
            </div>
          </form>
        </motion.div>

        <p className="text-center text-xs text-gray-400 mt-12 font-medium">
          By publishing, you agree to SwapShop's Terms of Service and Community Guidelines.
        </p>
      </div>
    </div>
  );
}
