// src/App.jsx
import React, { useState, useMemo } from 'react';
import { 
  getReceipts, 
  getDatasetMetadata, 
  calculateDatasetMetrics 
} from './data/normalizedData';
import { buildConnectionNetwork } from './utils/connectionEngine';
import { generateDatasetInsights } from './utils/insightsEngine';
import { generateLifeChapters } from './utils/chaptersEngine';
import { generateStoryScenes } from './utils/storyEngine';

// Components
import Header from './components/common/Header';
import LifeOverview from './components/Overview/LifeOverview';
import ReceiptExplorer from './components/Explorer/ReceiptExplorer';
import ConnectionEngineView from './components/Connections/ConnectionEngineView';
import InsightsView from './components/Insights/InsightsView';
import ChaptersView from './components/Chapters/ChaptersView';
import StoryMode from './components/Story/StoryMode';
import LifeMapView from './components/LifeMap/LifeMapView';
import ReceiptDetailModal from './components/ReceiptDetail/ReceiptDetailModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isStoryModeOpen, setIsStoryModeOpen] = useState(false);

  // Explorer filter states passed from other views
  const [explorerFilterState, setExplorerFilterState] = useState({
    category: 'ALL',
    location: 'ALL',
    searchQuery: '',
    receiptIds: null
  });

  // 1. Raw Dataset & Metrics
  const rawReceipts = useMemo(() => getReceipts(), []);
  const metadata = useMemo(() => getDatasetMetadata(), []);
  const metrics = useMemo(() => calculateDatasetMetrics(rawReceipts), [rawReceipts]);

  // 2. Connection Network (Graph, Adjacency, Connected Moments)
  const connectionNetwork = useMemo(() => {
    return buildConnectionNetwork(rawReceipts);
  }, [rawReceipts]);

  // 3. Algorithmic Insights
  const insights = useMemo(() => {
    return generateDatasetInsights(rawReceipts, connectionNetwork);
  }, [rawReceipts, connectionNetwork]);

  // 4. Narrative Life Chapters
  const chapters = useMemo(() => {
    return generateLifeChapters(rawReceipts, connectionNetwork);
  }, [rawReceipts, connectionNetwork]);

  // 5. Evidence-backed Story Scenes
  const storyScenes = useMemo(() => {
    return generateStoryScenes(rawReceipts, connectionNetwork, insights, chapters);
  }, [rawReceipts, connectionNetwork, insights, chapters]);

  // Cross-navigation Handlers
  const handleNavigateToExplorer = () => {
    setExplorerFilterState({ category: 'ALL', location: 'ALL', searchQuery: '', receiptIds: null });
    setActiveTab('explorer');
  };

  const handleSelectCategory = (categoryKey) => {
    setExplorerFilterState({ category: categoryKey, location: 'ALL', searchQuery: '', receiptIds: null });
    setActiveTab('explorer');
  };

  const handleExploreInsight = (insight) => {
    setExplorerFilterState({
      category: insight.categoryFocus || 'ALL',
      location: insight.locationFilter || 'ALL',
      searchQuery: '',
      receiptIds: insight.receiptIds || null
    });
    setActiveTab('explorer');
  };

  const handleExploreChapter = (chapter) => {
    const ids = chapter.receipts?.map(r => r.id) || null;
    setExplorerFilterState({
      category: 'ALL',
      location: 'ALL',
      searchQuery: '',
      receiptIds: ids
    });
    setActiveTab('explorer');
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top Application Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'story') {
            setIsStoryModeOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        counts={{
          totalReceipts: rawReceipts.length,
          connectionsCount: connectionNetwork.connectedMoments?.length || 0,
          insightsCount: insights.length,
          chaptersCount: chapters.length,
          locationsCount: metrics.locationsCount
        }}
        onStartStory={() => setIsStoryModeOpen(true)}
      />

      {/* Main Page Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'overview' && (
          <LifeOverview
            metrics={metrics}
            connectionNetwork={connectionNetwork}
            metadata={metadata}
            onNavigateToExplorer={handleNavigateToExplorer}
            onStartStory={() => setIsStoryModeOpen(true)}
            onSelectCategory={handleSelectCategory}
          />
        )}

        {activeTab === 'explorer' && (
          <ReceiptExplorer
            receipts={rawReceipts}
            adjacencyMap={connectionNetwork.adjacencyMap}
            initialCategory={explorerFilterState.category}
            initialLocation={explorerFilterState.location}
            initialSearch={explorerFilterState.searchQuery}
            initialReceiptIds={explorerFilterState.receiptIds}
            onSelectReceipt={(receipt) => setSelectedReceipt(receipt)}
          />
        )}

        {activeTab === 'connections' && (
          <ConnectionEngineView
            connectionNetwork={connectionNetwork}
            receipts={rawReceipts}
            onSelectReceipt={(receipt) => setSelectedReceipt(receipt)}
          />
        )}

        {activeTab === 'insights' && (
          <InsightsView
            insights={insights}
            onExploreInsight={handleExploreInsight}
          />
        )}

        {activeTab === 'chapters' && (
          <ChaptersView
            chapters={chapters}
            onExploreChapter={handleExploreChapter}
            onSelectReceipt={(receipt) => setSelectedReceipt(receipt)}
          />
        )}

        {activeTab === 'map' && (
          <LifeMapView
            receipts={rawReceipts}
            connectionNetwork={connectionNetwork}
            onSelectReceipt={(receipt) => setSelectedReceipt(receipt)}
          />
        )}
      </main>

      {/* Fullscreen Guided Story Mode */}
      {isStoryModeOpen && (
        <StoryMode
          scenes={storyScenes}
          onClose={() => setIsStoryModeOpen(false)}
          onSelectReceipt={(receipt) => setSelectedReceipt(receipt)}
        />
      )}

      {/* Deep-dive Receipt Detail Modal */}
      {selectedReceipt && (
        <ReceiptDetailModal
          receipt={selectedReceipt}
          allReceipts={rawReceipts}
          adjacencyMap={connectionNetwork.adjacencyMap}
          onClose={() => setSelectedReceipt(null)}
          onSelectReceipt={(receipt) => setSelectedReceipt(receipt)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-[#232D42] bg-[#090D16] py-8 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            LIFE//RECEIPTS · "Your digital life, decoded."
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Kaggle Dataset Normalization</span>
            <span>·</span>
            <span>100% Client-Side React + Vite</span>
            <span>·</span>
            <span>Vercel Ready</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
