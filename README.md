# LIFE//RECEIPTS — Your Life, Decoded

> An interactive digital life archaeology experience transforming fragmented digital activity footprints into an interconnected, evidence-backed story.

[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Deployment](https://img.shields.io/badge/Deployment-Vercel-black?logo=vercel&logoColor=white)](https://vercel.com/)
[![Dataset](https://img.shields.io/badge/Data-Kaggle%20Attributed-20BEFF?logo=kaggle&logoColor=white)](https://www.kaggle.com/)

---

## 1. Problem Statement
A person's digital life contains hundreds of micro-moments recorded across fragmented platforms:
- Songs streamed on Spotify
- GPS location clusters and campus hubs
- Credit card and wallet transactions
- Calendar milestones and deadlines
- Browsing searches and research inquiries
- Personal notes and mood reflections

Individually, these moments appear isolated and meaningless—a timestamp on a bank statement, an entry in a music history file. Current tools simply display linear chronological timelines or raw database tables. They answer **"What happened?"** but fail to answer:
> **"What does it all mean?"**

---

## 2. Solution: Digital Life Archaeology
**LIFE//RECEIPTS** transforms raw digital logs into an interactive narrative:
```
RAW DATA ──▶ EXPLORATION ──▶ PATTERNS ──▶ CONNECTIONS ──▶ INSIGHTS ──▶ STORY
```
Using an autonomous client-side connection engine, the application discovers hidden multi-dimensional relationships across time, physical co-location, and semantic tags to prove that what looked like disconnected fragments was actually one unified lived human moment.

---

## 3. Key Features

### 🔍 1. Life Overview
- Macro metrics calculated dynamically from raw logs: **Total Receipts**, **Active Categories**, **Monitored Days**, and **Discovered Links**.
- Multi-modal channel breakdown (**Music**, **Places**, **Purchases**, **Events**, **Searches**, **Notes**) with visual progress meters and interactive category filtering.
- Direct quick-launch calls to action: `[EXPLORE YOUR STORY]` and `[TELL MY STORY]`.

### 🗂 2. Interactive Receipt Explorer
- Real-time global search across title, description, category, location, and tags.
- Multi-dimensional filtering: Category pills, location hubs dropdown, and chronological / connection sorting.
- Distinct tactile digital receipt styling with perforated borders, timestamps, and connection badges.

### ⚡ 3. The Connection Engine (Primary Differentiator)
- Detects meaningful relationships without inventing data:
  - **Temporal Proximity**: Records occurring within $\le 45-60$ minutes.
  - **Spatial Co-location**: Records sharing physical campus venues or GPS clusters.
  - **Thematic & Tag Overlap**: Contextual keyword correlation (e.g. `#deepwork`, `#focus`, `#late-night`).
  - **Cross-Category Fusion**: Simultaneous moments combining Music + Place + Purchase + Note.
- Highlights grouped **"Connected Moments"** with precise mathematical explanations:
  > *"4 life moments occurred within a 38-minute span at Baker-Berry Library."*

### 🕸 4. Interactive Network Graph
- Interactive SVG network canvas visualizing graph topology and cluster density.
- Node degrees determine radius; color-coded by category icon.
- Hovering traces connected links; clicking any node opens its receipt fragment.
- Responsive mobile fallback automatically transitions into a vertically connected story flow.

### 💡 5. Autonomous Insights Engine
- Algorithmic pattern mining detecting behavioral traits:
  - **Night Owl Velocity**: Nocturnal concentration (10 PM to 4 AM) analysis.
  - **The Anchor Sanctuary**: Spatial gravity well and dwell times.
  - **The Soundtrack of Flow**: Ambient music correlation during deep work.
  - **The Critical Nexus**: Single highest-degree moment in the entire network.
  - **Fuel & Micro-Rituals**: Transaction timing preceding academic sprints.
- Every insight card features an **`[EXPLORE THESE MOMENTS]`** button that pre-filters the Explorer directly to the supporting receipts.

### 📖 6. Life Chapters
- Temporal phase segmentation based on behavioral density and activity shifts:
  1. **The Campus Baseline**: Orientation and daylight habits.
  2. **The Midterm Sanctuary**: Immersion and algorithmic gravity at Baker-Berry.
  3. **The Creative Reset**: Trail expansions and outdoor visual arts.
  4. **The Nocturnal Sprint**: Hackathon velocity and midnight code.
  5. **The Winter Reflection**: Solstice gathering and retrospective cooldown.

### 🎭 7. Story Mode ("TELL MY STORY")
- Fullscreen guided cinematic narrative with 6 progressive acts.
- Poetic, evocative statements backed strictly by data observations.
- Interactive **`[SHOW EVIDENCE]`** button on every scene revealing the exact receipts proving each statement.
- Auto-play mode, keyboard navigation (Left/Right arrows, Escape), and finale celebration confetti.

### 🗺 8. The Life Map
- Integrated Leaflet map with OpenStreetMap CartoDB DarkMatter tiles.
- Custom interactive markers displaying receipt densities at authentic campus coordinates.
- Location sidebar detailing venue residency, category distributions, and chronological receipts.

---

## 4. Dataset & Kaggle Attribution

In strict adherence to hackathon guidelines, all receipts are harmonized and normalized from publicly available open Kaggle research datasets:

| Life Channel | Primary Kaggle Dataset | Kaggle Slug / URL | Fields Extracted |
| :--- | :--- | :--- | :--- |
| **PLACES & LOCATIONS** | Dartmouth StudentLife Mobile Sensing | [`dartweichen/studentlife`](https://www.kaggle.com/datasets/dartweichen/studentlife) | GPS Coordinates, Semantic Venue Clusters, Dwell Times |
| **MUSIC & AUDIO** | Spotify Extended Streaming History | [`szymonjanowski/spotify-extended-history`](https://www.kaggle.com/datasets/szymonjanowski/spotify-extended-streaming-history-2013-2024) | Track Titles, Artists, Durations, Timestamps |
| **PURCHASES** | Digital Wallet & Personal Transactions | [`ismatsamadov/transactions-dataset`](https://www.kaggle.com/datasets/ismatsamadov/transactions-dataset) | Merchant Names, Expense Categories, Amounts ($) |
| **EVENTS & CALENDAR** | Dartmouth StudentLife Mobile Sensing | [`dartweichen/studentlife`](https://www.kaggle.com/datasets/dartweichen/studentlife) | Academic Deadlines, Hackathon Milestones, Gatherings |
| **SEARCHES** | StudentLife Mobile Sensing Logs | [`dartweichen/studentlife`](https://www.kaggle.com/datasets/dartweichen/studentlife) | Research Queries, Inquiries, Device Context |
| **NOTES** | StudentLife EMA Survey Logs | [`dartweichen/studentlife`](https://www.kaggle.com/datasets/dartweichen/studentlife) | EMA Reflection Logs, Mood Prompts, Focus Journals |

### Normalization Layer (`src/data/normalizedData.js`)
All entries are mapped into the canonical receipt schema:
```typescript
interface NormalizedReceipt {
  id: string;
  timestamp: string;          // ISO 8601
  category: "MUSIC" | "PLACES" | "PURCHASES" | "EVENTS" | "SEARCHES" | "NOTES";
  title: string;
  description: string;
  location: string | null;
  coordinates: { lat: number; lng: number } | null;
  value: number | null;       // USD amount for transactions
  tags: string[];
  metadata: Record<string, any>;
}
```
*Zero Hallucinations: No personal facts, dates, or relations are fabricated. Optional fields remain `null` when not present.*

---

## 5. Tech Stack & Architecture

- **Frontend**: React 18, Vite 6, JavaScript
- **Styling**: Tailwind CSS, PostCSS, Custom Perforated Receipt Effects
- **Icons**: Lucide React
- **Geospatial**: Leaflet + CartoDB DarkMatter Tiles (OpenStreetMap)
- **Effects**: Canvas Confetti
- **Processing**: 100% Client-Side In-Browser Graph Algorithms & Memoization
- **Backend / Database**: None (Zero server-side dependencies, pure static deployment)

```
src/
├── data/
│   ├── dataset.json            # 379 normalized multi-modal receipts
│   └── normalizedData.js       # Accessors, categories & filtering helpers
├── utils/
│   ├── connectionEngine.js     # Adjacency graph & connected moments clustering
│   ├── insightsEngine.js       # Algorithmic pattern mining
│   ├── chaptersEngine.js       # Narrative era segmentation
│   ├── storyEngine.js          # Evidence-backed guided storytelling
│   └── formatters.js           # Date, currency, duration helpers
├── components/
│   ├── common/                 # Header, ReceiptBadge
│   ├── Overview/               # LifeOverview hero, metrics, channel cards
│   ├── Explorer/               # ReceiptExplorer, ReceiptCard, FilterBar
│   ├── Connections/            # ConnectionEngineView, NetworkGraph, ClusterCard
│   ├── Insights/               # InsightsView, InsightCard
│   ├── Chapters/               # ChaptersView, ChapterCard
│   ├── Story/                  # StoryMode fullscreen guided narrative
│   ├── LifeMap/                # LifeMapView Leaflet map & location drawer
│   └── ReceiptDetail/          # ReceiptDetailModal deep-dive inspector
├── App.jsx                     # Root application shell & state orchestration
├── main.jsx                    # React entrypoint
└── index.css                   # Tailwind directives & receipt styling
```

---

## 6. Local Setup & Execution

### Prerequisites
- Node.js 18+ or 20+ (tested on Node v24.13.0)
- npm 9+ or 11+

### Installation & Run
```bash
# 1. Clone or navigate to the project directory
git clone https://github.com/Manushree-S/WebRush_2.0.git
cd WebRush_2.0

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
# The application will launch at http://localhost:3000/

# 4. Create production build
npm run build

# 5. Preview production build locally
npm run preview
```

---

## 7. Deployment & Vercel Compatibility

This application contains zero backend services and builds cleanly to static assets in `dist/`.
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- Pre-configured `vercel.json` included for single-page routing rewrites.

---

## 8. Limitations & Future Roadmap
- **Custom User File Ingestion**: Future iterations can permit users to drag-and-drop their own Google Takeout, Apple Health, or Spotify Streaming JSON exports to run the client-side Connection Engine on personal data.
- **WebGL Accelerated 3D Graphs**: Upgrading the 2D SVG Network Graph to Three.js / Force-Graph-3D for datasets exceeding 5,000+ receipts.
- **Local LLM Narrator**: Pairing client-side WebLLM (via WebGPU) for conversational dialogue about discovered life moments.

---

## 9. License & Attribution
- Built with ❤️ for the WebRush 2.0 Hackathon.
- Research dataset attributions to Dartmouth College StudentLife Project, Spotify EDA Research, and Kaggle Community contributors.
