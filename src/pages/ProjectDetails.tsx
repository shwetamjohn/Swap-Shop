import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { Globe, ArrowLeft, Clock, User as UserIcon, CheckCircle, X, FileText } from 'lucide-react';
import api from '../lib/api';

interface Project {
  _id: string;
  title: string;
  description: string;
  type: 'Durable' | 'Temporary' | 'Urgent';
  ownerId: string;
  ownerName: string;
  location: string;
  missingLink: string;
  createdAt: string;
  handoffRequests: any[];
  contract?: any;
}

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isHandoffModalOpen, setIsHandoffModalOpen] = useState(false);
  const [handoffMessage, setHandoffMessage] = useState('');

  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
    } catch (err) {
      console.error('Error fetching project:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleRequestHandoff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${id}/handoff/request`, { message: handoffMessage });
      setIsHandoffModalOpen(false);
      setHandoffMessage('');
      fetchProject();
      alert('Handoff request sent successfully!');
    } catch (err) {
      console.error('Error requesting handoff:', err);
    }
  };

  const handleAcceptHandoff = async (requestId: string) => {
    try {
      await api.put(`/projects/${id}/handoff/${requestId}/accept`);
      fetchProject();
      alert('Handoff accepted and contract generated!');
    } catch (err) {
      console.error('Error accepting handoff:', err);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#F8F9FA] p-12 flex items-center justify-center font-black text-2xl uppercase tracking-widest">Loading Project...</div>;
  if (!project) return <div className="min-h-screen bg-[#F8F9FA] p-12 flex items-center justify-center font-black text-2xl uppercase tracking-widest">Project not found.</div>;

  const isOwner = user && user.id === project.ownerId;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      <div className="max-w-5xl mx-auto px-6 pt-12">
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors font-black uppercase tracking-widest text-[10px] mb-12"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Relay Board
        </button>

        <div className="bg-white rounded-[40px] p-12 border border-gray-100 shadow-xl shadow-black/5 mb-12">
          <div className="flex items-start justify-between mb-8">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
              project.type === 'Urgent' ? 'bg-red-50 text-red-600' : 
              project.type === 'Durable' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
            }`}>
              <Globe className="w-8 h-8" />
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Type</span>
              <span className={`text-sm font-black uppercase tracking-widest ${
                project.type === 'Urgent' ? 'text-red-600' : 
                project.type === 'Durable' ? 'text-blue-600' : 'text-green-600'
              }`}>{project.type}</span>
            </div>
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-6 uppercase tracking-tight leading-tight">{project.title}</h1>
          <p className="text-lg text-gray-500 mb-12 leading-relaxed font-medium">{project.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-gray-50">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 px-2">Project Details</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <span className="text-xs font-bold text-gray-500">Location</span>
                  <span className="text-xs font-black text-gray-900">{project.location}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <span className="text-xs font-bold text-gray-500">The Missing Link</span>
                  <span className="text-xs font-black text-orange-600">{project.missingLink}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <span className="text-xs font-bold text-gray-500">Created At</span>
                  <span className="text-xs font-black text-gray-900">{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 px-2">Owner</h3>
              <div className="flex items-center gap-4 p-6 bg-black text-white rounded-[32px] shadow-xl shadow-black/20">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <UserIcon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-tight">{project.ownerName}</h4>
                  <span className="text-[10px] font-bold text-gray-400">Project Lead</span>
                </div>
              </div>
            </div>
          </div>

          {!isOwner && user && (
            <div className="mt-12">
              <button
                onClick={() => setIsHandoffModalOpen(true)}
                className="w-full py-5 bg-blue-600 text-white font-black rounded-3xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
              >
                REQUEST HANDOFF
              </button>
            </div>
          )}
        </div>

        {/* Handoff Requests (For Owner) */}
        {isOwner && (
          <section className="mb-12">
            <h2 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tight">Handoff Requests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {project.handoffRequests.length === 0 ? (
                <div className="col-span-full bg-white rounded-[32px] p-12 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px] border border-dashed border-gray-200">
                  No requests yet.
                </div>
              ) : (
                project.handoffRequests.map((req: any) => (
                  <div key={req._id} className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl shadow-black/5">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 uppercase tracking-tight">{req.requesterName}</h4>
                        <span className="text-[10px] font-bold text-gray-400">Potential Successor</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-8 font-medium leading-relaxed italic">"{req.message}"</p>
                    {req.status === 'pending' ? (
                      <button
                        onClick={() => handleAcceptHandoff(req._id)}
                        className="w-full py-4 bg-green-600 text-white font-black rounded-2xl hover:bg-green-700 transition-all active:scale-95"
                      >
                        ACCEPT HANDOFF
                      </button>
                    ) : (
                      <div className="w-full py-4 bg-gray-50 text-gray-400 font-black rounded-2xl text-center text-[10px] uppercase tracking-widest">
                        {req.status}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* Digital Contract */}
        {project.contract && (
          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tight">Digital Contract</h2>
            <div className="bg-white rounded-[40px] p-12 border border-gray-100 shadow-xl shadow-black/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-[80px] -mr-32 -mt-32" />
              <div className="flex items-center gap-4 mb-12">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Handoff Agreement</h3>
                  <span className="text-[10px] font-black uppercase tracking-widest text-green-600">Legally Binding Community Contract</span>
                </div>
              </div>
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Previous Owner</span>
                    <p className="text-lg font-black text-gray-900 uppercase">{project.contract.previousOwnerName}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">New Owner</span>
                    <p className="text-lg font-black text-gray-900 uppercase">{project.contract.newOwnerName}</p>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Handoff Date</span>
                  <p className="text-lg font-black text-gray-900 uppercase">{new Date(project.contract.handoffDate).toLocaleString()}</p>
                </div>
                <div className="pt-12 border-t border-gray-50 flex items-center justify-center">
                  <div className="px-8 py-4 bg-green-50 text-green-600 rounded-2xl flex items-center gap-3">
                    <CheckCircle className="w-6 h-6" />
                    <span className="text-sm font-black uppercase tracking-widest">Contract Verified & Finalized</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Handoff Request Modal */}
      <AnimatePresence>
        {isHandoffModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHandoffModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[40px] p-10 shadow-2xl"
            >
              <button
                onClick={() => setIsHandoffModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Handoff Request</h2>
              <p className="text-sm text-gray-500 mb-8 font-medium">Explain why you're the right person to take over <span className="text-black font-black">{project.title}</span></p>
              <form onSubmit={handleRequestHandoff} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-2">Your Message</label>
                  <textarea
                    required
                    value={handoffMessage}
                    onChange={(e) => setHandoffMessage(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all text-sm font-bold min-h-[120px]"
                    placeholder="Tell the owner about your skills and commitment..."
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

export default ProjectDetails;
