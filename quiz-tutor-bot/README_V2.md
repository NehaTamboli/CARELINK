# 🎓 AI Non-Profit Quiz & Tutor Bot v2.0

**Complete AI-Powered Educational System with Quiz Generation and Intelligent Chatbot**

![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-green.svg)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-orange.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

---

## 🌟 What's This?

An intelligent learning platform that:

✅ **Generates quiz questions** from donor emails using AI  
✅ **Evaluates answers** with detailed, educational feedback  
✅ **Provides AI chatbot** assistance using RAG (Retrieval-Augmented Generation)  
✅ **Tracks progress** and identifies knowledge gaps  
✅ **Delivers personalized learning** recommendations

Perfect for **non-profit education**, **student training**, or any **knowledge-base learning** scenario.

---

## 🎯 Key Features

### 1. 📝 AI Quiz System

- **Auto-Generated Questions** from your knowledge base
- **Multiple Question Types:** MCQ, short answer, essay
- **Difficulty Levels:** Easy, medium, hard
- **Instant Evaluation** with detailed feedback
- **Score Tracking** and progress monitoring

### 2. 💬 Intelligent Chatbot

- **RAG-Based:** Retrieves context from knowledge base
- **Educational Responses:** Explains concepts clearly
- **Conversation Memory:** Maintains chat history
- **Suggested Questions:** Helps users get started
- **Context-Aware:** Answers based on uploaded content

### 3. 🎨 Modern Dashboard

- **Clean, Professional UI**
- **Two-Panel Layout:** Quiz + Chatbot side-by-side
- **Real-Time Updates:** Live score and progress
- **Mobile Responsive:** Works on all devices
- **No Team Section:** Focused on learning

---

## 🏗️ Architecture

### Tech Stack

**Backend:**
- Python 3.11+
- FastAPI (async web framework)
- OpenAI GPT-4o-mini (LLM)
- ChromaDB (vector database)
- Sentence Transformers (embeddings)

**Frontend:**
- Vanilla HTML/CSS/JavaScript
- No framework dependencies
- Fast and lightweight

### Project Structure

```
quiz-tutor-bot/
│
├── backend/                    # Python Backend
│   ├── main.py                 # FastAPI app entry point
│   │
│   ├── api/                    # API Routes
│   │   ├── __init__.py
│   │   └── routes.py           # All endpoints
│   │
│   ├── chatbot/                # AI Chatbot (NEW!)
│   │   ├── __init__.py
│   │   └── chatbot.py          # RAG-based chatbot
│   │
│   ├── quiz/                   # Quiz System
│   │   ├── __init__.py
│   │   ├── generator.py        # Question generation
│   │   └── session_manager.py  # Session & progress
│   │
│   ├── llm/                    # LLM Integration
│   │   ├── __init__.py
│   │   ├── providers.py        # OpenAI/Anthropic
│   │   └── evaluator.py        # Answer evaluation
│   │
│   ├── vector_db/              # Vector Database
│   │   ├── __init__.py
│   │   └── vector_store.py     # ChromaDB operations
│   │
│   └── models/                 # Data Models
│       ├── __init__.py
│       └── schemas.py          # Pydantic schemas
│
├── frontend/                   # Frontend (NEW!)
│   ├── index.html              # Main dashboard
│   ├── styles.css              # Styling
│   └── script.js               # Frontend logic
│
├── data/                       # Data Storage
│   └── chromadb/               # Vector DB files
│
├── requirements.txt            # Python dependencies
├── .env.example                # Environment template
├── Dockerfile                  # Docker config
├── docker-compose.yml          # Docker Compose
│
└── Documentation
    ├── README_V2.md            # This file
    ├── RUN_INSTRUCTIONS.md     # How to run
    ├── NEW_FEATURES.md         # What's new
    ├── SETUP_GUIDE.md          # Setup details
    └── API_DOCUMENTATION.md    # API reference
```

---

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- OpenAI API key
- Git (optional)

### 1. Installation

```bash
# Navigate to project
cd quiz-tutor-bot

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# OR
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt
```

### 2. Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit and add your OpenAI API key
nano .env
```

**Add to .env:**
```bash
OPENAI_API_KEY=sk-your-actual-api-key-here
```

### 3. Run Application

```bash
# Go to backend directory
cd backend

