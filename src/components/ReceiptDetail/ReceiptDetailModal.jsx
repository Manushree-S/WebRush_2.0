// src/components/ReceiptDetail/ReceiptDetailModal.jsx
import React, { useEffect } from 'react';
import ReceiptBadge from '../common/ReceiptBadge';
import { formatReceiptDate, formatCurrency, formatFullDate } from '../../utils/formatters';
import { getReceiptConnections } from '../../utils/connectionEngine';
import { 
  X, 
  MapPin, 
  Share2, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Database,
  Calendar,
  Layers
} from 'lucide-react';

export default function ReceiptDetailModal({
  receipt,
  allReceipts = [],
  adjacencyMap = {},
  onClose,
  onSelectReceipt
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!receipt) return null;

  const { connectedCount, connections } = getReceiptConnections(receipt.id, adjacencyMap, allReceipts);

  // Generate contextual "Why This Matters" statement
  const generateWhyThisMatters = () => {
    if (connectedCount > 3) {
      return `This receipt represents an anchor nexus. It directly connects with ${connectedCount} other life moments occurring within a tight time window and physical radius, demonstrating a synchronized focus block.`;
    }
    if (receipt.category === 'MUSIC') {
      return `Audio playback logs like this synchronize closely with active research queries or quiet travel moments, serving as cognitive background texture throughout the day.`;
    }
    if (receipt.category === 'PURCHASES') {
      return `This micro-transaction corresponds directly to a physical transition or study fuel prior to a prolonged work session.`;
    }
    if (receipt.category === 'PLACES') {
      return `This location visit marks a grounding dwell period in your regular routine, capturing physical presence in key campus hubs.`;
    }
    return `Every individual digital fragment appears isolated until connected to adjacent sensory data across time and geography.`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      
      {/* Click backdrop to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-[#232D42] bg-[#131A29] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        
        {/* Receipt Perforated Top Header */}
        <div className="p-6 bg-[#0E1524] border-b border-[#232D42] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ReceiptBadge category={receipt.category} size="lg" />
            <span className="text-xs font-mono text-slate-400">
              ID: <code className="text-cyan-400">{receipt.id}</code>
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Main Title & Value */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-white leading-tight">
                {receipt.title}
              </h2>
              {receipt.value !== null && receipt.value !== undefined && (
                <span className="text-lg font-mono font-bold text-amber-400 bg-amber-950/40 border border-amber-500/40 px-3 py-1 rounded-xl shrink-0">
                  {formatCurrency(receipt.value)}
                </span>
              )}
            </div>

            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              {receipt.description}
            </p>
          </div>

          {/* Temporal & Spatial Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            <div className="p-3.5 rounded-xl bg-[#0E1524] border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>TIMESTAMP</span>
              </div>
              <p className="text-xs font-mono font-semibold text-slate-200">
                {formatReceiptDate(receipt.timestamp)}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0E1524] border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>SPATIAL LOCATION</span>
              </div>
              <p className="text-xs font-mono font-semibold text-slate-200 truncate">
                {receipt.location || 'Location not recorded'}
              </p>
            </div>

          </div>

          {/* "Why This Matters" Insight Box */}
          <div className="rounded-xl border border-cyan-900/40 bg-gradient-to-r from-cyan-950/20 to-purple-950/20 p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>WHY THIS MATTERS</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {generateWhyThisMatters()}
            </p>
          </div>

          {/* Metadata & Provenance */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-bold tracking-wider flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-slate-400" />
              <span>RAW METADATA & PROVENANCE:</span>
            </span>
            <div className="rounded-xl bg-[#0E1524] border border-slate-800 p-3.5 space-y-1.5 font-mono text-xs">
              {Object.entries(receipt.metadata || {}).map(([key, val]) => (
                <div key={key} className="flex items-start justify-between gap-4 py-0.5 border-b border-slate-800/50 last:border-0">
                  <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                  <span className="text-slate-200 text-right truncate max-w-[280px]">
                    {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          {receipt.tags && receipt.tags.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono uppercase text-slate-400 font-bold tracking-wider">
                TAGS:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {receipt.tags.map((t, idx) => (
                  <span key={idx} className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Connected Moments & Related Fragments */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>CONNECTED MOMENTS ({connectedCount})</span>
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                Click any moment to jump
              </span>
            </div>

            {connections.length > 0 ? (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {connections.slice(0, 6).map((c, idx) => (
                  <div
                    key={idx}
                    onClick={() => onSelectReceipt && onSelectReceipt(c.receipt)}
                    className="cursor-pointer rounded-xl border border-slate-800 bg-[#0E1524] p-3 hover:border-cyan-400 hover:bg-[#162133] transition-all space-y-1 group"
                  >
                    <div className="flex items-center justify-between">
                      <ReceiptBadge category={c.receipt.category} size="sm" />
                      <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                        <span>View</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-white group-hover:text-cyan-300 truncate">
                      {c.receipt.title}
                    </div>

                    <p className="text-[11px] text-slate-400 font-mono">
                      ↳ {c.reasons?.join(' · ')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#0E1524] border border-slate-800 text-center text-xs font-mono text-slate-500">
                No immediate temporal or spatial connections found for this isolated fragment.
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#0E1524] border-t border-[#232D42] flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Harmonized Kaggle Dataset Log</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors font-mono"
          >
            Close
          </button>
        </div>

      </div>

    </div>
  );
}
