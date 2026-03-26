import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  Globe, 
  MapPin, 
  ShoppingBag, 
  RefreshCw, 
  BarChart3, 
  Trash2, 
  ShieldAlert,
  Search,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Tab = 'overview' | 'users' | 'projects' | 'food' | 'items' | 'swaps';

const Admin: React.FC = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'overview' ? '/api/admin/dashboard' : `/api/admin/${activeTab}`;
      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch admin data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleDelete = async (id: string, type: string) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}? This action is permanent and may delete associated data.`)) return;

    try {
      await axios.delete(`/api/admin/${activeTab}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData(); // Refresh list
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  const filteredData = Array.isArray(data) 
    ? data.filter(item => 
        Object.values(item).some(val => 
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'projects', label: 'Projects', icon: Globe },
    { id: 'food', label: 'Food', icon: MapPin },
    { id: 'items', label: 'Items', icon: ShoppingBag },
    { id: 'swaps', label: 'Swaps', icon: RefreshCw },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-20 selection:bg-slate-200 selection:text-slate-900">
      <div className="max-w-7xl mx-auto px-6 pt-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-red-50 rounded-xl border border-red-100">
                <ShieldAlert className="w-5 h-5 text-red-600" />
              </div>
              <div className="px-4 py-1.5 bg-slate-50 text-slate-500 rounded-full text-[9px] font-bold uppercase tracking-widest border border-slate-100">
                Admin Access
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-normal tracking-tight text-slate-900 mb-6 leading-none">
              Moderation <span className="italic text-slate-400">Hub</span>
            </h1>
            <p className="text-lg text-slate-500 font-normal leading-relaxed">
              Platform-wide control and oversight for the community.
            </p>
          </div>

          <div className="flex bg-white border border-slate-100 p-1.5 rounded-[24px] soft-shadow overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as Tab);
                  setSearchTerm('');
                }}
                className={`flex items-center gap-3 px-6 py-3.5 rounded-[18px] text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10' 
                    : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab !== 'overview' && (
          <div className="relative mb-12 max-w-md">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-8 py-4.5 bg-white border border-slate-100 rounded-[24px] soft-shadow focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm font-medium"
            />
          </div>
        )}

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32"
            >
              <RefreshCw className="w-10 h-10 text-slate-900 animate-spin mb-6" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Syncing Data...</span>
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-100 p-12 rounded-[40px] text-center max-w-2xl mx-auto"
            >
              <ShieldAlert className="w-12 h-12 text-red-600 mx-auto mb-6" />
              <h3 className="text-2xl font-display font-normal text-red-900 mb-3 tracking-tight">Access Denied or Error</h3>
              <p className="text-red-700 font-normal leading-relaxed">{error}</p>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              {activeTab === 'overview' && data && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                  <StatCard label="Total Users" value={data.totalUsers} icon={Users} color="slate" />
                  <StatCard label="Active Projects" value={data.totalProjects} icon={Globe} color="slate" />
                  <StatCard label="Food Listings" value={data.totalFood} icon={MapPin} color="slate" />
                  <StatCard label="Items in Exchange" value={data.totalItems} icon={ShoppingBag} color="slate" />
                  <StatCard label="Swap Requests" value={data.totalSwaps} icon={RefreshCw} color="slate" />
                  <StatCard label="Successful Dibs" value={data.claimedDibs} icon={CheckCircle2} color="slate" />
                </div>
              )}

              {activeTab !== 'overview' && (
                <div className="bg-white border border-slate-100 rounded-[40px] soft-shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                          {getTableHeaders(activeTab).map(header => (
                            <th key={header} className="px-8 py-6 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                              {header}
                            </th>
                          ))}
                          <th className="px-8 py-6 text-[9px] font-bold uppercase tracking-widest text-slate-400 text-right">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredData.map((item: any) => (
                          <tr key={item._id} className="hover:bg-slate-50/30 transition-colors group">
                            {renderRowCells(activeTab, item)}
                            <td className="px-8 py-6 text-right">
                              <button 
                                onClick={() => handleDelete(item._id, activeTab.slice(0, -1))}
                                className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredData.length === 0 && (
                      <div className="py-32 text-center">
                        <p className="text-slate-400 font-normal italic">No records found matching your criteria.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: number; icon: any; color: string }> = ({ label, value, icon: Icon, color }) => (
  <div className="bg-white p-10 rounded-[40px] border border-slate-100 soft-shadow hover:-translate-y-1 transition-all group">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform bg-slate-50 text-slate-900`}>
      <Icon className="w-6 h-6" />
    </div>
    <div className="text-5xl font-display font-normal tracking-tight text-slate-900 mb-2 leading-none">{value}</div>
    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</div>
  </div>
);

const getTableHeaders = (tab: Tab): string[] => {
  switch (tab) {
    case 'users': return ['Name', 'Email', 'Role', 'Joined'];
    case 'projects': return ['Title', 'Owner', 'Type', 'Progress'];
    case 'food': return ['Title', 'Owner', 'Status', 'Expires'];
    case 'items': return ['Title', 'Owner', 'Category', 'Status'];
    case 'swaps': return ['Item ID', 'Requester', 'Owner', 'Status'];
    default: return [];
  }
};

const renderRowCells = (tab: Tab, item: any) => {
  const cellClass = "px-8 py-6 text-sm font-normal text-slate-500 leading-relaxed";
  const boldClass = "px-8 py-6 text-sm font-bold text-slate-900 tracking-tight";
  
  switch (tab) {
    case 'users':
      return (
        <>
          <td className={boldClass}>{item.name}</td>
          <td className={cellClass}>{item.email}</td>
          <td className={cellClass}>
            <span className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest ${
              item.role === 'admin' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-50 text-slate-500 border border-slate-100'
            }`}>
              {item.role}
            </span>
          </td>
          <td className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(item.createdAt).toLocaleDateString()}</td>
        </>
      );
    case 'projects':
      return (
        <>
          <td className={boldClass}>{item.title}</td>
          <td className={cellClass}>{item.ownerName}</td>
          <td className={cellClass}>{item.type}</td>
          <td className={cellClass}>
            <div className="w-24 h-1.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
              <div className="h-full bg-slate-900" style={{ width: `${item.completionPercentage}%` }} />
            </div>
          </td>
        </>
      );
    case 'food':
      return (
        <>
          <td className={boldClass}>{item.title}</td>
          <td className={cellClass}>{item.ownerName}</td>
          <td className={cellClass}>
            <span className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest ${
              item.claimedBy ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
            }`}>
              {item.claimedBy ? 'Claimed' : 'Available'}
            </span>
          </td>
          <td className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(item.expiresAt).toLocaleDateString()}</td>
        </>
      );
    case 'items':
      return (
        <>
          <td className={boldClass}>{item.title}</td>
          <td className={cellClass}>{item.ownerName}</td>
          <td className={cellClass}>{item.category}</td>
          <td className={cellClass}>
            <span className="px-3 py-1 bg-slate-50 text-slate-500 border border-slate-100 rounded-lg text-[9px] font-bold uppercase tracking-widest">
              {item.status}
            </span>
          </td>
        </>
      );
    case 'swaps':
      return (
        <>
          <td className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.itemId}</td>
          <td className={cellClass}>{item.requesterName}</td>
          <td className={cellClass}>{item.ownerId}</td>
          <td className={cellClass}>
            <span className="px-3 py-1 bg-slate-50 text-slate-500 border border-slate-100 rounded-lg text-[9px] font-bold uppercase tracking-widest">
              {item.status}
            </span>
          </td>
        </>
      );
    default: return null;
  }
};

export default Admin;