# Start the server
python main.py
```

### 4. Access Dashboard

Open your browser:
```
http://localhost:8000
```

**Done!** 🎉

---

## 📖 Usage Guide

### Step 1: Upload Donor Emails

Build your knowledge base by uploading donor emails.

**Quick way (sample data):**
```bash
python sample_test.py
```

**Manual way (API):**
```bash
curl -X POST "http://localhost:8000/api/v1/emails/upload" \
  -H "Content-Type: application/json" \
  -d '{
    "sender": "donor@example.com",
    "subject": "Volunteer Inquiry",
    "content": "I want to help with your programs...",
    "category": "volunteer"
  }'
```

### Step 2: Start a Quiz

1. Click **"Start Quiz"** button
2. Choose:
   - Number of questions (3, 5, or 10)
   - Difficulty (Easy, Medium, Hard)
3. Click **"Start Quiz"** again

### Step 3: Answer Questions

- Read the question carefully
- For multiple choice: Click an option
- For text answers: Type your response
- Click **"Submit"**

### Step 4: Review Feedback

After submission, you'll see:
- ✅ Correctness (Correct/Incorrect)
- 📊 Score (out of max points)
- 💬 Quick Feedback
- 📚 Detailed Explanation
- ✨ Your Strengths
- 🎯 Concepts to Review
- 🚀 Areas for Improvement

Click **"Next"** to continue.

### Step 5: See Final Results

After completing all questions:
- 🎉 Overall percentage
- 📊 Total score
- ✅ Questions correct
- 🔄 Option to retake

### Step 6: Chat with AI Assistant

In the **Chatbot Panel** (right side):

1. Type a question like:
   - "What is donor stewardship?"
   - "How do I improve volunteer engagement?"
   - "Explain the quiz concept I just learned"

2. Get AI-powered response based on:
   - Uploaded donor emails
   - General non-profit knowledge
   - Quiz concepts

3. Use suggested questions to get started

4. Clear chat anytime with **"Clear"** button

---

## 🔧 API Endpoints

### Chatbot Endpoints

```
POST   /api/v1/chat                      # Send message to chatbot
GET    /api/v1/chat/suggestions          # Get suggested questions
GET    /api/v1/chat/history/{session_id} # Get conversation history
DELETE /api/v1/chat/session/{session_id} # Clear chat session
```

### Quiz Endpoints

```
POST /api/v1/quiz/generate    # Generate new quiz
GET  /api/v1/quiz/question    # Get next question
POST /api/v1/quiz/answer      # Submit answer for evaluation
GET  /api/v1/quiz/session/{id}# Get session details
```

### Email Management

```
POST /api/v1/emails/upload    # Upload donor email
GET  /api/v1/emails/search    # Search emails
GET  /api/v1/emails/stats     # Get database statistics
```

### Health Check

```
GET /api/v1/health            # Check API status
```

**Full API Documentation:**
```
http://localhost:8000/api/docs
```

---

## 💡 How It Works

### Quiz Generation Flow

```
1. User requests quiz
   ↓
2. System searches vector DB for relevant donor emails
   ↓
3. LLM generates questions based on email context
   ↓
4. Questions returned to user
   ↓
5. User submits answer
   ↓
6. LLM evaluates with detailed feedback
   ↓
7. Process repeats until quiz complete
```

### Chatbot RAG Flow

```
1. User sends message
   ↓
2. Search vector DB for relevant donor emails
   ↓
3. Retrieve top 3 most relevant documents
   ↓
4. Build prompt: context + conversation history + new message
   ↓
5. Send to LLM (GPT-4o-mini)
   ↓
6. LLM generates contextual response
   ↓
7. Response shown to user
   ↓
8. Message added to conversation history
```

---

## 🎯 Example Scenarios

### Scenario 1: Learning Donor Communication

**1. Upload donor emails:**
```bash
# Email about monthly donations, volunteer requests, partnership inquiries
```

**2. Take quiz:**
- Questions generated about donor stewardship, engagement, retention

**3. Get feedback:**
- Detailed explanations of correct answers
- Tips for improvement

**4. Ask chatbot:**
- "What are best practices for donor thank-you messages?"
- Get AI response based on uploaded emails

### Scenario 2: Training New Staff

**1. Upload training materials** (as "donor emails")

**2. Generate quizzes** on key topics

**3. Staff take quizzes** and get instant feedback

**4. Use chatbot** for clarification and Q&A

---

## 🔐 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `OPENAI_API_KEY` | OpenAI API key | - | ✅ Yes |
| `ANTHROPIC_API_KEY` | Anthropic API key | - | Optional |
| `LLM_PROVIDER` | `openai` or `anthropic` | `openai` | No |
| `MODEL_NAME` | Model to use | `gpt-4o-mini` | No |
| `CHROMADB_PATH` | Vector DB storage path | `./data/chromadb` | No |
| `COLLECTION_NAME` | ChromaDB collection | `donor_emails` | No |
| `HOST` | Server host | `0.0.0.0` | No |
| `PORT` | Server port | `8000` | No |
| `DEBUG` | Debug mode | `True` | No |

---

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# 1. Configure
cp .env.example .env
# Add your OPENAI_API_KEY

# 2. Build and run
docker-compose up --build

# 3. Access at http://localhost:8000
```

