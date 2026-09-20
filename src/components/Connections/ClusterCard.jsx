// src/components/Connections/ClusterCard.jsx
import React from 'react';
import ReceiptBadge from '../common/ReceiptBadge';
import { formatReceiptDate } from '../../utils/formatters';
import { Clock, MapPin, Sparkles, ArrowRight, ArrowDown } from 'lucide-react';

export default function ClusterCard({ moment, onSelectReceipt }) {
  return (
    <div className="rounded-2xl border border-[#232D42] bg-[#131A29] p-6 space-y-6 hover:border-cyan-500/40 transition-colors shadow-lg">
      
      {/* Moment Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800 text-cyan-400 text-[11px] font-mono font-semibold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>CONNECTED MOMENT</span>
          </div>
          <h3 className="text-lg font-bold font-mono text-white">
            {moment.title}
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{moment.spanMinutes} mins total span</span>
          </div>
          {moment.location && (
            <div className="flex items-center gap-1 text-emerald-400">
              <MapPin className="w-3.5 h-3.5" />
              <span>{moment.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Explanatory Data-Based Statement */}
      <div className="rounded-xl bg-[#0E1524] border border-cyan-900/40 p-4 space-y-1.5">
        <span className="text-[11px] font-mono uppercase text-cyan-400 font-bold tracking-wide">
          WHY THESE ARE CONNECTED (DATA EVIDENCE):
        </span>
        <ul className="space-y-1 text-xs text-slate-300">
          {moment.reasons.map((reason, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-cyan-400 font-mono mt-0.5">↳</span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Connected Receipts Chain */}
      <div className="space-y-3">
        <div className="text-xs font-mono uppercase text-slate-400 tracking-wider">
          CONVERGING RECEIPTS ({moment.receipts.length})
        </div>

        {/* Desktop Horizontal Chain / Mobile Vertical Flow */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 overflow-x-auto pb-2">
          {moment.receipts.map((receipt, i) => (
            <React.Fragment key={receipt.id}>
              
              {/* Receipt Node Card */}
              <div
                onClick={() => onSelectReceipt && onSelectReceipt(receipt)}
                className="flex-1 min-w-[200px] cursor-pointer rounded-xl border border-[#232D42] bg-[#0E1524] p-3.5 space-y-2 hover:border-cyan-400 hover:bg-[#162133] transition-all group"
              >
                <div className="flex items-center justify-between">
                  <ReceiptBadge category={receipt.category} size="sm" />
                  <span className="text-[10px] font-mono text-slate-500">
                    {receipt.timestamp ? new Date(receipt.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>

                <div className="text-xs font-semibold text-white group-hover:text-cyan-300 line-clamp-1">
                  {receipt.title}
                </div>

                <div className="text-[11px] text-slate-400 line-clamp-1">
                  {receipt.location || receipt.description}
                </div>
              </div>

              {/* Connector Arrow */}
              {i < moment.receipts.length - 1 && (
                <div className="shrink-0 flex items-center justify-center text-cyan-500/60 sm:rotate-0 rotate-90 my-1 sm:my-0">
                  <ArrowRight className="w-4 h-4 hidden sm:block" />
                  <ArrowDown className="w-4 h-4 block sm:hidden" />
                </div>
              )}

            </React.Fragment>
          ))}
        </div>
      </div>

    </div>
  );
}
