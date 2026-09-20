// src/components/Explorer/ReceiptExplorer.jsx
import React, { useState, useMemo } from 'react';
import { CATEGORIES, filterReceipts } from '../../data/normalizedData';
import ReceiptCard from './ReceiptCard';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  ArrowUpDown, 
  MapPin, 
  Calendar,
  Layers,
  ChevronDown
} from 'lucide-react';
import ReceiptBadge from '../common/ReceiptBadge';

export default function ReceiptExplorer({
  receipts = [],
  adjacencyMap = {},
  initialCategory = 'ALL',
  initialLocation = 'ALL',
  initialSearch = '',
  initialReceiptIds = null,
  onSelectReceipt
}) {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [sortBy, setSortBy] = useState('NEWEST');
  const [visibleCount, setVisibleCount] = useState(24);

  // Extract distinct locations
  const locationsList = useMemo(() => {
    const locSet = new Set();
    receipts.forEach(r => {
      if (r.location) locSet.add(r.location);
    });
    return Array.from(locSet).sort();
  }, [receipts]);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts = { ALL: receipts.length };
    receipts.forEach(r => {
      counts[r.category] = (counts[r.category] || 0) + 1;
    });
    return counts;
  }, [receipts]);

  // Filtered receipts
  const filteredReceipts = useMemo(() => {
    let list = receipts;

    // If an explicit subset of IDs was provided (e.g. from an Insight trigger)
    if (initialReceiptIds && initialReceiptIds.length > 0) {
      const idSet = new Set(initialReceiptIds);
      list = list.filter(r => idSet.has(r.id));
    }

    let result = filterReceipts(list, {
      category: selectedCategory,
      searchQuery,
      location: selectedLocation,
      sortBy
    });

    // Special sort: Most connected
    if (sortBy === 'MOST_CONNECTED') {
      result.sort((a, b) => {
        const degA = adjacencyMap[a.id]?.length || 0;
        const degB = adjacencyMap[b.id]?.length || 0;
        return degB - degA;
      });
    }

    return result;
  }, [receipts, initialReceiptIds, selectedCategory, searchQuery, selectedLocation, sortBy, adjacencyMap]);

  const hasActiveFilters = selectedCategory !== 'ALL' || selectedLocation !== 'ALL' || searchQuery.trim() !== '' || initialReceiptIds !== null;

  const handleClearFilters = () => {
    setSelectedCategory('ALL');
    setSelectedLocation('ALL');
    setSearchQuery('');
    setSortBy('NEWEST');
  };

  const visibleReceipts = filteredReceipts.slice(0, visibleCount);

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#232D42] pb-6">
        <div>
          <h1 className="text-2xl font-bold font-mono tracking-tight text-white flex items-center gap-3">
            <span>RECEIPT EXPLORER</span>
            <span className="text-xs font-normal font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800 text-cyan-400">
              {filteredReceipts.length} of {receipts.length}
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Search, filter, and inspect granular moments of digital behavior.
          </p>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="self-start md:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/40 bg-rose-950/20 text-rose-300 text-xs font-mono hover:bg-rose-900/40 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Filter Controls Bar */}
      <div className="space-y-4">
        
        {/* Search & Sort Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, location, tag (#study, #focus), or query..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#232D42] bg-[#131A29] text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            )}
          </div>

          {/* Location Filter Dropdown */}
          <div className="md:col-span-3 relative">
            <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full appearance-none pl-10 pr-8 py-2.5 rounded-xl border border-[#232D42] bg-[#131A29] text-sm text-slate-200 focus:outline-none focus:border-cyan-500 font-mono cursor-pointer"
            >
              <option value="ALL">All Locations ({locationsList.length})</option>
              {locationsList.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Sort Dropdown */}
          <div className="md:col-span-3 relative">
            <ArrowUpDown className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none pl-10 pr-8 py-2.5 rounded-xl border border-[#232D42] bg-[#131A29] text-sm text-slate-200 focus:outline-none focus:border-cyan-500 font-mono cursor-pointer"
            >
              <option value="NEWEST">Sort: Newest First</option>
              <option value="OLDEST">Sort: Oldest First</option>
              <option value="MOST_CONNECTED">Sort: Most Connected</option>
              <option value="VALUE_HIGH">Sort: Highest Spend</option>
              <option value="CATEGORY">Sort: By Category</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan'
                : 'bg-[#131A29] text-slate-400 border border-[#232D42] hover:text-slate-200 hover:border-slate-600'
            }`}
          >
            ALL ({categoryCounts.ALL || 0})
          </button>

          {Object.values(CATEGORIES).map(cat => {
            const isSelected = selectedCategory === cat.key;
            const count = categoryCounts[cat.key] || 0;

            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                  isSelected
                    ? 'border-cyan-400 shadow-sm'
                    : 'border-[#232D42] bg-[#131A29] text-slate-400 hover:text-slate-200'
                }`}
                style={isSelected ? { backgroundColor: cat.bgLight, color: cat.color, borderColor: cat.color } : {}}
              >
                <span>{cat.label}</span>
                <span className="text-[10px] opacity-75 font-mono">({count})</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Receipts Grid */}
      {visibleReceipts.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleReceipts.map(receipt => {
              const connectedCount = adjacencyMap[receipt.id]?.length || 0;
              return (
                <ReceiptCard
                  key={receipt.id}
                  receipt={receipt}
                  connectedCount={connectedCount}
                  onClick={onSelectReceipt}
                />
              );
            })}
          </div>

          {/* Load More Pagination */}
          {visibleReceipts.length < filteredReceipts.length && (
            <div className="text-center pt-6">
              <button
                onClick={() => setVisibleCount(prev => prev + 24)}
                className="px-6 py-2.5 rounded-xl border border-cyan-500/40 bg-cyan-950/20 text-cyan-300 font-mono text-xs font-semibold hover:bg-cyan-900/30 transition-all hover:scale-105"
              >
                Load More Moments ({filteredReceipts.length - visibleReceipts.length} remaining)
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-[#232D42] bg-[#131A29]/50 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-mono font-bold text-slate-200">
              No matching life receipts found
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No fragments match your current filter combination. Try clearing your search query or switching categories.
            </p>
          </div>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 text-xs font-mono font-bold hover:bg-cyan-400 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}

    </div>
  );
}
