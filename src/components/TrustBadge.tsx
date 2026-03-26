import React from 'react';
import { ShieldCheck, Award } from 'lucide-react';

interface TrustBadgeProps {
  rating: number;
  showLabel?: boolean;
  className?: string;
}

const TrustBadge: React.FC<TrustBadgeProps> = ({ rating, showLabel = true, className = "" }) => {
  let badge = {
    label: "Grey",
    color: "bg-gray-100 text-gray-500 border-gray-200",
    icon: ShieldCheck,
  };

  if (rating >= 5) {
    badge = {
      label: "Gold Tier",
      color: "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white border-yellow-300 shadow-lg shadow-yellow-500/20",
      icon: Award,
    };
  } else if (rating >= 4) {
    badge = {
      label: "Silver Tier",
      color: "bg-gradient-to-br from-slate-300 to-slate-500 text-white border-slate-200 shadow-lg shadow-slate-500/20",
      icon: Award,
    };
  } else if (rating >= 3) {
    badge = {
      label: "Bronze Tier",
      color: "bg-gradient-to-br from-orange-400 to-orange-600 text-white border-orange-300 shadow-lg shadow-orange-500/20",
      icon: Award,
    };
  }

  const Icon = badge.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${badge.color} ${className}`}>
      <Icon className="w-3 h-3" />
      {showLabel && <span>{badge.label}</span>}
    </div>
  );
};

export default TrustBadge;
