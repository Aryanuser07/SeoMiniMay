# LocalSEO AI 

LocalSEO AI is a full-stack web application designed to help local businesses automatically generate high-quality, SEO-optimized content. By simply entering a business name, category, and location, the application leverages advanced LLMs (via OpenRouter) to generate targeted keywords, an engaging Google Business Profile post, and a comprehensive website landing page description.

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite |
| **Backend** | Node.js, Express |
| **Database** | Custom JSON (`localseo.db.json`) |
| **AI Model** | Gemini 2.5 Flash via OpenRouter |
| **Styling** | Vanilla CSS (Glassmorphic dark theme) |
| **Markdown** | `react-markdown` |

---

## 🛠️ Setup Steps

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- An [OpenRouter](https://openrouter.ai/) API key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Aryanuser07/SeoMiniMay.git
   cd SeoMiniMay
   ```

2. **Install dependencies:** 
   The project uses `concurrently` to run both the frontend and backend from the root directory. Install all dependencies using the provided script:
   ```bash
   npm run install:all
   ```

3. **Configure Environment Variables:** 
   Navigate to the `server/` directory and create a `.env` file:
   ```env
   OPENROUTER_API_KEY=your_api_key_here
   OPENROUTER_MODEL=google/gemini-2.5-flash
   PORT=3001
   ```

4. **Run the Application:** 
   From the root directory, start both the React frontend and the Express backend simultaneously:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5174` (or 5173).

---

## 🏗️ Architecture Decisions

The application is built with a modern, decoupled full-stack architecture prioritizing resilience and a smooth user experience.

- **Frontend (Client)**: 
  Built with React 18, TypeScript, and Vite. Features a custom glassmorphic dark theme using Vanilla CSS. State is managed locally. The UI incorporates optimistic updating (e.g., instant feedback when deleting history items) and uses `react-markdown` to properly render AI-generated styled outputs.

- **Backend (Server)**: 
  A Node.js + Express server with clean separation of concerns:
  - `routes/` — handles HTTP layer only (what to do)
  - `services/llmService.js` — handles all AI logic (how to call AI)
  - `services/dbService.js` — handles all data persistence (how to store)
  
  *No business logic leaks between layers.*

- **Database Layer**: 
  To ensure maximum portability and avoid native SQL driver compilation issues, we engineered a Custom JSON-based Database (`server/db/localseo.db.json`). It loads into memory on startup and persists to disk on every write — giving fast reads with reliable storage, zero dependencies.

- **AI Orchestration & Resilience**: 
  The `llmService.js` orchestrates a 3-step sequential LLM pipeline:
  - **Rate Limiting**: Every API call is wrapped in exponential backoff retry (5s → 10s → 15s)
  - **Token Management**: Requests capped at `max_tokens: 1000` to prevent credit reservation blocks
  - **Mock Fallback**: If the API fails entirely, the backend returns high-quality mock data — the app stays fully demo-able at all times

---

## 🔗 3-Step LLM Chain

Each step feeds into the next — ensuring all outputs are coherent and use consistent keywords.

```text
Business Input (name, category, location)
        │
        ▼
┌─────────────────────────────────────────┐
│ Step 1: generateKeywords()              │
│ → { high_intent: [], informational: [] }│
└─────────────────────────────────────────┘
        │
        │ keywords passed down
        ▼
┌─────────────────────────────────────────┐
│ Step 2: generateGMBPost(keywords)       │
│ → "100-150 word Google Business post"   │
└─────────────────────────────────────────┘
        │
        │ keywords + post passed down
        ▼
┌─────────────────────────────────────────┐
│ Step 3: generateDescription(keywords,   │
│                              gmbPost)   │
│ → "3-paragraph SEO landing page copy"   │
└─────────────────────────────────────────┘
        │
        ▼
Save to DB → Return to Frontend
```
*This is true prompt chaining — Step 2 uses Step 1's keywords, Step 3 uses both Step 1's keywords and Step 2's post for tone consistency.*

---

## 💬 Prompt Examples

The quality of the generated content relies on highly structured, role-based prompts.

### 1. Keyword Generation Prompt
*Goal: Generate categorized SEO keywords strictly in JSON format.*
```text
You are an expert SEO strategist. Generate SEO keywords for a local business.

Business Details:
- Name: [Business Name]
- Category: [Category]
- Location: [Location]

Generate exactly 15 SEO keywords grouped into two categories:
1. "high_intent" - transactional keywords (e.g., "best [category] in [location]")
2. "informational" - educational keywords (e.g., "how to choose a [category]")

Return ONLY a valid JSON object in this exact format (no markdown, no explanation):
{
  "high_intent": ["keyword1", "keyword2", ...],
  "informational": ["keyword1", "keyword2", ...]
}
```

### 2. Google Business Profile (GMB) Post Prompt
*Goal: Create an engaging post weaving in the keywords from Step 1.*
```text
You are a Google Business Profile expert copywriter. Write a compelling Google Business post.

Business Details:
- Name: [Business Name]
- Category: [Category]
- Location: [Location]

Key SEO keywords to incorporate naturally: [Top 5 Keywords from Step 1]

Requirements:
- Length: 100-150 words exactly
- Tone: Professional yet warm, locally relevant
- Include: A clear value proposition, local context, and a call-to-action
- Naturally weave in at least 3 of the provided keywords
- Do NOT use hashtags

Return ONLY the post text, no labels or explanations.
```

### 3. SEO Landing Page Description Prompt
*Goal: Create cohesive website copy using all keywords and matching the GMB post tone.*
```text
You are an expert SEO content writer specializing in local business landing pages.

Business Details:
- Name: [Business Name]
- Category: [Category]
- Location: [Location]

SEO Keywords to incorporate: [All 15 Keywords from Step 1]
Google Business Post (for consistency reference): "[Generated Post from Step 2]"

Write a 3-paragraph SEO-friendly business description:
- Paragraph 1: Who they are, what they offer, and where they're located.
- Paragraph 2: Detailed service offerings, unique selling points, why choose them.
- Paragraph 3: Call-to-Action with local keywords.

Requirements:
- Naturally incorporate 8-10 keywords without keyword stuffing
- Maintain consistency with the GMB post tone
- Each paragraph: 60-80 words
- Do NOT use bullet points or headers

Return ONLY the 3 paragraphs separated by double newlines. No labels or explanations.
```

---

## 🗄️ Database Schema

Two collections stored in `localseo.db.json`:

**`projects`**
```text
├── id (auto-increment)
├── business_name
├── category
├── location
├── description
├── target_audience
└── created_at
```

**`outputs`**
```text
├── id (auto-increment)
├── project_id (links to projects)
├── keywords (JSON string)
├── gmb_post (text)
├── seo_description (text)
└── created_at
```
*`project_id` in `outputs` links to `id` in `projects` — same pattern as a SQL foreign key.*

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/generate` | Generate SEO content for a business |
| `GET` | `/api/history` | Fetch all past generations |
| `GET` | `/api/history/:id` | Fetch a single generation by ID |
| `DELETE` | `/api/history/:id` | Delete a single generation by ID |
| `GET` | `/api/health` | Server health check |

---
