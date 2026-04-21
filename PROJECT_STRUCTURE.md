# 📁 CareLink Project Structure

Complete file organization for the AI-Powered Non-Profit Support Triage System

## 🌳 Directory Tree

```
carelink/
│
├── 📄 README.md                      ⭐ Main project documentation
├── 📄 QUICK_START.md                 ⚡ 5-minute setup guide
├── 📄 FULLSTACK_SETUP.md             📚 Complete setup instructions
├── 📄 PROJECT_SUMMARY.md             📊 Features & statistics
├── 📄 PROJECT_STRUCTURE.md           📁 This file
├── 📄 package.json                   📦 Frontend dependencies
├── 📄 .env.example                   🔑 Frontend environment template
│
├── 🐍 backend/                       ← Python FastAPI Backend
│   ├── main.py                       🚀 FastAPI server (800+ lines)
│   │   ├── Message analysis endpoint
│   │   ├── NER extraction functions
│   │   ├── LLM classification
│   │   ├── Quiz management
│   │   └── Chat bot logic
│   │
│   ├── requirements.txt              📦 Python dependencies
│   ├── .env.example                  🔑 Backend environment template
│   └── README.md                     📖 Backend documentation
│
├── ⚛️ src/                           ← React Frontend
│   ├── app/
│   │   ├── components/               🧩 React Components
│   │   │   ├── ui/                   🎨 Base UI components (shadcn)
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── textarea.tsx
│   │   │   │   └── ... (40+ components)
│   │   │   │
│   │   │   ├── 🤖 AIAssistantBot.tsx           ⭐ NEW: Quiz & Chat Bot
│   │   │   ├── 📊 UrgencyScale.tsx              ⭐ NEW: Visual urgency
│   │   │   ├── 🏷️  NERDisplay.tsx               ⭐ NEW: Entity display
│   │   │   ├── 💬 LLMResponseGenerator.tsx     ⭐ NEW: AI responses
│   │   │   ├── DashboardLayout.tsx              ✏️  MODIFIED
│   │   │   ├── Chatbot.tsx                      ❌ Replaced by AIAssistantBot
│   │   │   ├── StatCard.tsx
│   │   │   └── figma/
│   │   │       └── ImageWithFallback.tsx
│   │   │
│   │   ├── pages/                    📄 Page Components
│   │   │   ├── 🏠 Dashboard.tsx                 ✏️  MODIFIED: Added AI components
│   │   │   ├── 📨 Messages.tsx                  ✏️  MODIFIED: Detail modal
│   │   │   ├── Landing.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── SignUp.tsx
│   │   │   ├── Analytics.tsx
│   │   │   ├── Templates.tsx
│   │   │   ├── Settings.tsx
│   │   │   ├── AboutUs.tsx
│   │   │   ├── NotFound.tsx
│   │   │   └── ... (other pages)
│   │   │
│   │   ├── context/                  🔄 React Context
│   │   │   └── ThemeContext.tsx
│   │   │
│   │   ├── utils/                    🛠️  Utilities
│   │   │   └── 🔌 api.ts                        ✏️  MODIFIED: Backend integration
│   │   │
│   │   ├── routes.tsx                🗺️  React Router config
│   │   └── App.tsx                   📱 Root component
│   │
│   └── styles/                       🎨 Stylesheets
│       ├── theme.css                 Tailwind theme (turquoise primary)
│       ├── fonts.css                 Font imports
│       └── global.css                Global styles
│
├── 📚 quiz-tutor-bot/                📂 Old Python quiz bot (reference)
│   └── ... (legacy files, not used in current implementation)
│
└── 🔧 Configuration Files
    ├── vite.config.ts                Vite configuration
    ├── tsconfig.json                 TypeScript config
    ├── tailwind.config.js            Tailwind config
    └── package.json                  Node dependencies

```

## 🎯 Key Files Explained

### Backend Files (Python)

#### `backend/main.py` (23KB)
**Purpose**: FastAPI server with AI/ML capabilities

**Key Sections**:
- **Models** (lines 1-100): Pydantic models for request/response
- **NER Functions** (lines 101-300): Entity extraction logic
  - `extract_email()`, `extract_phone()`, `extract_amount()`
  - `extract_location()`, `extract_name_basic()`
  - `extract_entities_spacy()` - Uses spaCy NER
  - `extract_entities_regex()` - Fallback regex patterns
