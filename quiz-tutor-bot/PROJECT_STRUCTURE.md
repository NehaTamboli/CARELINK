# 📁 Project Structure

Complete overview of the Non-Profit Quiz/Tutor Bot codebase.

---

## 🗂️ Directory Tree

```
quiz-tutor-bot/
│
├── 📄 main.py                      # Application entry point
├── 📄 requirements.txt             # Python dependencies
├── 📄 .env.example                 # Environment variables template
├── 📄 .gitignore                   # Git ignore rules
├── 📄 Dockerfile                   # Docker container config
├── 📄 docker-compose.yml           # Docker Compose orchestration
│
├── 📖 README.md                    # Main documentation
├── 📖 SETUP_GUIDE.md              # Installation instructions
├── 📖 API_DOCUMENTATION.md        # API reference
├── 📖 PROJECT_STRUCTURE.md        # This file
│
├── 🧪 sample_test.py              # Demo test script
│
├── 📂 src/                         # Source code
│   │
│   ├── 📂 models/                  # Data models & schemas
│   │   ├── __init__.py
│   │   └── schemas.py              # Pydantic models
│   │
│   ├── 📂 llm/                     # LLM integration
│   │   ├── __init__.py
│   │   ├── providers.py            # OpenAI & Anthropic providers
│   │   └── evaluator.py            # Answer evaluation logic
│   │
│   ├── 📂 vector_db/               # Vector database
│   │   ├── __init__.py
│   │   └── vector_store.py         # ChromaDB operations
│   │
│   ├── 📂 quiz/                    # Quiz system
│   │   ├── __init__.py
│   │   ├── generator.py            # Question generation
│   │   └── session_manager.py      # Session & progress tracking
│   │
│   └── 📂 api/                     # FastAPI routes
│       ├── __init__.py
│       └── routes.py               # API endpoints
│
├── 📂 data/                        # Persistent data (gitignored)
│   └── chromadb/                   # Vector database storage
│
└── 📂 tests/                       # Unit & integration tests
    └── (test files here)
```

---

## 🔍 File Descriptions

### Root Files

#### `main.py`
- **Purpose**: Application entry point
- **Responsibilities**:
  - Initialize FastAPI app
  - Configure CORS middleware
  - Initialize all components on startup
  - Set up API routes
  - Run Uvicorn server
- **Usage**: `python main.py`

#### `requirements.txt`
- **Purpose**: Python dependencies
- **Key Packages**:
  - `fastapi` - Web framework
  - `uvicorn` - ASGI server
  - `openai` - OpenAI API client
  - `anthropic` - Anthropic API client
  - `chromadb` - Vector database
  - `sentence-transformers` - Embedding models
  - `pydantic` - Data validation

#### `.env.example`
- **Purpose**: Environment variables template
- **Required Variables**:
  - `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`
- **Optional Variables**:
  - `LLM_PROVIDER`, `MODEL_NAME`, `PORT`, etc.

#### `Dockerfile`
- **Purpose**: Container image definition
- **Base Image**: `python:3.11-slim`
- **Exposed Port**: 8000

#### `docker-compose.yml`
- **Purpose**: Multi-container orchestration
- **Services**: `quiz-bot-api`
- **Volumes**: Persistent data storage

---

### Source Code (`src/`)

#### `src/models/schemas.py`
**Purpose**: Pydantic data models for type safety

**Key Models**:
- `DonorEmail` - Email document structure
- `Question` - Quiz question model
- `Answer` - User answer model
- `EvaluationResult` - Answer evaluation with feedback
- `QuizSession` - Complete quiz session
- `UserProgress` - User learning statistics
- `LearningRecommendation` - Personalized study tips

**Enums**:
- `DifficultyLevel` - easy, medium, hard
- `QuestionType` - multiple_choice, short_answer, true_false, essay

---

#### `src/llm/providers.py`
**Purpose**: LLM provider implementations

