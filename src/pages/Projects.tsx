import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { Globe, Search, Filter, Plus, ArrowUpRight, Clock, X } from 'lucide-react';
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
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-12">
        <header className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-2 uppercase">Relay Board</h1>
            <p className="text-gray-500 font-medium">Continuity through collaboration. Pass the baton.</p>
          </div>
          {user && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-4 bg-black text-white font-black rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-black/20 active:scale-95 flex items-center gap-3"
            >
              <Plus className="w-5 h-5" /> NEW PROJECT
            </button>
          )}
        </header>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-12">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-black transition-all text-sm font-bold"
            />
          </div>
          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm w-full lg:w-auto">
            {['', 'Durable', 'Temporary', 'Urgent'].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === t ? 'bg-black text-white shadow-lg shadow-black/10' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {t || 'All'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 bg-white rounded-[32px] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[32px] border border-gray-100 p-8 hover:shadow-2xl transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-all" />
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    project.type === 'Urgent' ? 'bg-red-50 text-red-600' : 
                    project.type === 'Durable' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                  }`}>
                    <Globe className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Type</span>
                    <span className={`text-xs font-black uppercase tracking-widest ${
                      project.type === 'Urgent' ? 'text-red-600' : 
                      project.type === 'Durable' ? 'text-blue-600' : 'text-green-600'
                    }`}>{project.type}</span>
                  </div>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-8 leading-relaxed font-medium">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  <span className="px-3 py-1 bg-gray-50 text-[10px] font-bold uppercase tracking-wider rounded-full text-gray-500 border border-gray-100">
                    {project.location}
                  </span>
                  <span className="px-3 py-1 bg-orange-50 text-[10px] font-bold uppercase tracking-wider rounded-full text-orange-600 border border-orange-100">
                    {project.missingLink}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-[10px] font-black">
                      {project.ownerName[0]}
                    </div>
                    <span className="text-xs font-bold text-gray-900">{project.ownerName}</span>
                  </div>
                  <Link
                    to={`/projects/${project._id}`}
                    className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Details <ArrowUpRight className="w-4 h-4" />
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
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] p-10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-3xl font-black text-gray-900 mb-8 uppercase tracking-tight">New Project</h2>
              <form onSubmit={handleCreateProject} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-2">Project Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all text-sm font-bold"
                    placeholder="e.g. Community Garden Irrigation"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-2">Description</label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all text-sm font-bold min-h-[120px]"
                    placeholder="Describe the project and what needs to be done..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-2">Project Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as any)}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all text-sm font-bold"
                    >
                      <option value="Durable">Durable</option>
                      <option value="Temporary">Temporary</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-2">Location</label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all text-sm font-bold"
                      placeholder="e.g. San Francisco, CA"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-2">The Missing Link</label>
                  <input
                    type="text"
                    required
                    value={missingLink}
                    onChange={(e) => setMissingLink(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all text-sm font-bold"
                    placeholder="e.g. Needs Beta Testers"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-5 bg-black text-white font-black rounded-3xl hover:bg-gray-800 transition-all shadow-xl shadow-black/20 active:scale-95"
                >
                  PUBLISH PROJECT
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
