# LIFE//RECEIPTS — Your Life, Decoded

> An interactive digital-life archaeology experience that transforms fragmented activity data into discoverable connections, insights, and an evidence-backed story.

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Deployment](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel&logoColor=white)](https://vercel.com/)
[![Data](https://img.shields.io/badge/Data-Kaggle-20BEFF?logo=kaggle&logoColor=white)](https://www.kaggle.com/)

**Live Demo:** https://web-rush-2-0.vercel.app/  
**GitHub:** https://github.com/Manushree-S/WebRush_2.0

---

## 1. Overview

Digital life is made up of hundreds of small moments — music played, places visited, purchases made, searches performed, events attended, and notes recorded.

Viewed individually, these records appear disconnected.

**LIFE//RECEIPTS** turns these fragments into an interactive experience that helps users explore:

```text
RAW DATA → EXPLORATION → PATTERNS → CONNECTIONS → INSIGHTS → STORY
```

Instead of presenting a simple chronological timeline, the application identifies relationships across time, location, categories, and metadata to reveal meaningful moments within the dataset.

---

## 2. Key Features

### 🔍 Life Overview

A high-level view of the dataset with dynamically calculated metrics such as:

- Total receipts
- Active categories
- Active days
- Discovered connections
- Category distribution

Users can directly navigate to the Explorer or Story Mode.

### 🧾 Interactive Receipt Explorer

Explore individual digital-life records through a searchable and filterable interface.

Features include:

- Global search
- Category filtering
- Location filtering
- Date-based exploration
- Sorting
- Receipt detail view
- Connected-receipt indicators

Each record is presented as a visual "life receipt" rather than a raw database entry.

### 🔗 Connection Engine

The core differentiating feature of LIFE//RECEIPTS.

The client-side connection engine identifies relationships between records using available dataset attributes, including:

- **Temporal proximity** — activities occurring close together in time
- **Location relationships** — records associated with the same location or cluster
- **Category relationships** — recurring combinations of activity types
- **Tag and metadata overlap** — related contextual information
- **Cross-category connections** — relationships between different types of activity

Each discovered connection is supported by the underlying records rather than being presented as an unsupported assumption.

### 🕸 Interactive Network Graph

Connected records are represented as an interactive network.

Users can:

- Explore connected nodes
- Identify clusters
- Hover over relationships
- Select individual records
- Open detailed receipt information

The visualization adapts to smaller screens through a mobile-friendly connected-story layout.

### 💡 Insights

The application derives data-driven observations from the available records.

Examples include:

- Activity concentration by time
- Frequently occurring locations
- Category patterns
- Repeated activity combinations
- Highly connected moments
- Activity trends across different periods

Each insight can lead users back to the supporting receipts for verification.

### 📖 Life Chapters

The dataset is segmented into meaningful periods based on changes in activity density and patterns.

Each chapter presents:

- Time period
- Dominant activity categories
- Key moments
- Relevant connections
- Supporting observations

This provides a higher-level view of how activity patterns evolve over time.

### 🎭 Story Mode

**TELL MY STORY** converts discovered patterns and connections into a guided narrative experience.

Key features:

- Multi-stage storytelling
- Evidence-backed observations
- Supporting receipt references
- Interactive navigation
- Auto-play mode
- Keyboard navigation
- Visual finale

The narrative is generated from observations derived from the dataset rather than invented personal information.

### 🗺 Life Map

When location information is available, the application provides a visual representation of activity across locations.

Features include:

- Interactive map
- Location markers
- Receipt density
- Category distribution
- Location details
- Related chronological activity

The map uses Leaflet with OpenStreetMap-based mapping data.

---

## 3. Dataset & Attribution

The application uses publicly available Kaggle datasets that are normalized into a common digital-life receipt format.

The project combines relevant data sources to represent different dimensions of digital activity.

| Category | Dataset | Source |
|---|---|---|
| Places & Locations | Dartmouth StudentLife Mobile Sensing | [Kaggle](https://www.kaggle.com/datasets/dartweichen/studentlife) |
| Music & Audio | Spotify Extended Streaming History | [Kaggle](https://www.kaggle.com/datasets/szymonjanowski/spotify-extended-streaming-history-2013-2024) |
| Purchases | Transactions Dataset | [Kaggle](https://www.kaggle.com/datasets/ismatsamadov/transactions-dataset) |
| Events / Activity | StudentLife Mobile Sensing | [Kaggle](https://www.kaggle.com/datasets/dartweichen/studentlife) |
| Searches / Text Activity | StudentLife-related activity data | [Kaggle](https://www.kaggle.com/datasets/dartweichen/studentlife) |
| Notes / Reflections | StudentLife EMA data | [Kaggle](https://www.kaggle.com/datasets/dartweichen/studentlife) |

### Data Normalization

Different source datasets are transformed into a common receipt structure:

```text
{
  id,
  timestamp,
  category,
  title,
  description,
  location,
  coordinates,
  value,
  tags,
  metadata
}
```

This normalization allows different types of records to be explored and connected through a common interface.

The application does not require a backend or external database; data processing is performed client-side.

---

## 4. Connection & Insight Approach

The project focuses on moving beyond:

```text
Raw Data → Information
```

towards:

```text
Raw Data → Insights → Connections → Story
```

Connections are derived from available data attributes such as:

```text
Time
  ↓
Location
  ↓
Category
  ↓
Tags / Metadata
  ↓
Related Activity
```

For example, several records occurring within the same time window and location can be grouped into a **Connected Moment**.

These relationships are then used by the Insights, Chapters, and Story Mode experiences.

---

## 5. Tech Stack

### Frontend

- React 18
- Vite 6
- JavaScript
- Tailwind CSS

### Visualization & UI

- Lucide React
- Leaflet
- OpenStreetMap-based map tiles
- SVG-based network visualization
- Canvas Confetti

### Data Processing

- Client-side JavaScript
- Custom connection algorithms
- Derived statistics and insights
- Memoized data processing

### Backend

**None**

The application is completely frontend-only and does not use:

- Backend servers
- External databases
- Authentication services
- Server-side application logic

---

## 6. Project Structure

```text
src/
├── data/
│   ├── dataset.json
│   └── normalizedData.js
│
├── utils/
│   ├── connectionEngine.js
│   ├── insightsEngine.js
│   ├── chaptersEngine.js
│   ├── storyEngine.js
│   └── formatters.js
│
├── components/
│   ├── common/
│   ├── Overview/
│   ├── Explorer/
│   ├── Connections/
│   ├── Insights/
│   ├── Chapters/
│   ├── Story/
│   ├── LifeMap/
│   └── ReceiptDetail/
│
├── App.jsx
├── main.jsx
└── index.css
```

---

## 7. Local Development

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/Manushree-S/WebRush_2.0.git
cd WebRush_2.0
npm install
```

### Start Development Server

```bash
npm run dev
```

Open the local URL shown by Vite in the terminal.

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## 8. Deployment

The application is deployed on Vercel as a Vite frontend application.

### Vercel Configuration

```text
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

### Live Application

**https://web-rush-2-0.vercel.app/**

GitHub pushes to the connected repository can be used to trigger updated Vercel deployments.

---

## 9. Responsive & Accessible Design

The application is designed for:

- Desktop
- Tablet
- Mobile

Accessibility considerations include:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Accessible interactive controls
- Responsive layouts
- Color-independent category identification
- Mobile-friendly interaction patterns

---

## 10. Performance

The application performs data processing in the browser and avoids unnecessary backend infrastructure.

Performance considerations include:

- Client-side data processing
- Memoized derived data
- Efficient filtering
- Lightweight visualization
- Static production deployment

---

## 11. Future Improvements

Potential future enhancements include:

- User-uploaded digital activity datasets
- Support for additional personal-data formats
- Larger-scale graph visualization
- More advanced semantic relationship detection
- Interactive natural-language exploration of discovered patterns
- Additional visualization modes for large datasets

---

## 12. Hackathon Context

Built for **WebRush 2.0** as a frontend-only solution to the challenge:

> **One Dataset. Hundreds of Moments. Infinite Stories. Six Hours to Uncover One.**

The project focuses on transforming disconnected activity records into an interactive and evidence-backed digital story.

---

## 13. License & Attribution

Built for the WebRush 2.0 Hackathon.

Dataset sources are attributed to their respective Kaggle contributors and original projects.

Third-party libraries and mapping services remain subject to their respective licenses and terms.

---

## ⭐ Core Idea

LIFE//RECEIPTS is built around one simple question:

> **What if disconnected digital moments could tell a story when viewed together?**

**Explore the data. Connect the moments. Discover the story.**
