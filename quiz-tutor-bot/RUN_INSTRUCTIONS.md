# 🚀 Run Instructions - AI Non-Profit Quiz & Tutor Bot

## 📁 Project Structure

```
quiz-tutor-bot/
├── backend/                    # Python Backend
│   ├── main.py                 # FastAPI application
│   ├── api/                    # API routes
│   ├── quiz/                   # Quiz generation logic
│   ├── llm/                    # LLM integration
│   ├── vector_db/              # ChromaDB vector database
│   ├── chatbot/                # AI chatbot with RAG
│   └── models/                 # Data schemas
│
├── frontend/                   # HTML/CSS/JS Frontend
│   ├── index.html              # Main dashboard
│   ├── styles.css              # Styling
│   └── script.js               # Frontend logic
│
├── data/                       # Data storage
│   └── chromadb/               # Vector database storage
│
├── requirements.txt            # Python dependencies
├── .env                        # Environment variables
└── Dockerfile                  # Docker configuration
```

---

## ⚡ Quick Start (Local)

### Step 1: Setup Environment

```bash
# Navigate to project
cd quiz-tutor-bot

# Create virtual environment
python -m venv venv

# Activate it
source venv/bin/activate  # Linux/Mac
# OR
venv\Scripts\activate     # Windows
```

### Step 2: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 3: Configure Environment Variables

```bash
# Copy example
cp .env.example .env

# Edit .env and add your API key
nano .env  # or use your favorite editor
```

**Required in .env:**
```bash
OPENAI_API_KEY=sk-your-actual-api-key-here
```

### Step 4: Run the Application

```bash
cd backend
python main.py
```

### Step 5: Access the Application

Open your browser and go to:

```
http://localhost:8000
```

**That's it!** The frontend will automatically load.

---

## 🐳 Quick Start (Docker)

### Step 1: Configure

```bash
cd quiz-tutor-bot
cp .env.example .env
# Add your OPENAI_API_KEY to .env
```

### Step 2: Build and Run

```bash
docker-compose up --build
```

### Step 3: Access

```
http://localhost:8000
```

---

## 📚 Using the Application

### 1. Upload Donor Emails

First, populate the knowledge base by uploading some donor emails.

**Option A: Use the sample script**
```bash
cd quiz-tutor-bot
python sample_test.py
```

**Option B: Upload via API**
```bash
curl -X POST "http://localhost:8000/api/v1/emails/upload" \
  -H "Content-Type: application/json" \
  -d '{
    "sender": "donor@example.com",
    "subject": "Volunteer Interest",
    "content": "I would like to volunteer for your literacy programs...",
    "category": "volunteer"
  }'
```

### 2. Take a Quiz

1. Click **"Start Quiz"** on the dashboard
2. Select number of questions and difficulty
3. Answer each question
4. Get instant AI feedback with detailed explanations
5. See your final score

### 3. Chat with AI Assistant

1. Type your question in the chatbot panel
2. Get AI-powered responses based on donor email knowledge
3. Ask about:
   - Donor communication
   - NGO activities
   - Quiz concepts
   - Non-profit best practices

---

## 🔧 API Endpoints

All endpoints are available at `/api/v1/`:

### Chatbot
- `POST /chat` - Send message to chatbot
- `GET /chat/suggestions` - Get suggested questions
- `GET /chat/history/{session_id}` - Get conversation history

### Quiz
- `POST /quiz/generate` - Generate new quiz
- `GET /quiz/question` - Get next question
- `POST /quiz/answer` - Submit answer for evaluation

### Emails
- `POST /emails/upload` - Upload donor email
- `GET /emails/search` - Search emails
- `GET /emails/stats` - Get database statistics

**Full API Documentation:**
```
http://localhost:8000/api/docs
```

---

## 🧪 Testing

### Test the Complete System

```bash
# Run comprehensive test
python sample_test.py
```

This will:
1. ✅ Check API health
2. ✅ Upload sample donor emails
3. ✅ Generate a quiz
4. ✅ Submit answers
5. ✅ Show detailed evaluation results

### Test Individual Components

