import React from 'react';
import { motion } from 'motion/react';
import { LocalResource } from '../types';
import { MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface LocalResourceCardProps {
  resource: LocalResource;
}

const LocalResourceCard: React.FC<LocalResourceCardProps> = ({ resource }) => {
  const getStatusStyles = () => {
    switch (resource.expiryStatus) {
      case 'fresh':
        return 'bg-green-50 text-green-600 border-green-100';
      case 'approaching':
        return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      case 'urgent':
        return 'bg-red-50 text-red-600 border-red-100';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
          <MapPin className="w-6 h-6" />
        </div>
        <div className="text-right">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Status</span>
          <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${getStatusStyles()}`}>
            {resource.expiryStatus}
          </span>
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
        {resource.title}
      </h3>
      <p className="text-sm text-gray-500 line-clamp-2 mb-6 leading-relaxed">
        {resource.description}
      </p>

      <div className="flex items-center gap-2 mb-6 text-xs text-gray-400 font-medium">
        <Clock className="w-4 h-4" />
        <span>Posted {formatDistanceToNow(new Date(resource.createdAt))} ago</span>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold">
            {resource.ownerName[0]}
          </div>
          <span className="text-xs font-bold text-gray-900">{resource.ownerName}</span>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-black text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-black/10">
          Dibs <CheckCircle2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default LocalResourceCard;