**Classes**:
- `LLMProvider` (Abstract) - Base interface
- `OpenAIProvider` - OpenAI/GPT integration
- `AnthropicProvider` - Claude integration

**Methods**:
- `generate_response(prompt, **kwargs)` - Generate LLM response

**Usage**:
```python
from src.llm.providers import OpenAIProvider

llm = OpenAIProvider(model="gpt-4o-mini")
response = llm.generate_response("Your prompt here")
```

---

#### `src/llm/evaluator.py`
**Purpose**: AI-powered answer evaluation

**Main Class**: `LLMEvaluator`

**Key Methods**:
- `evaluate_answer(question, user_answer, context)` → `EvaluationResult`
  - Scores answer
  - Provides detailed feedback
  - Identifies knowledge gaps
  - Suggests improvements

- `identify_weak_areas(evaluations)` → `Dict`
  - Analyzes multiple evaluations
  - Finds patterns in mistakes
  - Returns weak topics & recommendations

**Evaluation Criteria**:
1. Accuracy - Factual correctness
2. Completeness - Coverage of key points
3. Understanding - Depth of comprehension
4. Context - Relevance to non-profit sector

---

#### `src/vector_db/vector_store.py`
**Purpose**: ChromaDB vector database operations

**Main Class**: `VectorStore`

**Key Methods**:
- `add_donor_email(...)` - Store email with embeddings
- `search_similar(query, n_results)` - Semantic search
- `get_by_topic(topic, n_results)` - Topic-based retrieval
- `get_by_category(category)` - Category filtering
- `get_context_for_question(question, topic)` - Context retrieval
- `count_documents()` - Get total documents

**Embedding Model**: `all-MiniLM-L6-v2` (384 dimensions)

**Features**:
- Persistent storage
- Automatic embedding generation
- Semantic similarity search
- Metadata filtering

---

#### `src/quiz/generator.py`
**Purpose**: AI-powered quiz question generation

**Main Class**: `QuizGenerator`

**Key Methods**:
- `generate_quiz(num_questions, difficulty, topics)` → `List[Question]`
  - Generates complete quiz
  - Uses donor email context
  - Varies question types and difficulty

- `generate_similar_question(question)` → `Question`
  - Creates practice question
  - Same topic and difficulty

**Question Generation Process**:
1. Identify relevant topics from knowledge base
2. Retrieve context from donor emails via vector search
3. Use LLM to generate questions based on context
4. Parse and validate questions
5. Assign points based on difficulty

---

#### `src/quiz/session_manager.py`
**Purpose**: Quiz session and progress management

**Main Class**: `SessionManager`

**Key Methods**:
- `create_session(user_id, questions)` → `QuizSession`
  - Initializes new quiz session
  - Sets up scoring

- `submit_answer(session_id, question_id, answer)` → `EvaluationResult`
  - Evaluates answer using LLM
  - Updates session state
  - Tracks user progress

- `complete_session(session_id)` → `QuizSession`
  - Marks session as done
  - Calculates final scores
  - Updates user statistics

- `get_learning_recommendations(user_id)` → `LearningRecommendation`
  - Analyzes all user evaluations
  - Identifies weak areas
  - Generates study tips

**Progress Tracking**:
- Total sessions completed
- Average score across all quizzes
- Weak vs. strong topics
- Recent performance trend

---

#### `src/api/routes.py`
**Purpose**: FastAPI HTTP endpoints

**Route Groups**:

1. **Email Management** (`/emails/...`)
   - Upload, search, stats, categories

2. **Quiz Management** (`/quiz/...`)
   - Generate, submit answer, get session, complete

3. **User Progress** (`/user/...`)
   - Progress stats, recommendations

4. **Health** (`/health`)
   - System health check

**Global Components**:
- `vector_store` - VectorStore instance
- `evaluator` - LLMEvaluator instance
- `quiz_generator` - QuizGenerator instance
- `session_manager` - SessionManager instance

---

## 🔄 Data Flow

