import React from 'react';
import { motion } from 'motion/react';
import { ResearchProject } from '../types';
import { Globe, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface ResearchCardProps {
  project: ResearchProject;
}

const ResearchCard: React.FC<ResearchCardProps> = ({ project }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
          <Globe className="w-6 h-6" />
        </div>
        <div className="text-right">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Completion</span>
          <span className="text-xl font-black text-blue-600">{project.completionPercentage}%</span>
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
        {project.title}
      </h3>
      <p className="text-sm text-gray-500 line-clamp-2 mb-6 leading-relaxed">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        <span className="px-3 py-1 bg-gray-50 text-[10px] font-bold uppercase tracking-wider rounded-full text-gray-500 border border-gray-100">
          {project.location}
        </span>
        <span className="px-3 py-1 bg-orange-50 text-[10px] font-bold uppercase tracking-wider rounded-full text-orange-600 border border-orange-100">
          {project.missingLink}
        </span>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold">
            {project.ownerName[0]}
          </div>
          <span className="text-xs font-bold text-gray-900">{project.ownerName}</span>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors">
          Request Handoff <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default ResearchCard;
