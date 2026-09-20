// src/components/common/ReceiptBadge.jsx
import React from 'react';
import { CATEGORIES } from '../../data/normalizedData';
import { Music, MapPin, ShoppingBag, Calendar, Search, FileText, Sparkles } from 'lucide-react';

const ICON_MAP = {
  Music,
  MapPin,
  ShoppingBag,
  Calendar,
  Search,
  FileText
};

export default function ReceiptBadge({ category, size = 'md', className = '' }) {
  const cat = CATEGORIES[category] || {
    label: category,
    color: '#94A3B8',
    bgLight: 'rgba(148, 163, 184, 0.12)',
    border: 'rgba(148, 163, 184, 0.35)',
    textColor: 'text-slate-300',
    icon: 'Sparkles'
  };

  const IconComponent = ICON_MAP[cat.icon] || Sparkles;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold'
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-all ${sizeClasses[size]} ${className}`}
      style={{
        backgroundColor: cat.bgLight,
        borderColor: cat.border,
        color: cat.color
      }}
    >
      <IconComponent size={iconSizes[size]} className="shrink-0" />
      <span className="tracking-wide uppercase font-mono">{cat.label}</span>
    </span>
  );
}
