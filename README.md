# GV YouTube Tag Generator

> **Professional, responsive YouTube Video Tag, SEO Keyword & Hashtag Generator** with intelligent multi-lingual NLP and optional AI integration.

Built for content creators, YouTubers, educators, and gamers to optimize video discoverability, organize video metadata, and adhere to YouTube Studio's 500-character constraint.

---

## 🚀 Key Features

1. **Instant Tag Generation**:
   - Analyzes title and optional description.
   - Extracts primary topic keywords, entities, and long-tail search phrases.
   - Supports 14 categories (Gaming, Minecraft, Education, Tech, Vlogging, Food, Fitness, etc.).
   - Multi-lingual support: **Hindi (हिंदी)**, **Hinglish**, **English**, **Bengali**, **Tamil**, **Telugu**, **Marathi**.

2. **YouTube Studio 500-Character Limit Optimizer**:
   - Real-time character counter and progress meter.
   - Intelligent knapsack optimizer fits tags within the 500-character ceiling without truncating any tag midway.
   - Normal mode toggle for unrestricted keyword exploration.

3. **Multi-Format Export & Copy**:
   - One-click copy: Comma-separated (ready for YouTube Studio "Tags" box).
   - One-click copy: Line-by-line format.
   - One-click copy: Curated YouTube hashtags.
   - Download as structured `.txt` file with timestamp and video title.

4. **Tag Customization & Relevance Ranking**:
   - Chips categorized as **Highly relevant**, **Related**, or **Broad**.
   - Inline tag editing (click edit icon to rename).
   - Remove individual tags.
   - Add custom tags directly to the collection.
   - Filter tags by relevance category.

5. **Title Keyword Analyzer & SEO Suggestions**:
   - Detects main topic and calculates a Title Clarity Score (0–100%).
   - Flags vague/clickbait wording that lacks search context.
   - Suggests descriptive title variations and missing keyword opportunities.

6. **Dedicated Hashtag Generator**:
   - Distinct from video tags (explains difference clearly).
   - Formats clean, camelCase hashtags for the video description.

7. **Client-Side Generation History**:
   - Saves recent runs locally in browser `localStorage`.
   - Restore previous results back to generator in one click.
   - Privacy-focused: no user database required, clear anytime.

8. **Design & Accessibility**:
   - Responsive design for Android phones, tablets, laptops, and desktops.
   - Dark and Light themes with persistent toggle.
   - Semantic HTML, Schema.org JSON-LD structured data (`WebApplication`, `FAQPage`), Open Graph tags, `robots.txt`, and `sitemap.xml`.

---

## 📁 Project Structure

```
gv-youtube-tag-generator/
├── client/ (or src/)
│   ├── components/
│   │   ├── Header.tsx              # Top bar, branding, theme toggle, mobile drawer
│   │   ├── Hero.tsx                # Hero banner with example title pills & privacy notice
│   │   ├── GeneratorCard.tsx       # Main form card (title, category, language, count)
│   │   ├── ResultsSection.tsx      # Tag chips, 500-char limit optimizer, copy buttons
│   │   ├── TagChip.tsx             # Interactive chip (edit, copy, delete, relevance)
│   │   ├── HashtagCard.tsx         # Hashtags card with 1-click copy & explanation
│   │   ├── TitleAnalyzerCard.tsx   # Topic analysis, clarity score, title variations
│   │   ├── HistorySection.tsx      # Browser-saved history with restore & clear
│   │   ├── HowItWorks.tsx          # 3-step guide with icons
│   │   ├── FaqSection.tsx          # 10 comprehensive FAQs with accordion
│   │   ├── SeoGuideSection.tsx     # Original YouTube SEO educational guide
│   │   ├── Footer.tsx              # Brand footer, disclaimer, and privacy modal
│   │   └── Toast.tsx               # Non-intrusive action feedback toasts
│   ├── context/
│   │   └── ThemeContext.tsx        # Light/dark mode context with persistence
│   ├── utils/
│   │   ├── clipboard.ts            # Clipboard copy utility with mobile fallbacks
│   │   └── historyStorage.ts       # localStorage wrapper for recent generations
│   ├── App.tsx                     # Main application controller
│   ├── main.tsx                    # React DOM entry point
│   └── index.css                   # Tailwind base styles and theme colors
├── server/
│   ├── engine/
│   │   ├── tagEngine.ts            # High-performance multi-lingual NLP engine
│   │   └── aiProvider.ts           # Secure AI provider caller with strict timeout & fallback
│   └── index.ts                    # Express API server (rate-limiting, helmet, Zod validation)
├── shared/
│   └── types.ts                    # Shared TypeScript interfaces & types
├── public/
│   ├── robots.txt                  # Search engine crawler instructions
│   └── sitemap.xml                 # XML sitemap for Google Search Console
├── tests/
│   ├── engine.test.ts              # NLP engine tests (Minecraft, Hindi, Hinglish, 500-char)
│   ├── api.test.ts                 # Express API endpoint & validation tests
│   └── ui_and_features.test.ts     # Formatting, copy, and layout tests
├── .env.example                    # Environment variables template
├── package.json                    # Project dependencies and npm scripts
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite build configuration with API proxy
└── tailwind.config.js              # Tailwind SaaS color theme
```