- **LLM Functions** (lines 301-500): AI classification
  - `classify_message_llm()` - OpenAI GPT classification
  - `classify_message_rules()` - Rule-based fallback
  - `generate_response_llm()` - AI response generation
- **Quiz Data** (lines 501-600): Quiz questions array
- **API Endpoints** (lines 601-800):
  - `POST /api/analyze` - Message analysis
  - `GET /api/quiz/*` - Quiz endpoints
  - `POST /api/chat` - Chat bot

**Dependencies**: FastAPI, OpenAI, spaCy, Pydantic

---

### Frontend Components (React/TypeScript)

#### `src/app/components/AIAssistantBot.tsx` (15KB)
**Purpose**: Interactive AI assistant with quiz system

**Features**:
- 5 help topic buttons
- Quiz question rendering
- Real-time scoring
- LLM-powered chat
- Animated transitions
- Minimize/maximize

**State**:
- `messages[]` - Chat history
- `currentQuiz` - Active quiz question
- `quizScore` - User score
- `showingTopics` - Menu visibility

**Dependencies**: Motion/Framer, Lucide icons

---

#### `src/app/components/UrgencyScale.tsx` (5KB)
**Purpose**: Visual urgency level indicator

**Features**:
- Gradient bar (green → yellow → red)
- Animated markers
- Pulse effects
- 4 urgency levels
- Responsive sizes (sm, md, lg)

**Props**:
- `urgency`: 'Critical' | 'High' | 'Medium' | 'Low'
- `showLabel`: boolean
- `size`: 'sm' | 'md' | 'lg'
- `animated`: boolean

---

#### `src/app/components/NERDisplay.tsx` (6KB)
**Purpose**: Named entity visualization

**Features**:
- Color-coded entity cards
- 9 entity types support
- Grid layout
- Hover animations
- Compact/expanded modes

**Entities Supported**:
- Name, Email, Phone, Location, Date
- Amount, ID, Organization, Category

**Props**:
- `entities`: ExtractedEntity object
- `animated`: boolean
- `compact`: boolean

---

#### `src/app/components/LLMResponseGenerator.tsx` (5KB)
**Purpose**: AI response display with animations

**Features**:
- Streaming typing effect
- Copy to clipboard
- Regenerate option
- Feedback (thumbs up/down)
- Loading states

**Props**:
- `response`: string
- `category`: string
- `urgency`: string
- `isGenerating`: boolean
- `onRegenerate`: function

---

### Modified Pages

#### `src/app/pages/Dashboard.tsx`
**Changes**:
- Imported `UrgencyScale`, `NERDisplay`, `LLMResponseGenerator`
- Enhanced results panel with AI components
- Visual urgency scale instead of plain badge
- Interactive NER display
- Animated AI response generator

**Before**: Simple text-based results
**After**: Rich, animated AI analysis visualization

---

#### `src/app/pages/Messages.tsx`
**Changes**:
- Added message detail modal
- Integrated `UrgencyScale` in modal
- Integrated `NERDisplay` in modal
- Enhanced message cards
- Improved action buttons

**Before**: Basic message list
**After**: Detailed analysis modal with AI insights

---

### Utilities

#### `src/app/utils/api.ts`
**Changes**:
- Added `BACKEND_API_URL` constant
- Modified `analyzeMessage()` to call Python backend
- Added `getQuizQuestions()` function
- Added `chatWithBot()` function

**Integration**:
```typescript
// Old (Supabase only)
const response = await fetch(`${API_URL}/analyze`, ...);

// New (Python backend)
const response = await fetch(`${BACKEND_API_URL}/analyze`, ...);
```

---

## 📊 File Statistics

### Backend
```
backend/
├── main.py              23 KB  (800 lines)
├── requirements.txt     755 B  (15 dependencies)
├── .env.example        809 B
└── README.md           7.6 KB
Total: ~32 KB
```

### Frontend (New Components)
```
src/app/components/
├── AIAssistantBot.tsx        ~15 KB  (400+ lines)
├── UrgencyScale.tsx          ~5 KB   (150+ lines)
├── NERDisplay.tsx            ~6 KB   (180+ lines)
└── LLMResponseGenerator.tsx  ~5 KB   (150+ lines)
Total: ~31 KB
```

