// src/utils/connectionEngine.js
// Client-side Connection Engine for LIFE//RECEIPTS
// Discovers genuine relationships: Temporal, Location, Thematic (Tags), and Category Co-occurrence.

/**
 * Calculates time difference in minutes between two ISO timestamps
 */
function getMinuteDiff(t1, t2) {
  const d1 = new Date(t1).getTime();
  const d2 = new Date(t2).getTime();
  return Math.abs(d1 - d2) / (1000 * 60);
}

/**
 * Checks for shared tags between two receipt tag arrays
 */
function getSharedTags(tagsA = [], tagsB = []) {
  if (!tagsA || !tagsB) return [];
  const setB = new Set(tagsB.map(t => t.toLowerCase()));
  return tagsA.filter(t => setB.has(t.toLowerCase()));
}

/**
 * Discovers pairwise connections and groups them into "Connected Moments"
 */
export function buildConnectionNetwork(receipts) {
  if (!receipts || receipts.length === 0) {
    return {
      nodes: [],
      links: [],
      connectedMoments: [],
      adjacencyMap: {}
    };
  }

  const nodes = receipts.map(r => ({
    id: r.id,
    title: r.title,
    category: r.category,
    timestamp: r.timestamp,
    location: r.location,
    value: r.value,
    tags: r.tags
  }));

  const links = [];
  const adjacencyMap = {};
  receipts.forEach(r => {
    adjacencyMap[r.id] = [];
  });

  // Evaluate pairs
  const TEMPORAL_WINDOW_MINUTES = 60; // 1 hour max for direct tight moment connection

  for (let i = 0; i < receipts.length; i++) {
    const a = receipts[i];
    for (let j = i + 1; j < receipts.length; j++) {
      const b = receipts[j];
      const minuteDiff = getMinuteDiff(a.timestamp, b.timestamp);

      // If beyond 2 hours in chronological list, break inner loop optimization
      if (minuteDiff > 120 && new Date(b.timestamp) > new Date(a.timestamp)) {
        // Can safely break if receipts are sorted by timestamp
        // but to be safe against non-sorted input, we continue
      }

      const connectionReasons = [];
      let weight = 0;

      // 1. Temporal closeness
      if (minuteDiff <= TEMPORAL_WINDOW_MINUTES) {
        connectionReasons.push(`Occurred within ${Math.round(minuteDiff)} minutes of each other`);
        weight += (60 - minuteDiff) / 60 * 3; // higher weight for tighter moments
      }

      // 2. Location co-occurrence
      if (a.location && b.location && a.location.toLowerCase() === b.location.toLowerCase()) {
        if (minuteDiff <= 180) { // Same location within 3 hours
          connectionReasons.push(`Co-located at "${a.location}"`);
          weight += 3;
        }
      }

      // 3. Thematic / Tag overlap
      const sharedTags = getSharedTags(a.tags, b.tags);
      if (sharedTags.length > 0 && minuteDiff <= 360) {
        connectionReasons.push(`Shared context tags: #${sharedTags.slice(0, 3).join(', #')}`);
        weight += sharedTags.length * 1.5;
      }

      // If meaningful connection exists
      if (connectionReasons.length > 0 && weight >= 2) {
        const link = {
          source: a.id,
          target: b.id,
          weight: Math.round(weight * 10) / 10,
          minuteDiff: Math.round(minuteDiff),
          reasons: connectionReasons
        };
        links.push(link);

        adjacencyMap[a.id].push({
          targetId: b.id,
          targetReceipt: b,
          reasons: connectionReasons,
          weight
        });

        adjacencyMap[b.id].push({
          targetId: a.id,
          targetReceipt: a,
          reasons: connectionReasons,
          weight
        });
      }
    }
  }

  // Group into cohesive multi-receipt "Connected Moments" (Clusters)
  const connectedMoments = clusterIntoConnectedMoments(receipts, adjacencyMap);

  return {
    nodes,
    links,
    connectedMoments,
    adjacencyMap
  };
}

/**
 * Discovers cohesive clusters where 3+ receipts converge in time and space
 */
function clusterIntoConnectedMoments(receipts, adjacencyMap) {
  const sorted = [...receipts].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const moments = [];
  const processedInCluster = new Set();

  for (let i = 0; i < sorted.length; i++) {
    const root = sorted[i];
    if (processedInCluster.has(root.id)) continue;

    // Look for receipts within 75 minutes of root that share location or have mutual links
    const candidateCluster = [root];
    const rootTime = new Date(root.timestamp).getTime();

    for (let j = i + 1; j < sorted.length; j++) {
      const candidate = sorted[j];
      const diffMins = (new Date(candidate.timestamp).getTime() - rootTime) / (1000 * 60);
      if (diffMins > 90) break; // passed temporal horizon

      // Check if candidate is connected to root or has same location
      const isLinkedToRoot = adjacencyMap[root.id]?.some(edge => edge.targetId === candidate.id);
      const isSameLocation = root.location && candidate.location && root.location === candidate.location;

      if (isLinkedToRoot || isSameLocation) {
        candidateCluster.push(candidate);
      }
    }

    if (candidateCluster.length >= 3) {
      // Meaningful connected moment identified!
      candidateCluster.forEach(c => processedInCluster.add(c.id));

      const firstTime = new Date(candidateCluster[0].timestamp);
      const lastTime = new Date(candidateCluster[candidateCluster.length - 1].timestamp);
      const spanMinutes = Math.round((lastTime.getTime() - firstTime.getTime()) / (1000 * 60));

      const distinctCategories = Array.from(new Set(candidateCluster.map(c => c.category)));
      const sharedLoc = candidateCluster.find(c => c.location)?.location || 'Active Radius';

      // Generate accurate, data-backed explanation
      const reasons = [];
      reasons.push(`${candidateCluster.length} life moments occurred within a ${spanMinutes}-minute span.`);
      if (candidateCluster.every(c => c.location && c.location === sharedLoc)) {
        reasons.push(`All receipts converged physically at "${sharedLoc}".`);
      } else {
        reasons.push(`Co-anchored around ${sharedLoc}.`);
      }
      reasons.push(`Fused ${distinctCategories.length} distinct categories: ${distinctCategories.join(' + ')}.`);

      moments.push({
        id: `moment_${root.id}`,
        title: `${distinctCategories.join(' → ')} Moment`,
        subtitle: `Anchor: ${sharedLoc}`,
        timestamp: root.timestamp,
        spanMinutes,
        location: sharedLoc,
        categories: distinctCategories,
        receipts: candidateCluster,
        reasons
      });
    }
  }

  // Sort moments by size and chronological recency
  return moments.sort((a, b) => b.receipts.length - a.receipts.length);
}

/**
 * Returns connection degree and details for a specific receipt
 */
export function getReceiptConnections(receiptId, adjacencyMap, receipts) {
  if (!adjacencyMap || !adjacencyMap[receiptId]) {
    return {
      connectedCount: 0,
      connections: [],
      sharedReasons: []
    };
  }

  const rawEdges = adjacencyMap[receiptId] || [];
  const connections = rawEdges.map(edge => ({
    receipt: edge.targetReceipt || receipts.find(r => r.id === edge.targetId),
    reasons: edge.reasons,
    weight: edge.weight
  })).filter(c => Boolean(c.receipt));

  return {
    connectedCount: connections.length,
    connections: connections.sort((a, b) => b.weight - a.weight)
  };
}
