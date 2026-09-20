// src/components/Connections/ConnectionEngineView.jsx
import React, { useState } from 'react';
import NetworkGraph from './NetworkGraph';
import ClusterCard from './ClusterCard';
import { CATEGORIES } from '../../data/normalizedData';
import { 
  Share2, 
  Layers, 
  GitMerge, 
  Clock, 
  MapPin, 
  Tag, 
  SlidersHorizontal 
} from 'lucide-react';

export default function ConnectionEngineView({
  connectionNetwork,
  receipts = [],
  onSelectReceipt
}) {
  const [activeViewMode, setActiveViewMode] = useState('graph'); // 'graph' | 'clusters'
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const { nodes = [], links = [], connectedMoments = [] } = connectionNetwork;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Title & Philosophy Callout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#232D42] pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-semibold tracking-wider mb-1">
            <Share2 className="w-4 h-4" />
            <span>PRIMARY DIFFERENTIATOR · THE CONNECTION ENGINE</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-mono tracking-tight text-white">
            RELATIONSHIP & CLUSTER ARCHAEOLOGY
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Detecting hidden multi-dimensional links across time, physical co-location, shared context tags, and category co-occurrences.
          </p>
        </div>

        {/* View Switcher Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-[#131A29] border border-[#232D42]">
          <button
            onClick={() => setActiveViewMode('graph')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeViewMode === 'graph'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitMerge className="w-3.5 h-3.5" />
            <span>Network Graph</span>
          </button>

          <button
            onClick={() => setActiveViewMode('clusters')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeViewMode === 'clusters'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Connected Moments ({connectedMoments.length})</span>
          </button>
        </div>
      </div>

      {/* Connection Engine Rule Taxonomy Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-slate-800 bg-[#131A29]/70 space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>TEMPORAL PROXIMITY</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Links records occurring within $\le 45-60$ minutes of each other.
          </p>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-800 bg-[#131A29]/70 space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold">
            <MapPin className="w-3.5 h-3.5" />
            <span>SPATIAL CO-LOCATION</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Identifies moments recorded in the exact same campus or venue hub.
          </p>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-800 bg-[#131A29]/70 space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold">
            <Tag className="w-3.5 h-3.5" />
            <span>THEMATIC & TAG OVERLAP</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Correlates contextual tokens like #focus, #deepwork, and #late-night.
          </p>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-800 bg-[#131A29]/70 space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold">
            <Layers className="w-3.5 h-3.5" />
            <span>CROSS-CATEGORY FUSION</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Binds Music + Place + Purchase into a single human experience.
          </p>
        </div>
      </div>

      {/* View Content */}
      {activeViewMode === 'graph' ? (
        <div className="space-y-4">
          {/* Category Filter for Graph */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-400 mr-2 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" /> Filter Graph:
            </span>
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1 rounded-md text-xs font-mono transition-all ${
                selectedCategory === 'ALL'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-[#131A29] text-slate-400 border border-[#232D42]'
              }`}
            >
              All Categories
            </button>
            {Object.values(CATEGORIES).map(cat => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1 rounded-md text-xs font-mono transition-all border ${
                  selectedCategory === cat.key
                    ? 'border-cyan-400 font-bold'
                    : 'border-[#232D42] bg-[#131A29] text-slate-400 hover:text-slate-200'
                }`}
                style={selectedCategory === cat.key ? { color: cat.color, backgroundColor: cat.bgLight } : {}}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <NetworkGraph
            nodes={nodes}
            links={links}
            selectedCategory={selectedCategory}
            onSelectReceipt={onSelectReceipt}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>DISCOVERED MULTI-RECEIPT CONVERGENCES ({connectedMoments.length})</span>
            <span>Sorted by cluster density</span>
          </div>

          <div className="space-y-4">
            {connectedMoments.map(moment => (
              <ClusterCard
                key={moment.id}
                moment={moment}
                onSelectReceipt={onSelectReceipt}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
