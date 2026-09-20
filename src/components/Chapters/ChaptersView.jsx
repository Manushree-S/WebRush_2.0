// src/components/Chapters/ChaptersView.jsx
import React from 'react';
import ChapterCard from './ChapterCard';
import { BookOpen, Sparkles, Layers } from 'lucide-react';

export default function ChaptersView({
  chapters = [],
  onExploreChapter,
  onSelectReceipt
}) {
  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="border-b border-[#232D42] pb-6 space-y-2">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-semibold tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>TEMPORAL PERIOD SEGMENTATION</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold font-mono tracking-tight text-white">
          LIFE CHAPTERS
        </h1>
        <p className="text-xs text-slate-400 max-w-2xl">
          Rather than arbitrary calendar months, the dataset is analyzed across continuous behavioral density, spatial shifts, and cognitive milestones to reconstruct five authentic life eras.
        </p>
      </div>

      {/* Chapters Timeline Stack */}
      <div className="space-y-6">
        {chapters.map(chapter => (
          <ChapterCard
            key={chapter.id}
            chapter={chapter}
            onExploreChapter={onExploreChapter}
            onSelectReceipt={onSelectReceipt}
          />
        ))}
      </div>

    </div>
  );
}
