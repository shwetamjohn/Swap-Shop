import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Camera, ArrowLeft, Upload, ShieldCheck, Info, Plus } from 'lucide-react';

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
    <div className="min-h-screen bg-[#FAF9F6] pb-20 selection:bg-slate-200 selection:text-slate-900">
      <div className="max-w-4xl mx-auto px-6 pt-16">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors mb-16 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] soft-shadow p-12 lg:p-20 border border-slate-50"
        >
          <div className="mb-16">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-slate-50 text-slate-500 rounded-full text-[9px] font-bold uppercase tracking-widest border border-slate-100 mb-8">
              <Plus className="w-3.5 h-3.5" /> New Listing
            </div>
            <h1 className="text-5xl lg:text-6xl font-display font-normal tracking-tight text-slate-900 mb-6 leading-none">
              List Your <span className="italic text-slate-400">Item</span>
            </h1>
            <p className="text-xl text-slate-500 font-normal leading-relaxed max-w-lg">
              Give your items a second life. Describe it well to find the perfect swap.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-16">
            {/* Image Upload Mock */}
            <div className="space-y-6">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">
                Item Photo
              </label>
              <div className="relative aspect-[16/9] bg-slate-50 rounded-[32px] border border-slate-100 flex flex-col items-center justify-center gap-6 group hover:bg-slate-100 transition-all cursor-pointer overflow-hidden">
                {formData.image ? (
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center soft-shadow border border-slate-50 group-hover:scale-110 transition-transform duration-500">
                      <Camera className="w-8 h-8 text-slate-300" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-slate-900">Click to upload photo</p>
                      <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">PNG, JPG up to 10MB</p>
                    </div>
                  </>
                )}
                <input
                  type="text"
                  placeholder="Paste image URL here for now..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="absolute bottom-8 left-8 right-8 px-8 py-4 bg-white/90 backdrop-blur-md border border-slate-100 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-slate-900 outline-none soft-shadow"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">
                  Item Title
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Vintage Polaroid Camera"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm font-medium"
                />
              </div>

              <div className="space-y-6">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm font-medium appearance-none"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-6">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">
                Description
              </label>
              <textarea
                required
                rows={5}
                placeholder="Tell us about the condition, age, and why you're swapping it..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm font-medium resize-none min-h-[160px]"
              />
            </div>

            <div className="bg-blue-50/30 rounded-[32px] p-8 flex items-start gap-6 border border-blue-100">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center soft-shadow shrink-0">
                <Info className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-blue-900 mb-2 uppercase tracking-tight">Swap Tip</h4>
                <p className="text-sm text-blue-700 leading-relaxed font-normal">
                  Be honest about the condition of your item. Good descriptions lead to faster and more successful swaps.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-10 pt-10 border-t border-slate-50">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-12 py-5 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all soft-shadow active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 group"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Upload className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                    Publish Listing
                  </>
                )}
              </button>
              <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                Secure Listing
              </div>
            </div>
          </form>
        </motion.div>

        <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-300 mt-16">
          By publishing, you agree to SwapShop's Terms of Service and Community Guidelines.
        </p>
      </div>
    </div>
  );
}