```bash
# Test chatbot
curl -X POST "http://localhost:8000/api/v1/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "What is donor stewardship?"}'

# Test quiz generation
curl -X POST "http://localhost:8000/api/v1/quiz/generate" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test_user", "num_questions": 3}'
```

---

## 🔍 Troubleshooting

### Issue: "Cannot connect to server"
**Solution:**
```bash
# Make sure you're in the backend directory
cd backend

# Check if server is running
python main.py
```

### Issue: "OpenAI API key not found"
**Solution:**
```bash
# Verify .env file exists in project root
cat .env | grep OPENAI_API_KEY

# Make sure it's set correctly (no quotes, no spaces)
OPENAI_API_KEY=sk-your-key-here
```

### Issue: "Module not found"
**Solution:**
```bash
# Make sure virtual environment is activated
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue: "Port 8000 already in use"
**Solution:**
```bash
# Option 1: Change port in .env
PORT=8001

# Option 2: Kill the process
lsof -ti:8000 | xargs kill -9
```

### Issue: "No questions could be generated"
**Solution:**
You need to upload donor emails first!
```bash
python sample_test.py
```

### Issue: Frontend not loading
**Solution:**
```bash
# Make sure frontend files exist
ls frontend/

# Should show:
# index.html  styles.css  script.js

# Restart the server
cd backend
python main.py
```

---

## 🎯 Features Overview

### Quiz System
✅ AI-generated questions from donor emails  
✅ Multiple question types (MCQ, short answer, essay)  
✅ Adjustable difficulty levels  
✅ Instant evaluation with detailed feedback  
✅ Score tracking and progress monitoring  
✅ Personalized learning recommendations  

### AI Chatbot
✅ RAG-based (Retrieval-Augmented Generation)  
✅ Context from donor email knowledge base  
✅ Educational responses  
✅ Conversation history  
✅ Suggested questions  
✅ Help with quiz concepts  

### Dashboard
✅ Clean, modern UI  
✅ Quiz panel with real-time evaluation  
✅ Chatbot panel with conversational AI  
✅ Progress tracking  
✅ Statistics display  
✅ Mobile-responsive design  

---

## 📦 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `OPENAI_API_KEY` | OpenAI API key | - | Yes* |
| `ANTHROPIC_API_KEY` | Anthropic API key | - | Yes* |
| `LLM_PROVIDER` | `openai` or `anthropic` | `openai` | No |
| `MODEL_NAME` | Model to use | `gpt-4o-mini` | No |
| `CHROMADB_PATH` | Vector DB path | `./data/chromadb` | No |
| `HOST` | Server host | `0.0.0.0` | No |
| `PORT` | Server port | `8000` | No |
| `DEBUG` | Debug mode | `True` | No |

\* One of OPENAI_API_KEY or ANTHROPIC_API_KEY is required

---

## 🌟 Example Usage Flow

1. **Start the application**
   ```bash
   cd backend && python main.py
   ```

2. **Open browser to http://localhost:8000**

3. **Upload sample emails** (if database is empty)
   ```bash
   python sample_test.py
   ```

4. **Take a quiz**
   - Click "Start Quiz"
   - Answer questions
   - Get instant feedback

5. **Ask the chatbot**
   - Type: "What are best practices for donor communication?"
   - Get AI-powered response

6. **View your progress**
   - Check score percentage
   - See questions answered
   - Review knowledge base size

---

## 🔗 Links

- **Application:** http://localhost:8000
- **API Docs:** http://localhost:8000/api/docs
- **Health Check:** http://localhost:8000/api/v1/health

---

## 💡 Pro Tips

1. **Upload diverse emails** - More varied content = better questions
2. **Start with easy difficulty** - Build confidence
3. **Use the chatbot** - Ask for clarification on concepts
4. **Review explanations** - Learn from detailed feedback
5. **Check suggestions** - Try the suggested chatbot questions

---

## 🆘 Need Help?

1. Check API docs: http://localhost:8000/api/docs
2. Review logs in terminal
3. Read SETUP_GUIDE.md for detailed setup
4. Check API_DOCUMENTATION.md for endpoint details

---

**Ready to start learning! 🚀**
