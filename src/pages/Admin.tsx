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
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <ShieldAlert className="w-6 h-6 text-red-600" />
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">Moderation Hub</h1>
          </div>
          <p className="text-gray-500 font-medium">Platform-wide control and oversight</p>
        </div>

        <div className="flex bg-white border border-gray-100 p-1 rounded-xl shadow-sm overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as Tab);
                setSearchTerm('');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-black text-white shadow-lg' 
                  : 'text-gray-500 hover:text-black hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab !== 'overview' && (
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-black outline-none transition-all font-medium"
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
            className="flex flex-col items-center justify-center py-24"
          >
            <RefreshCw className="w-12 h-12 text-black animate-spin mb-4" />
            <span className="font-black uppercase tracking-widest text-sm">Syncing Data...</span>
          </motion.div>
        ) : error ? (
          <motion.div 
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border border-red-100 p-8 rounded-3xl text-center"
          >
            <ShieldAlert className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-900 mb-2">Access Denied or Error</h3>
            <p className="text-red-700">{error}</p>
          </motion.div>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {activeTab === 'overview' && data && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard label="Total Users" value={data.totalUsers} icon={Users} color="blue" />
                <StatCard label="Active Projects" value={data.totalProjects} icon={Globe} color="purple" />
                <StatCard label="Food Listings" value={data.totalFood} icon={MapPin} color="orange" />
                <StatCard label="Items in Exchange" value={data.totalItems} icon={ShoppingBag} color="green" />
                <StatCard label="Swap Requests" value={data.totalSwaps} icon={RefreshCw} color="indigo" />
                <StatCard label="Successful Dibs" value={data.claimedDibs} icon={CheckCircle2} color="emerald" />
              </div>
            )}

            {activeTab !== 'overview' && (
              <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        {getTableHeaders(activeTab).map(header => (
                          <th key={header} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                            {header}
                          </th>
                        ))}
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredData.map((item: any) => (
                        <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                          {renderRowCells(activeTab, item)}
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => handleDelete(item._id, activeTab.slice(0, -1))}
                              className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredData.length === 0 && (
                    <div className="py-24 text-center">
                      <p className="text-gray-400 font-medium">No records found matching your criteria.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: number; icon: any; color: string }> = ({ label, value, icon: Icon, color }) => (
  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform bg-${color}-50 text-${color}-600`}>
      <Icon className="w-6 h-6" />
    </div>
    <div className="text-4xl font-black tracking-tighter mb-1">{value}</div>
    <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">{label}</div>
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
  const cellClass = "px-6 py-4 text-sm font-medium text-gray-600";
  const boldClass = "px-6 py-4 text-sm font-bold text-black";
  
  switch (tab) {
    case 'users':
      return (
        <>
          <td className={boldClass}>{item.name}</td>
          <td className={cellClass}>{item.email}</td>
          <td className={cellClass}>
            <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
              item.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
            }`}>
              {item.role}
            </span>
          </td>
          <td className="px-6 py-4 text-xs font-mono text-gray-400">{new Date(item.createdAt).toLocaleDateString()}</td>
        </>
      );
    case 'projects':
      return (
        <>
          <td className={boldClass}>{item.title}</td>
          <td className={cellClass}>{item.ownerName}</td>
          <td className={cellClass}>{item.type}</td>
          <td className={cellClass}>
            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-black" style={{ width: `${item.completionPercentage}%` }} />
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
            <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
              item.claimedBy ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
            }`}>
              {item.claimedBy ? 'Claimed' : 'Available'}
            </span>
          </td>
          <td className="px-6 py-4 text-xs font-mono text-gray-400">{new Date(item.expiresAt).toLocaleDateString()}</td>
        </>
      );
    case 'items':
      return (
        <>
          <td className={boldClass}>{item.title}</td>
          <td className={cellClass}>{item.ownerName}</td>
          <td className={cellClass}>{item.category}</td>
          <td className={cellClass}>{item.status}</td>
        </>
      );
    case 'swaps':
      return (
        <>
          <td className="px-6 py-4 text-xs font-mono text-gray-400">{item.itemId}</td>
          <td className={cellClass}>{item.requesterName}</td>
          <td className={cellClass}>{item.ownerId}</td>
          <td className={cellClass}>{item.status}</td>
        </>
      );
    default: return null;
  }
};

export default Admin;
