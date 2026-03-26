import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { Globe, Search, Filter, Plus, ArrowUpRight, Clock, X, MapPin } from 'lucide-react';
import api from '../lib/api';
import { Link } from 'react-router-dom';

interface Project {
  _id: string;
  title: string;
  description: string;
  type: 'Durable' | 'Temporary' | 'Urgent';
  ownerName: string;
  completionPercentage: number;
  location: string;
  missingLink: string;
  createdAt: string;
}

const Projects: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'Durable' | 'Temporary' | 'Urgent'>('Durable');
  const [location, setLocation] = useState('');
  const [missingLink, setMissingLink] = useState('');

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get('/projects', { params: { type: filter, search } });
      setProjects(res.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [filter, search]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/projects', { title, description, type, location, missingLink });
      setIsModalOpen(false);
      fetchProjects();
      // Reset form
      setTitle('');
      setDescription('');
      setType('Durable');
      setLocation('');
      setMissingLink('');
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-20 selection:bg-slate-200 selection:text-slate-900">
      <div className="max-w-7xl mx-auto px-6 pt-16">
        <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-50 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-widest border border-slate-100 mb-6">
              <Globe className="w-3.5 h-3.5" /> Global Continuity
            </div>
            <h1 className="text-6xl md:text-7xl font-display font-normal tracking-tight text-slate-900 mb-8 leading-[0.9]">
              Relay <span className="italic">Board</span>
            </h1>
            <p className="text-xl text-slate-500 font-normal leading-relaxed">
              Continuity through collaboration. Pass the baton and ensure projects never die.
            </p>
          </div>
          {user && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-10 py-4 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/10 flex items-center gap-3 active:scale-[0.98] group"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> New Project
            </button>
          )}
        </header>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-16">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-8 py-4 bg-white border border-slate-100 rounded-2xl soft-shadow focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm font-medium"
            />
          </div>
          <div className="flex bg-white p-1.5 rounded-2xl soft-shadow w-full lg:w-auto border border-slate-50">
            {['', 'Durable', 'Temporary', 'Urgent'].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                  filter === t ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {t || 'All'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-white rounded-[32px] animate-pulse soft-shadow" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects.map((project) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[32px] border border-slate-50 p-10 soft-shadow hover:-translate-y-1.5 transition-all duration-500 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-slate-900/[0.02] blur-[60px] -mr-20 -mt-20 group-hover:bg-slate-900/[0.04] transition-all" />
                <div className="flex items-start justify-between mb-8">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform ${
                    project.type === 'Urgent' ? 'bg-red-50 text-red-600' : 
                    project.type === 'Durable' ? 'bg-slate-50 text-slate-600' : 'bg-green-50 text-green-600'
                  }`}>
                    <Globe className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Protocol</span>
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${
                      project.type === 'Urgent' ? 'text-red-600' : 
                      project.type === 'Durable' ? 'text-slate-600' : 'text-green-600'
                    }`}>{project.type}</span>
                  </div>
                </div>
                <h3 className="text-2xl font-display font-normal text-slate-900 mb-4 group-hover:text-slate-600 transition-colors tracking-tight leading-tight">
                  {project.title}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-10 leading-relaxed font-normal">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2.5 mb-10">
                  <span className="px-3.5 py-1.5 bg-slate-50 text-[9px] font-bold uppercase tracking-widest rounded-full text-slate-500 border border-slate-100">
                    <MapPin className="w-3 h-3 inline mr-1" /> {project.location}
                  </span>
                  <span className="px-3.5 py-1.5 bg-orange-50 text-[9px] font-bold uppercase tracking-widest rounded-full text-orange-600 border border-orange-100">
                    <Filter className="w-3 h-3 inline mr-1" /> {project.missingLink}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-400">
                      {project.ownerName[0]}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900">{project.ownerName}</span>
                  </div>
                  <Link
                    to={`/projects/${project._id}`}
                    className="p-3.5 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-xl transition-all group/btn"
                  >
                    <ArrowUpRight className="w-4.5 h-4.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] p-12 shadow-2xl overflow-y-auto max-h-[90vh] border border-slate-100"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-3xl font-display font-normal text-slate-900 mb-10 tracking-tight">New Project</h2>
              <form onSubmit={handleCreateProject} className="space-y-8">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2 px-1">Project Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm font-medium"
                    placeholder="e.g. Community Garden Irrigation"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2 px-1">Description</label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm font-medium min-h-[120px] resize-none"
                    placeholder="Describe the project and what needs to be done..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2 px-1">Project Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as any)}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm font-medium appearance-none"
                    >
                      <option value="Durable">Durable</option>
                      <option value="Temporary">Temporary</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2 px-1">Location</label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm font-medium"
                      placeholder="e.g. San Francisco, CA"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2 px-1">The Missing Link</label>
                  <input
                    type="text"
                    required
                    value={missingLink}
                    onChange={(e) => setMissingLink(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm font-medium"
                    placeholder="e.g. Needs Beta Testers"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98]"
                >
                  Publish Project
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
