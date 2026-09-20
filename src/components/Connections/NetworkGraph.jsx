// src/components/Connections/NetworkGraph.jsx
import React, { useState, useMemo, useRef } from 'react';
import { CATEGORIES } from '../../data/normalizedData';
import { ZoomIn, ZoomOut, RotateCcw, Info, Sparkles } from 'lucide-react';

export default function NetworkGraph({
  nodes = [],
  links = [],
  onSelectReceipt,
  selectedCategory = 'ALL'
}) {
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Filter nodes & links for graph performance and category focus
  // We take the top connected 45 nodes for smooth SVG rendering and legibility
  const displayData = useMemo(() => {
    let filteredNodes = nodes;
    if (selectedCategory !== 'ALL') {
      filteredNodes = nodes.filter(n => n.category === selectedCategory);
    }

    // Rank by degree
    const nodeDegree = {};
    links.forEach(l => {
      nodeDegree[l.source] = (nodeDegree[l.source] || 0) + 1;
      nodeDegree[l.target] = (nodeDegree[l.target] || 0) + 1;
    });

    const topNodes = [...filteredNodes]
      .sort((a, b) => (nodeDegree[b.id] || 0) - (nodeDegree[a.id] || 0))
      .slice(0, 48);

    const topNodeIds = new Set(topNodes.map(n => n.id));
    const activeLinks = links.filter(l => topNodeIds.has(l.source) && topNodeIds.has(l.target));

    // Calculate layout coordinates (circular / radial cluster layout)
    const width = 850;
    const height = 550;
    const centerX = width / 2;
    const centerY = height / 2;

    const nodeCoords = {};
    const total = topNodes.length;

    topNodes.forEach((node, i) => {
      // Golden spiral distribution with category clustering
      const angle = i * 2.399963; // golden angle
      const radius = Math.min(centerX, centerY) * 0.78 * Math.sqrt((i + 1) / total);
      
      nodeCoords[node.id] = {
        ...node,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        degree: nodeDegree[node.id] || 1
      };
    });

    return {
      nodes: Object.values(nodeCoords),
      nodeMap: nodeCoords,
      links: activeLinks
    };
  }, [nodes, links, selectedCategory]);

  // Compute set of connected nodes to currently hovered node
  const activeConnectedSet = useMemo(() => {
    if (!hoveredNodeId) return null;
    const set = new Set([hoveredNodeId]);
    displayData.links.forEach(l => {
      if (l.source === hoveredNodeId) set.add(l.target);
      if (l.target === hoveredNodeId) set.add(l.source);
    });
    return set;
  }, [hoveredNodeId, displayData.links]);

  // Pan interaction
  const handleMouseDown = (e) => {
    if (e.target.tagName === 'circle' || e.target.tagName === 'text') return;
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    setPanOffset({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="relative rounded-2xl border border-[#232D42] bg-[#0E1524] overflow-hidden shadow-2xl">
      
      {/* Top Overlay Legend & Controls */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#131A29]/90 border border-[#232D42] backdrop-blur-md text-xs font-mono text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Interactive Life Graph ({displayData.nodes.length} nodes · {displayData.links.length} edges)</span>
        </div>

        {/* Zoom Controls */}
        <div className="pointer-events-auto flex items-center gap-1 p-1 rounded-lg bg-[#131A29]/90 border border-[#232D42] backdrop-blur-md">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 2.2))}
            className="p-1.5 rounded text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.6))}
            className="p-1.5 rounded text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setZoomLevel(1); setPanOffset({ x: 0, y: 0 }); }}
            className="p-1.5 rounded text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* SVG Canvas */}
      <div
        className="w-full h-[580px] cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          viewBox="0 0 850 550"
          className="w-full h-full"
        >
          <g transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoomLevel})`}>
            
            {/* Draw Links */}
            {displayData.links.map((link, i) => {
              const src = displayData.nodeMap[link.source];
              const tgt = displayData.nodeMap[link.target];
              if (!src || !tgt) return null;

              const isHighlighted = activeConnectedSet && activeConnectedSet.has(link.source) && activeConnectedSet.has(link.target);
              const isDimmed = activeConnectedSet && !isHighlighted;

              return (
                <line
                  key={`link_${i}`}
                  x1={src.x}
                  y1={src.y}
                  x2={tgt.x}
                  y2={tgt.y}
                  stroke={isHighlighted ? '#06B6D4' : '#232D42'}
                  strokeWidth={isHighlighted ? 2.5 : Math.max(1, link.weight * 0.4)}
                  strokeOpacity={isDimmed ? 0.08 : isHighlighted ? 0.9 : 0.4}
                  strokeDasharray={link.minuteDiff <= 45 ? 'none' : '3,3'}
                  className="transition-all duration-300"
                />
              );
            })}

            {/* Draw Nodes */}
            {displayData.nodes.map(node => {
              const cat = CATEGORIES[node.category] || { color: '#94A3B8' };
              const isHovered = hoveredNodeId === node.id;
              const isConnected = activeConnectedSet && activeConnectedSet.has(node.id);
              const isDimmed = activeConnectedSet && !isConnected;

              // Node radius based on degree
              const r = 9 + Math.min(node.degree * 1.2, 16);

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  onClick={() => onSelectReceipt && onSelectReceipt(node)}
                >
                  {/* Outer pulse circle when hovered */}
                  {isHovered && (
                    <circle
                      r={r + 8}
                      fill="none"
                      stroke={cat.color}
                      strokeWidth={2}
                      opacity={0.6}
                      className="animate-ping"
                    />
                  )}

                  {/* Main Circle */}
                  <circle
                    r={r}
                    fill={cat.color}
                    fillOpacity={isDimmed ? 0.2 : 0.85}
                    stroke={isHovered ? '#FFFFFF' : '#0B0F17'}
                    strokeWidth={isHovered ? 3 : 2}
                    className="transition-all duration-200"
                  />

                  {/* Node label on hover */}
                  {(isHovered || node.degree >= 6) && (
                    <text
                      y={r + 14}
                      textAnchor="middle"
                      fill={isHovered ? '#FFFFFF' : '#94A3B8'}
                      fontSize={isHovered ? 11 : 9}
                      fontFamily="monospace"
                      fontWeight={isHovered ? 'bold' : 'normal'}
                      className="pointer-events-none"
                    >
                      {node.title.length > 20 ? `${node.title.substring(0, 18)}...` : node.title}
                    </text>
                  )}
                </g>
              );
            })}

          </g>
        </svg>
      </div>

      {/* Bottom helper tip */}
      <div className="p-3 bg-[#131A29] border-t border-[#232D42] flex items-center justify-between text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>Click any node to inspect its receipt fragment · Hover to trace connected lines</span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" /> Music
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Places
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Purchases
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" /> Events
          </span>
        </div>
      </div>

    </div>
  );
}