### Using Dockerfile

```bash
# Build image
docker build -t quiz-tutor-bot .

# Run container
docker run -d \
  --name quiz-bot \
  -p 8000:8000 \
  -e OPENAI_API_KEY=your-key \
  -v $(pwd)/data:/app/data \
  quiz-tutor-bot
```

---

## 🧪 Testing

### Run Comprehensive Test

```bash
python sample_test.py
```

This will:
1. ✅ Check API health
2. ✅ Upload 4 sample donor emails
3. ✅ Generate a 3-question quiz
4. ✅ Submit answers
5. ✅ Display evaluations
6. ✅ Show final results

### Test Individual Features

**Test Chatbot:**
```bash
curl -X POST "http://localhost:8000/api/v1/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "What is donor engagement?"}'
```

**Test Quiz:**
```bash
curl -X POST "http://localhost:8000/api/v1/quiz/generate" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test_user", "num_questions": 3}'
```

---

## 📊 Screenshots

### Dashboard View
```
┌─────────────────────────────────────────────────┐
│  🎓 AI Quiz & Tutor Bot                         │
│  Master Non-Profit Concepts with AI             │
└─────────────────────────────────────────────────┘

┌──────────┐  ┌──────────┐  ┌──────────┐
│ 📚       │  │ ✅       │  │ 📊       │
│ 10       │  │ 85%      │  │ 3/5      │
│ Docs     │  │ Score    │  │ Progress │
└──────────┘  └──────────┘  └──────────┘

┌────────────────────────┬────────────────────────┐
│  📝 Quiz Panel         │ 💬 AI Assistant        │
│                        │                        │
│  Q1/5: What is...?     │ > What is donor...?    │
│                        │                        │
│  [Option A]            │ Donor stewardship...   │
│  [Option B]            │                        │
│  [Option C]            │ > Can you explain...?  │
│  [Option D]            │                        │
│                        │ Of course! It means... │
│  [Submit Answer]       │                        │
│                        │ [Type message...]      │
└────────────────────────┴────────────────────────┘
```

---

## 🚧 Troubleshooting

### "Cannot connect to API"
```bash
# Check if server is running
cd backend && python main.py
```

### "OpenAI API key not found"
```bash
# Verify .env file
cat .env | grep OPENAI_API_KEY
```

### "No questions generated"
```bash
# Upload emails first
python sample_test.py
```

### Frontend not loading
```bash
# Verify files exist
ls frontend/
# Restart server
cd backend && python main.py
```

See **RUN_INSTRUCTIONS.md** for detailed troubleshooting.

---

## 📚 Documentation

- **RUN_INSTRUCTIONS.md** - Complete running guide
- **NEW_FEATURES.md** - What's new in v2.0
- **SETUP_GUIDE.md** - Detailed setup
- **API_DOCUMENTATION.md** - API reference
- **PROJECT_STRUCTURE.md** - Architecture overview

---

## 🤝 Contributing

Contributions welcome! Areas for improvement:

- [ ] User authentication
- [ ] Persistent database for progress
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Voice input for chatbot
- [ ] Export results to PDF

---

## 📄 License

MIT License - feel free to use for educational purposes.

---

## 🙏 Credits

Built with:
- **FastAPI** - Modern web framework
- **OpenAI** - GPT-4o-mini for LLM
- **ChromaDB** - Vector database
- **Sentence Transformers** - Embeddings

---

## 📞 Support

Need help?
1. Check API docs: http://localhost:8000/api/docs
2. Read RUN_INSTRUCTIONS.md
3. Review troubleshooting section
4. Open an issue on GitHub

---

**Happy Learning! 🚀**

Built with ❤️ for Non-Profit Education
