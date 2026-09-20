// src/data/normalizedData.js
import rawData from './dataset.json' with { type: 'json' };

export const CATEGORIES = {
  MUSIC: {
    key: 'MUSIC',
    label: 'Music',
    icon: 'Music',
    color: '#06B6D4', // cyan-500
    bgLight: 'rgba(6, 182, 212, 0.12)',
    border: 'rgba(6, 182, 212, 0.35)',
    textColor: 'text-cyan-400',
    description: 'Audio playback, tracks, and listening sessions'
  },
  PLACES: {
    key: 'PLACES',
    label: 'Places',
    icon: 'MapPin',
    color: '#10B981', // emerald-500
    bgLight: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.35)',
    textColor: 'text-emerald-400',
    description: 'GPS clusters and semantic physical locations'
  },
  PURCHASES: {
    key: 'PURCHASES',
    label: 'Purchases',
    icon: 'ShoppingBag',
    color: '#F59E0B', // amber-500
    bgLight: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.35)',
    textColor: 'text-amber-400',
    description: 'Card transactions and everyday expenses'
  },
  EVENTS: {
    key: 'EVENTS',
    label: 'Events',
    icon: 'Calendar',
    color: '#A855F7', // purple-500
    bgLight: 'rgba(168, 85, 247, 0.12)',
    border: 'rgba(168, 85, 247, 0.35)',
    textColor: 'text-purple-400',
    description: 'Scheduled milestones, exams, and community gatherings'
  },
  SEARCHES: {
    key: 'SEARCHES',
    label: 'Searches',
    icon: 'Search',
    color: '#6366F1', // indigo-500
    bgLight: 'rgba(99, 102, 241, 0.12)',
    border: 'rgba(99, 102, 241, 0.35)',
    textColor: 'text-indigo-400',
    description: 'Digital inquiries, queries, and research trails'
  },
  NOTES: {
    key: 'NOTES',
    label: 'Notes',
    icon: 'FileText',
    color: '#F43F5E', // rose-500
    bgLight: 'rgba(244, 63, 94, 0.12)',
    border: 'rgba(244, 63, 94, 0.35)',
    textColor: 'text-rose-400',
    description: 'EMA reflections, focus journals, and mood prompts'
  }
};

/**
 * Validates and retrieves normalized receipts
 */
export function getReceipts() {
  return rawData.receipts || [];
}

/**
 * Returns dataset-level metadata and Kaggle provenance
 */
export function getDatasetMetadata() {
  return rawData.metadata || {};
}

/**
 * Looks up a single receipt by ID
 */
export function getReceiptById(id) {
  return rawData.receipts.find(r => r.id === id) || null;
}

/**
 * Filters receipts based on comprehensive criteria
 */
export function filterReceipts(receipts, {
  category = 'ALL',
  searchQuery = '',
  location = 'ALL',
  startDate = null,
  endDate = null,
  sortBy = 'NEWEST'
}) {
  let filtered = [...receipts];

  if (category && category !== 'ALL') {
    filtered = filtered.filter(r => r.category === category);
  }

  if (location && location !== 'ALL') {
    filtered = filtered.filter(r => r.location === location);
  }

  if (startDate) {
    const start = new Date(startDate).getTime();
    filtered = filtered.filter(r => new Date(r.timestamp).getTime() >= start);
  }

  if (endDate) {
    const end = new Date(endDate).getTime();
    filtered = filtered.filter(r => new Date(r.timestamp).getTime() <= end);
  }

  if (searchQuery && searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(r => {
      const matchTitle = (r.title || '').toLowerCase().includes(q);
      const matchDesc = (r.description || '').toLowerCase().includes(q);
      const matchLoc = (r.location || '').toLowerCase().includes(q);
      const matchTags = (r.tags || []).some(t => t.toLowerCase().includes(q));
      const matchCategory = (r.category || '').toLowerCase().includes(q);
      const matchMeta = JSON.stringify(r.metadata || {}).toLowerCase().includes(q);
      return matchTitle || matchDesc || matchLoc || matchTags || matchCategory || matchMeta;
    });
  }

  // Sorting
  if (sortBy === 'NEWEST') {
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } else if (sortBy === 'OLDEST') {
    filtered.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  } else if (sortBy === 'CATEGORY') {
    filtered.sort((a, b) => a.category.localeCompare(b.category));
  } else if (sortBy === 'VALUE_HIGH') {
    filtered.sort((a, b) => (b.value || 0) - (a.value || 0));
  }

  return filtered;
}

/**
 * Computes live, non-hardcoded dataset metrics
 */
export function calculateDatasetMetrics(receipts) {
  if (!receipts || receipts.length === 0) {
    return {
      totalReceipts: 0,
      categoryCounts: {},
      distinctDaysCount: 0,
      dateRange: { start: '', end: '' },
      totalSpend: 0,
      locationsCount: 0,
      topLocation: 'None'
    };
  }

  const categoryCounts = {};
  const activeDaysSet = new Set();
  const locationCounts = {};
  let totalSpend = 0;

  receipts.forEach(r => {
    // Categories
    categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;

    // Active days (YYYY-MM-DD)
    const dayStr = r.timestamp.substring(0, 10);
    activeDaysSet.add(dayStr);

    // Locations
    if (r.location) {
      locationCounts[r.location] = (locationCounts[r.location] || 0) + 1;
    }

    // Purchases
    if (r.value) {
      totalSpend += r.value;
    }
  });

  const sortedLocations = Object.entries(locationCounts).sort((a, b) => b[1] - a[1]);
  const topLocation = sortedLocations.length > 0 ? sortedLocations[0][0] : 'None';

  return {
    totalReceipts: receipts.length,
    categoryCounts,
    distinctDaysCount: activeDaysSet.size,
    dateRange: {
      start: receipts[0].timestamp,
      end: receipts[receipts.length - 1].timestamp
    },
    totalSpend: Math.round(totalSpend * 100) / 100,
    locationsCount: Object.keys(locationCounts).length,
    topLocation
  };
}
