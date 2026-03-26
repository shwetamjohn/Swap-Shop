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
    <div className="min-h-screen bg-[#FAF9F6] pb-20 selection:bg-slate-200 selection:text-slate-900">
      <div className="max-w-5xl mx-auto px-6 pt-16">
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-bold uppercase tracking-widest text-[9px] mb-12 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Back to Relay Board
        </button>

        <div className="bg-white rounded-[40px] p-12 md:p-16 border border-slate-100 soft-shadow mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-slate-100/50 blur-[120px] -mr-48 -mt-48" />
          <div className="flex items-start justify-between mb-16">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              project.type === 'Urgent' ? 'bg-red-50 text-red-600' : 
              project.type === 'Durable' ? 'bg-slate-50 text-slate-600' : 'bg-green-50 text-green-600'
            }`}>
              <Globe className="w-7 h-7" />
            </div>
            <div className="text-right">
              <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400 block mb-1.5">Protocol Status</span>
              <span className={`text-[9px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border ${
                project.type === 'Urgent' ? 'text-red-600 bg-red-50 border-red-100' : 
                project.type === 'Durable' ? 'text-slate-600 bg-slate-50 border-slate-100' : 'text-green-600 bg-green-50 border-green-100'
              }`}>{project.type}</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-normal text-slate-900 mb-8 tracking-tight leading-[1.1] max-w-3xl">
            {project.title}
          </h1>
          <p className="text-lg md:text-xl text-slate-500 mb-16 leading-relaxed font-normal max-w-2xl">
            {project.description}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-16 border-t border-slate-100">
            <div>
              <h3 className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-8 px-1">Project Metadata</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Location</span>
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-tight">{project.location}</span>
                </div>
                <div className="flex items-center justify-between p-6 bg-orange-50/20 rounded-2xl border border-orange-100/50">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-orange-400">The Missing Link</span>
                  <span className="text-xs font-bold text-orange-600 uppercase tracking-tight">{project.missingLink}</span>
                </div>
                <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Initialized</span>
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-tight">{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-8 px-1">Current Custodian</h3>
              <div className="flex items-center gap-6 p-8 bg-white border border-slate-100 rounded-[32px] soft-shadow relative overflow-hidden group">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                  <UserIcon className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-xl font-display font-normal text-slate-900 tracking-tight">{project.ownerName}</h4>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Project Lead</span>
                </div>
              </div>
            </div>
          </div>

          {!isOwner && user && (
            <div className="mt-16">
              <button
                onClick={() => setIsHandoffModalOpen(true)}
                className="w-full py-5 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/10 transition-all active:scale-[0.98]"
              >
                Initiate Handoff Protocol
              </button>
            </div>
          )}
        </div>

        {/* Handoff Requests (For Owner) */}
        {isOwner && (
          <section className="mb-16">
            <h2 className="text-3xl font-display font-normal text-slate-900 mb-10 tracking-tight">Handoff Requests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {project.handoffRequests.length === 0 ? (
                <div className="col-span-full bg-white rounded-[40px] p-24 text-center text-slate-400 font-bold uppercase tracking-widest text-[9px] border border-dashed border-slate-200 soft-shadow">
                  No active requests in the relay queue.
                </div>
              ) : (
                project.handoffRequests.map((req: any) => (
                  <div key={req._id} className="bg-white rounded-[32px] p-10 border border-slate-100 soft-shadow group hover:border-slate-200 transition-colors">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                        <UserIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-lg font-display font-normal text-slate-900 tracking-tight">{req.requesterName}</h4>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Potential Successor</span>
                      </div>
                    </div>
                    <div className="bg-slate-50/50 rounded-2xl p-6 mb-8 relative border border-slate-100/50">
                      <p className="text-sm text-slate-600 font-normal leading-relaxed italic">"{req.message}"</p>
                    </div>
                    {req.status === 'pending' ? (
                      <button
                        onClick={() => handleAcceptHandoff(req._id)}
                        className="w-full py-4 bg-slate-900 text-white text-[9px] font-bold uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all active:scale-[0.98]"
                      >
                        Accept Handoff
                      </button>
                    ) : (
                      <div className="w-full py-4 bg-slate-50 text-slate-400 font-bold rounded-xl text-center text-[9px] uppercase tracking-widest border border-slate-100">
                        Protocol {req.status}
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
            <h2 className="text-3xl font-display font-normal text-slate-900 mb-10 tracking-tight">Digital Contract</h2>
            <div className="bg-white rounded-[40px] p-12 md:p-16 border border-slate-100 soft-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-slate-50 blur-[120px] -mr-48 -mt-48" />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 border border-slate-100">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-normal text-slate-900 tracking-tight">Handoff Agreement</h3>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1 block">
                      Legally Binding Community Contract
                    </span>
                  </div>
                </div>
                <div className="px-5 py-2.5 bg-slate-50 text-slate-600 rounded-xl flex items-center gap-3 border border-slate-100">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Verified & Finalized</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
                <div className="p-8 bg-slate-50/50 rounded-[32px] border border-slate-100/50">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block mb-4">Previous Custodian</span>
                  <p className="text-2xl font-display font-normal text-slate-900 tracking-tight">{project.contract.previousOwnerName}</p>
                </div>
                <div className="p-8 bg-slate-900 text-white rounded-[32px] shadow-2xl shadow-slate-900/10">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400/60 block mb-4">New Custodian</span>
                  <p className="text-2xl font-display font-normal tracking-tight">{project.contract.newOwnerName}</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-slate-100">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Handoff Timestamp</span>
                  <p className="text-base font-bold text-slate-900 uppercase tracking-tight">
                    {new Date(project.contract.handoffDate).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Contract ID</span>
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">
                    {project.contract._id || 'RELAY-AUTH-9921'}
                  </p>
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
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-[40px] p-12 shadow-2xl border border-slate-100 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-slate-50 blur-[60px] -mr-20 -mt-20" />
              <button
                onClick={() => setIsHandoffModalOpen(false)}
                className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-900 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="relative z-10">
                <h2 className="text-3xl font-display font-normal text-slate-900 mb-2 tracking-tight">Handoff Request</h2>
                <p className="text-sm text-slate-500 mb-10 font-normal leading-relaxed">
                  Explain why you're the right person to take over <span className="text-slate-900 font-bold uppercase tracking-tight">{project.title}</span>
                </p>
                <form onSubmit={handleRequestHandoff} className="space-y-8">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-3 px-1">Your Message</label>
                    <textarea
                      required
                      value={handoffMessage}
                      onChange={(e) => setHandoffMessage(e.target.value)}
                      className="w-full px-6 py-5 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm font-medium min-h-[160px] resize-none"
                      placeholder="Tell the owner about your skills and commitment..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all active:scale-[0.98]"
                  >
                    Transmit Request
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetails;