### Documentation
```
Documentation/
├── README.md               ~12 KB
├── QUICK_START.md          ~8 KB
├── FULLSTACK_SETUP.md      ~15 KB
├── PROJECT_SUMMARY.md      ~10 KB
├── PROJECT_STRUCTURE.md    This file
└── backend/README.md       ~7.6 KB
Total: ~52 KB
```

---

## 🎨 Component Hierarchy

```
App
└── ThemeProvider
    └── RouterProvider
        ├── Landing
        ├── Login
        ├── SignUp
        └── Dashboard Layout
            ├── Sidebar
            ├── Header
            ├── Main Content
            │   ├── Dashboard Page
            │   │   ├── Stats Cards
            │   │   ├── Message Analyzer
            │   │   └── AI Results Panel
            │   │       ├── UrgencyScale
            │   │       ├── NERDisplay
            │   │       └── LLMResponseGenerator
            │   │
            │   └── Messages Page
            │       ├── Filters
            │       ├── Message List
            │       └── Detail Modal
            │           ├── UrgencyScale
            │           └── NERDisplay
            │
            └── AIAssistantBot (Global)
                ├── Help Topics Menu
                ├── Quiz System
                └── Chat Interface
```

---

## 🔄 Data Flow

```
User Input
    ↓
Frontend (React)
    ↓
API Utils (api.ts)
    ↓
HTTP Request
    ↓
Backend (FastAPI)
    ↓
┌─────────────────┐
│ Message Analysis│
├─────────────────┤
│ 1. LLM Classify │
│ 2. NER Extract  │
│ 3. Generate Res │
└─────────────────┘
    ↓
JSON Response
    ↓
Frontend Components
    ↓
┌─────────────────┐
│ UrgencyScale    │
│ NERDisplay      │
│ LLMResponse     │
└─────────────────┘
    ↓
Visual Display
```

---

## 🚀 Deployment Structure

### Development
```
Terminal 1: backend/     → python main.py (Port 8000)
Terminal 2: root/        → Figma Make preview
```

### Production
```
Backend:  Heroku/AWS/DigitalOcean
Frontend: Figma Make Platform
Database: Supabase
```

---

## 📦 Dependencies Overview

### Backend (`requirements.txt`)
```python
# Web Framework
fastapi==0.115.5
uvicorn[standard]==0.34.0

# AI/ML
openai==1.57.4
spacy==3.8.3
langchain==0.3.13

# Vector DB
chromadb==0.5.23

# Database
supabase==2.11.2

# Utilities
python-dotenv==1.0.1
```

### Frontend (`package.json`)
```json
{
  "dependencies": {
    "react": "18.3.1",
    "react-router": "7.13.0",
    "motion": "12.23.24",
    "lucide-react": "0.487.0",
    "recharts": "2.15.2",
    "tailwindcss": "4.1.12",
    "@supabase/supabase-js": "^2.99.2"
  }
}
```

---

## 🎯 Entry Points

| Component | Entry Point | Port |
|-----------|-------------|------|
| **Backend API** | `backend/main.py` | 8000 |
| **Frontend** | `src/app/App.tsx` | Figma Make |
| **API Docs** | Auto-generated | 8000/docs |

---

## 🔐 Configuration Files

```
Environment Configuration:
├── backend/.env          Python backend config
└── .env                  Frontend config

Code Configuration:
├── tsconfig.json         TypeScript settings
├── vite.config.ts        Vite bundler
├── tailwind.config.js    Tailwind theme
└── package.json          Node packages
```

---

## 📝 Important Paths

| Purpose | Path |
|---------|------|
| **Backend Server** | `backend/main.py` |
| **AI Components** | `src/app/components/AI*.tsx` |
| **Main Dashboard** | `src/app/pages/Dashboard.tsx` |
| **Messages Page** | `src/app/pages/Messages.tsx` |
| **API Integration** | `src/app/utils/api.ts` |
| **Theme Styles** | `src/styles/theme.css` |

---

*Complete project structure for CareLink AI Triage System*
*Ready for development, demonstration, and deployment! 🚀*
