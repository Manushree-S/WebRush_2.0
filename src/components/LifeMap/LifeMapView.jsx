// src/components/LifeMap/LifeMapView.jsx
import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import ReceiptBadge from '../common/ReceiptBadge';
import { formatReceiptDate } from '../../utils/formatters';
import { MapPin, Navigation, Clock, Layers, Share2, Compass } from 'lucide-react';

export default function LifeMapView({
  receipts = [],
  connectionNetwork,
  onSelectReceipt
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const [selectedLocationName, setSelectedLocationName] = useState('Baker-Berry Library');

  // Extract unique locations with coordinates and receipts
  const locationsData = useMemo(() => {
    const map = {};
    receipts.forEach(r => {
      if (r.location && r.coordinates) {
        if (!map[r.location]) {
          map[r.location] = {
            name: r.location,
            coordinates: r.coordinates,
            receipts: [],
            categoryCounts: {}
          };
        }
        map[r.location].receipts.push(r);
        map[r.location].categoryCounts[r.category] = (map[r.location].categoryCounts[r.category] || 0) + 1;
      }
    });
    return Object.values(map).sort((a, b) => b.receipts.length - a.receipts.length);
  }, [receipts]);

  const activeLocation = useMemo(() => {
    return locationsData.find(l => l.name === selectedLocationName) || locationsData[0] || null;
  }, [locationsData, selectedLocationName]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || locationsData.length === 0) return;

    if (!mapInstanceRef.current) {
      // Hanover / Dartmouth campus center coordinates
      const initialLat = 43.7050;
      const initialLng = -72.2887;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 15,
        zoomControl: true,
        attributionControl: false
      });

      // CartoDB Dark Matter tiles (sleek, high-contrast dark theme matching digital archaeology aesthetic)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear old markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    // Add custom styled circular markers for locations
    locationsData.forEach(loc => {
      const isSelected = loc.name === selectedLocationName;
      const count = loc.receipts.length;

      // Custom HTML Marker Icon
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            position: relative;
            width: ${isSelected ? '36px' : '28px'};
            height: ${isSelected ? '36px' : '28px'};
            background: ${isSelected ? '#06B6D4' : '#131A29'};
            border: 2px solid ${isSelected ? '#FFFFFF' : '#06B6D4'};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${isSelected ? '#090D16' : '#FFFFFF'};
            font-family: monospace;
            font-size: ${isSelected ? '12px' : '10px'};
            font-weight: bold;
            box-shadow: 0 0 15px rgba(6, 182, 212, 0.5);
            transition: all 0.2s ease;
            cursor: pointer;
          ">
            ${count}
          </div>
        `,
        iconSize: [isSelected ? 36 : 28, isSelected ? 36 : 28],
        iconAnchor: [isSelected ? 18 : 14, isSelected ? 18 : 14]
      });

      const marker = L.marker([loc.coordinates.lat, loc.coordinates.lng], { icon: customIcon })
        .addTo(map)
        .on('click', () => {
          setSelectedLocationName(loc.name);
          map.flyTo([loc.coordinates.lat, loc.coordinates.lng], 16, { duration: 1 });
        });

      marker.bindTooltip(`<b>${loc.name}</b><br/>${count} moments`, {
        direction: 'top',
        className: 'bg-slate-900 text-slate-100 font-mono text-xs px-2 py-1 rounded border border-slate-700'
      });

      markersRef.current.push(marker);
    });

  }, [locationsData, selectedLocationName]);

  return (
    <div className="space-y-6 pb-16">
      
      {/* Title */}
      <div className="border-b border-[#232D42] pb-6 space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase font-semibold tracking-wider">
          <Navigation className="w-4 h-4" />
          <span>GEOGRAPHIC & CAMPUS SPATIAL LOG</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold font-mono tracking-tight text-white">
          THE LIFE MAP
        </h1>
        <p className="text-xs text-slate-400 max-w-2xl">
          Visualizing real GPS clusters from the Dartmouth StudentLife dataset. Click markers or select from the location hub list below to inspect venue residency and category moments.
        </p>
      </div>

      {/* Main Layout: Map Canvas + Location Inspector Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Map View Container */}
        <div className="lg:col-span-8 rounded-2xl border border-[#232D42] overflow-hidden bg-[#0E1524] h-[550px] relative shadow-2xl">
          <div ref={mapContainerRef} className="w-full h-full z-0" />

          {/* Quick Map Legend Overlay */}
          <div className="absolute bottom-4 left-4 z-10 p-3 rounded-xl bg-[#131A29]/90 border border-[#232D42] backdrop-blur-md text-[11px] font-mono text-slate-300 space-y-1">
            <div className="text-cyan-400 font-bold flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>DARTMOUTH & UPPER VALLEY REGION</span>
            </div>
            <p className="text-slate-400">
              Numbers indicate verified sensor-derived life fragments.
            </p>
          </div>
        </div>

        {/* Location Details Sidebar */}
        <div className="lg:col-span-4 rounded-2xl border border-[#232D42] bg-[#131A29] p-6 space-y-6 flex flex-col justify-between max-h-[550px] overflow-y-auto">
          {activeLocation ? (
            <div className="space-y-5">
              
              {/* Location Title & Coordinates */}
              <div className="space-y-1 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>SELECTED SPATIAL ANCHOR</span>
                </div>
                <h3 className="text-lg font-bold font-mono text-white leading-tight">
                  {activeLocation.name}
                </h3>
                <p className="text-[11px] font-mono text-slate-500">
                  {activeLocation.coordinates.lat.toFixed(4)}° N, {Math.abs(activeLocation.coordinates.lng).toFixed(4)}° W
                </p>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#0E1524] border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Recorded Logs</span>
                  <span className="text-xl font-bold font-mono text-cyan-400">{activeLocation.receipts.length}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#0E1524] border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Channels</span>
                  <span className="text-xl font-bold font-mono text-purple-400">
                    {Object.keys(activeLocation.categoryCounts).length}
                  </span>
                </div>
              </div>

              {/* Category Breakdown at this Location */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">
                  ACTIVITIES AT THIS VENUE:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(activeLocation.categoryCounts).map(([catKey, count]) => (
                    <div key={catKey} className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#0E1524] border border-slate-800 text-[11px] font-mono">
                      <ReceiptBadge category={catKey} size="sm" />
                      <span className="text-slate-300 font-bold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chronological Moments Here */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">
                  MOMENTS LOGGED AT THIS VENUE:
                </span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {activeLocation.receipts.slice(0, 8).map(r => (
                    <div
                      key={r.id}
                      onClick={() => onSelectReceipt && onSelectReceipt(r)}
                      className="cursor-pointer p-2.5 rounded-lg border border-slate-800 bg-[#0E1524] hover:border-cyan-400 hover:bg-[#162133] transition-all group"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <ReceiptBadge category={r.category} size="sm" />
                        <span className="text-slate-500">
                          {r.timestamp ? new Date(r.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-white group-hover:text-cyan-300 truncate mt-1">
                        {r.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center text-xs font-mono text-slate-400 py-8">
              Select a location to inspect
            </div>
          )}

          {/* Quick Location Switcher Buttons */}
          <div className="border-t border-slate-800 pt-3">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider block mb-2">
              ALL HUBS ({locationsData.length}):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {locationsData.map(loc => (
                <button
                  key={loc.name}
                  onClick={() => setSelectedLocationName(loc.name)}
                  className={`text-[10px] font-mono px-2 py-1 rounded transition-colors ${
                    loc.name === selectedLocationName
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-[#0E1524] border border-slate-800 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {loc.name.split(' ')[0]} ({loc.receipts.length})
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