---

## 🛠️ Setup & Installation

### 1. Prerequisites
- Node.js (v18.0.0 or higher recommended)
- `pnpm` (default) or `npm`

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` to set:
```ini
PORT=3001
RATE_LIMIT_MAX_REQUESTS=60

# Optional AI API Key (falls back to local NLP engine if not provided)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

> **Note on Security**: Private API keys are strictly accessed on the server side (`server/engine/aiProvider.ts`). They are never bundled into client JavaScript.

---

## 💻 Running the Application

### Development Mode
Run the full-stack app with hot-reload:
```bash
# Terminal 1: Start backend server
pnpm dev

# Terminal 2: Start Vite client dev server (proxies /api to port 3001)
pnpm dev:client
```
Visit `http://localhost:3000` in your browser.

### Production Build & Serve
```bash
# Build the client bundle
pnpm build

# Start the production server (serves static client & API on port 3001)
pnpm start
```
Visit `http://localhost:3001`.

---

## 🧪 Running Automated Tests

Run the full Vitest suite covering all 17 required scenarios:
```bash
pnpm test
```

### Test Coverage Checklist:
- [x] Scenario 1: Empty title validation (returns 400 with helpful message)
- [x] Scenario 2: Minecraft title in Hindi (entity recognition + Devanagari variations)
- [x] Scenario 3: English educational video title (Python tutorial/course keywords)
- [x] Scenario 4: Hinglish gaming title (colloquial queries: *kaise kare*, *hindi me*)
- [x] Scenario 5: Long title and description (graceful handling of large text)
- [x] Scenario 6: Duplicate keyword removal (zero duplicate tags)
- [x] Scenario 7: Zero relevant keywords (unusual symbols / punctuation)
- [x] Scenario 8: AI API failure fallback (transparent fallback to NLP engine)
- [x] Scenario 9: Backend timeout handling (8-second timeout guard)
- [x] Scenario 10: Copy all tags formatting (comma-separated and newline)
- [x] Scenario 11: Copy hashtags (no spaces, # prefix, topic-specific)
- [x] Scenario 12: Download TXT file (cleanly formatted text export)
- [x] Scenario 13: Edit and remove tags (dynamic state mutations)
- [x] Scenario 14: YouTube-ready 500-character constraint (greedy fit without cut words)
- [x] Scenario 15: Mobile layout responsiveness (responsive chip dimensions)
- [x] Scenario 16: Dark and light modes (theme toggling and persistence)
- [x] Scenario 17: Rate-limit behavior (express-rate-limit protection)

---

## 🌐 Production Deployment Guide

### Option A: Firebase Hosting + Firebase Cloud Functions
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Run `firebase login` and `firebase init` (choose Hosting and Functions).
3. Set `public` folder to `dist`.
4. Run `pnpm build` and deploy:
   ```bash
   firebase deploy
   ```

### Option B: Cloud Server / Docker / Render / Railway
Deploy `server/index.ts` with Node.js runtime. Express serves the pre-built `dist/` directory on the assigned `$PORT`.

---

## 🔍 Google Search Console & Sitemap Submission

1. **Verify Domain**:
   - In Google Search Console, add your domain (`https://gv-taggenerator.web.app` or your custom domain).
   - Verify via HTML Tag (already configured in `index.html`) or DNS TXT record.
2. **Submit Sitemap**:
   - Go to **Sitemaps** in the Search Console navigation.
   - Enter `sitemap.xml` and click **Submit**.
   - Verified sitemap URL: `https://gv-taggenerator.web.app/sitemap.xml`.

---

## 📄 License & Attribution

Independent creator software built for the YouTube creator community. Not affiliated with Google LLC or YouTube.
