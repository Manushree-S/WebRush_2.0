// src/components/Story/StoryMode.jsx
import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  FileSearch, 
  Sparkles, 
  Share2, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import ReceiptCard from '../Explorer/ReceiptCard';

export default function StoryMode({
  scenes = [],
  onClose,
  onSelectReceipt
}) {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [showEvidence, setShowEvidence] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const scene = scenes[currentSceneIdx] || {};
  const isFinalScene = currentSceneIdx === scenes.length - 1;

  // Auto-play timer
  useEffect(() => {
    let timer = null;
    if (isPlaying && !showEvidence) {
      timer = setTimeout(() => {
        if (currentSceneIdx < scenes.length - 1) {
          setCurrentSceneIdx(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 7000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, currentSceneIdx, scenes.length, showEvidence]);

  // Trigger celebratory confetti on reaching final scene
  useEffect(() => {
    if (isFinalScene) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // graceful ignore
      }
    }
  }, [isFinalScene]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' && currentSceneIdx < scenes.length - 1) {
        setCurrentSceneIdx(prev => prev + 1);
        setShowEvidence(false);
      } else if (e.key === 'ArrowLeft' && currentSceneIdx > 0) {
        setCurrentSceneIdx(prev => prev - 1);
        setShowEvidence(false);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSceneIdx, scenes.length, onClose]);

  const handleNext = () => {
    if (currentSceneIdx < scenes.length - 1) {
      setCurrentSceneIdx(prev => prev + 1);
      setShowEvidence(false);
    }
  };

  const handlePrev = () => {
    if (currentSceneIdx > 0) {
      setCurrentSceneIdx(prev => prev - 1);
      setShowEvidence(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070B12]/95 backdrop-blur-xl flex flex-col justify-between overflow-y-auto">
      
      {/* Top Header Bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b border-[#232D42] bg-[#070B12]/90 backdrop-blur-md">
        
        {/* Story Breadcrumb */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-purple-950/60 border border-purple-700/50 text-purple-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>STORY MODE · SCENE {currentSceneIdx + 1} OF {scenes.length}</span>
          </div>
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">
            {scene.tagline}
          </span>
        </div>

        {/* Controls: Play/Pause, Close */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-colors ${
              isPlaying
                ? 'border-cyan-500 bg-cyan-950/50 text-cyan-300'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
            title={isPlaying ? 'Pause Auto-Advance' : 'Play Auto-Advance'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Auto-Play'}</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Exit Story Mode (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* Main Narrative Stage */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 flex flex-col justify-center space-y-8">
        
        {/* Progress Bar */}
        <div className="w-full flex items-center gap-2">
          {scenes.map((s, idx) => (
            <div
              key={idx}
              onClick={() => { setCurrentSceneIdx(idx); setShowEvidence(false); }}
              className={`h-1.5 flex-1 rounded-full cursor-pointer transition-all duration-300 ${
                idx === currentSceneIdx
                  ? 'bg-gradient-to-r from-cyan-400 to-purple-500'
                  : idx < currentSceneIdx
                  ? 'bg-cyan-700/60'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Big Poetic Quote */}
        <div className="space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 block">
            [ACT 0{scene.stepNumber}] {scene.tagline}
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-mono text-white tracking-tight leading-tight">
            {scene.quote}
          </h2>
        </div>

        {/* Narrative Prose */}
        <div className="rounded-2xl border border-[#232D42] bg-[#111726]/80 p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

          <p className="text-base sm:text-xl text-slate-200 font-sans leading-relaxed">
            {scene.narrative}
          </p>

          {/* Highlight Data Fact */}
          {scene.highlightFact && (
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#0B0F17] border border-cyan-900/40 text-xs font-mono text-cyan-300">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{scene.highlightFact}</span>
            </div>
          )}

          {/* Show Evidence Button */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/80">
            <button
              onClick={() => setShowEvidence(!showEvidence)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                showEvidence
                  ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan'
                  : 'bg-[#182236] border border-cyan-500/40 text-cyan-300 hover:bg-[#1E2B45]'
              }`}
            >
              <FileSearch className="w-4 h-4" />
              <span>{showEvidence ? 'HIDE SUPPORTING EVIDENCE' : `SHOW EVIDENCE (${scene.supportingReceipts?.length || 0} RECEIPTS)`}</span>
            </button>

            <span className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Kaggle Raw Data Grounding</span>
            </span>
          </div>
        </div>

        {/* Supporting Evidence Drawer (Expanded) */}
        {showEvidence && (
          <div className="rounded-2xl border border-cyan-500/30 bg-[#0E1524] p-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                  RAW DATA RECEIPTS PROVING THIS SCENE
                </span>
                <p className="text-xs text-slate-400">
                  {scene.evidenceContext}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
              {scene.supportingReceipts?.map(r => (
                <ReceiptCard
                  key={r.id}
                  receipt={r}
                  connectedCount={r.tags?.length || 1}
                  onClick={onSelectReceipt}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Bottom Sticky Navigation */}
      <div className="sticky bottom-0 z-20 flex items-center justify-between px-6 py-4 border-t border-[#232D42] bg-[#070B12]/90 backdrop-blur-md">
        
        <button
          onClick={handlePrev}
          disabled={currentSceneIdx === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 font-mono text-xs font-semibold hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Scene</span>
        </button>

        <div className="text-xs font-mono text-slate-400 hidden sm:block">
          Use Left/Right arrow keys to navigate
        </div>

        {isFinalScene ? (
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-slate-950 font-mono text-xs font-bold shadow-glow-cyan hover:opacity-90 transition-opacity"
          >
            <span>Complete Experience</span>
            <Sparkles className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold shadow-glow-cyan transition-colors"
          >
            <span>Next Scene</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

      </div>

    </div>
  );
}