### Quiz Generation Flow
```
1. User requests quiz
   ↓
2. QuizGenerator retrieves relevant donor emails from VectorStore
   ↓
3. LLM generates questions based on email context
   ↓
4. SessionManager creates new session
   ↓
5. Questions returned to user
```

### Answer Evaluation Flow
```
1. User submits answer
   ↓
2. SessionManager receives answer
   ↓
3. LLMEvaluator constructs evaluation prompt
   ↓
4. LLM analyzes answer and provides feedback
   ↓
5. Evaluation stored in session
   ↓
6. UserProgress updated with new data
   ↓
7. Feedback returned to user
```

---

## 🎯 Component Interactions

```
┌──────────────┐
│   FastAPI    │  ← HTTP Requests
│   (routes)   │
└──────┬───────┘
       │
       ├─────→ SessionManager ←→ LLMEvaluator ←→ OpenAI/Anthropic
       │              ↓
       └─────→ QuizGenerator ←→ VectorStore ←→ ChromaDB
                      ↓
               LLMProvider
```

---

## 💾 Data Persistence

### ChromaDB Storage
- **Location**: `data/chromadb/`
- **Format**: SQLite + embeddings
- **Persistence**: Automatic
- **Backup**: Copy entire `data/` directory

### Session Storage
- **Type**: In-memory (not persisted)
- **Lifetime**: Application runtime
- **Production**: Use Redis or database

### User Progress
- **Type**: In-memory (not persisted)
- **Lifetime**: Application runtime
- **Production**: Use PostgreSQL or MongoDB

---

## 🧪 Testing Structure

```
tests/
├── test_models.py          # Pydantic model validation
├── test_vector_store.py    # Vector DB operations
├── test_llm_evaluator.py   # Answer evaluation
├── test_quiz_generator.py  # Question generation
├── test_api.py             # API endpoints
└── test_integration.py     # End-to-end workflows
```

---

## 🔧 Configuration Files

### `.env` (Not in repo)
```bash
OPENAI_API_KEY=sk-...
LLM_PROVIDER=openai
MODEL_NAME=gpt-4o-mini
CHROMADB_PATH=./data/chromadb
PORT=8000
DEBUG=True
```

### `docker-compose.yml`
- Defines services, volumes, networks
- Environment variable injection
- Health checks
- Port mapping

---

## 📦 Dependencies Overview

### Core Framework
- **FastAPI** - Modern async web framework
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation

### AI/ML
- **OpenAI** - GPT models for evaluation
- **Anthropic** - Claude models (alternative)
- **Sentence Transformers** - Text embeddings
- **ChromaDB** - Vector database

### Utilities
- **python-dotenv** - Environment management
- **python-multipart** - File uploads
- **pandas** - Data manipulation (future use)

---

## 🚀 Deployment Architecture

### Local Development
```
User → FastAPI (port 8000) → ChromaDB (local files)
                            → OpenAI API (cloud)
```

### Docker Deployment
```
User → nginx (port 80) → FastAPI container (port 8000)
                       → ChromaDB volume
                       → OpenAI API (cloud)
```

### Production (Recommended)
```
User → Load Balancer → FastAPI instances (scaled)
                     → Redis (session cache)
                     → PostgreSQL (user data)
                     → ChromaDB cluster
                     → OpenAI API (with rate limiting)
```

---

## 📚 Code Organization Principles

1. **Separation of Concerns**
   - Each module has single responsibility
   - Clear boundaries between layers

2. **Dependency Injection**
   - Components receive dependencies
   - Easy to test and mock

3. **Type Safety**
   - Pydantic models everywhere
   - Type hints throughout

4. **Modularity**
   - Can swap LLM providers
   - Can replace vector DB
   - Can add new question types

5. **Async-Ready**
   - FastAPI routes support async
   - Ready for concurrent requests

---

This structure ensures:
- ✅ Clean, maintainable code
- ✅ Easy testing
- ✅ Scalable architecture
- ✅ Type safety
- ✅ Production-ready
