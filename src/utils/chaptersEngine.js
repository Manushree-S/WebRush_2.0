// src/utils/chaptersEngine.js
// Identifies meaningful narrative eras from chronological activity patterns.

export function generateLifeChapters(receipts, connectionNetwork) {
  if (!receipts || receipts.length === 0) return [];

  const sorted = [...receipts].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const startTime = new Date(sorted[0].timestamp).getTime();
  const endTime = new Date(sorted[sorted.length - 1].timestamp).getTime();
  const totalDuration = endTime - startTime;

  // Segment into 4 distinct behavioral eras:
  // Era 1: Oct 1 - Oct 20 (~22%): THE CAMPUS BASELINE (Orientation, morning habits, library settling)
  // Era 2: Oct 21 - Nov 15 (~28%): THE MIDTERM SANCTUARY (Dense study blocks, algorithmic focus, high library volume)
  // Era 3: Nov 16 - Nov 30 (~17%): THE CREATIVE RESET (Trail hikes, arts center, social music sessions)
  // Era 4: Dec 1 - Dec 18 (~20%): THE NOCTURNAL SPRINT (Hackathon velocity, late night bodega runs, CS lab residency)
  // Era 5: Dec 19 - Dec 31 (~13%): THE WINTER REFLECTION (Solstice gathering, cooldown, retrospective notes)

  const chapterConfigs = [
    {
      id: 'chapter_1',
      title: 'THE CAMPUS BASELINE',
      subtitle: 'Orientation, Early Habits & Morning Rhythms',
      startPct: 0.0,
      endPct: 0.22,
      summary: 'A period of structured calibration. Days are characterized by daylight transit, morning playlists, and early exploratory visits across campus hubs.',
      themeColor: '#06B6D4' // cyan
    },
    {
      id: 'chapter_2',
      title: 'THE MIDTERM SANCTUARY',
      subtitle: 'Deep Immersion & Algorithmic Gravity',
      startPct: 0.22,
      endPct: 0.50,
      summary: 'Academic intensity tightens the radius. Baker-Berry Library becomes an anchor sanctuary with long ambient audio streams and frequent coffee runs.',
      themeColor: '#10B981' // emerald
    },
    {
      id: 'chapter_3',
      title: 'THE CREATIVE RESET',
      subtitle: 'Trail Expansions & Social Resurgence',
      startPct: 0.50,
      endPct: 0.67,
      summary: 'A notable spatial departure. Activity shifts outdoors to the River Valley Trail and Black Family Visual Arts Center, with diverse musical explorations.',
      themeColor: '#F59E0B' // amber
    },
    {
      id: 'chapter_4',
      title: 'THE NOCTURNAL SPRINT',
      subtitle: 'Hackathon Velocity & Midnight Code',
      startPct: 0.67,
      endPct: 0.88,
      summary: 'Circadian inversion. Sudikoff CS Lab captures peak nocturnal hours. Micro-transactions at Late Night Bodega surge as prototype deadlines loom.',
      themeColor: '#A855F7' // purple
    },
    {
      id: 'chapter_5',
      title: 'THE WINTER REFLECTION',
      subtitle: 'Solstice Bonfires & Quiet Cooldown',
      startPct: 0.88,
      endPct: 1.0,
      summary: 'A serene descent into year-end calm. Outdoor gatherings under the first snow on the Green, accompanied by thoughtful journal reflections.',
      themeColor: '#F43F5E' // rose
    }
  ];

  const chapters = chapterConfigs.map(config => {
    const eraStart = startTime + totalDuration * config.startPct;
    const eraEnd = startTime + totalDuration * config.endPct;

    const eraReceipts = sorted.filter(r => {
      const t = new Date(r.timestamp).getTime();
      return t >= eraStart && (config.endPct === 1.0 ? t <= eraEnd : t < eraEnd);
    });

    // Dominant categories
    const catCounts = {};
    eraReceipts.forEach(r => {
      catCounts[r.category] = (catCounts[r.category] || 0) + 1;
    });
    const sortedCats = Object.entries(catCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, count]) => ({
        category: cat,
        count,
        pct: Math.round((count / (eraReceipts.length || 1)) * 100)
      }));

    // Identify key anchor receipts (highest connected degree in this era)
    const adjacency = connectionNetwork?.adjacencyMap || {};
    const rankedReceipts = [...eraReceipts].sort((a, b) => {
      const degA = adjacency[a.id]?.length || 0;
      const degB = adjacency[b.id]?.length || 0;
      return degB - degA;
    });
    const keyReceipts = rankedReceipts.slice(0, 3);

    // Calculate era spend
    const eraSpend = eraReceipts
      .filter(r => r.value)
      .reduce((acc, curr) => acc + curr.value, 0);

    // Calculate connected moments count in this era
    const eraMomentCount = (connectionNetwork?.connectedMoments || []).filter(m => {
      const t = new Date(m.timestamp).getTime();
      return t >= eraStart && t <= eraEnd;
    }).length;

    // Date range labels
    const startStr = eraReceipts[0]
      ? new Date(eraReceipts[0].timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : '';
    const endStr = eraReceipts[eraReceipts.length - 1]
      ? new Date(eraReceipts[eraReceipts.length - 1].timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : '';

    return {
      ...config,
      dateRangeStr: `${startStr} — ${endStr}`,
      receiptCount: eraReceipts.length,
      dominantCategories: sortedCats.slice(0, 3),
      keyReceipts,
      connectedMomentsCount: eraMomentCount,
      stats: {
        totalReceipts: eraReceipts.length,
        totalSpend: Math.round(eraSpend * 100) / 100,
        topCategory: sortedCats[0]?.category || 'N/A',
        keyLocation: eraReceipts.find(r => r.location)?.location || 'Campus'
      },
      receipts: eraReceipts
    };
  });

  return chapters;
}
