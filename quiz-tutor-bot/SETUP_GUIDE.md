# 📋 Setup & Installation Guide

This guide will walk you through setting up the **Non-Profit Quiz/Tutor Bot** from scratch.

---

## 📦 Prerequisites

Before you begin, ensure you have:

1. **Python 3.11 or higher**
   ```bash
   python --version  # Should show 3.11+
   ```

2. **pip** (Python package manager)
   ```bash
   pip --version
   ```

3. **OpenAI API Key** (Required)
   - Sign up at https://platform.openai.com/
   - Create an API key from the dashboard
   - Keep it safe (never commit to version control)

4. **Git** (for cloning)
   ```bash
   git --version
   ```

5. **Docker** (Optional - for containerized deployment)
   ```bash
   docker --version
   docker-compose --version
   ```

---

## 🚀 Method 1: Local Installation

### Step 1: Navigate to Project Directory

```bash
cd quiz-tutor-bot
```

### Step 2: Create Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate it
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

You should see `(venv)` prefix in your terminal.

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

This will install:
- FastAPI & Uvicorn (web server)
- OpenAI & Anthropic (LLM clients)
- ChromaDB (vector database)
- Sentence Transformers (embeddings)
- All other dependencies

### Step 4: Configure Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit the .env file
nano .env  # or use your preferred editor
```

**Required settings:**
```bash
OPENAI_API_KEY=sk-your-actual-api-key-here
```

**Optional settings (defaults are fine):**
```bash
LLM_PROVIDER=openai
MODEL_NAME=gpt-4o-mini
CHROMADB_PATH=./data/chromadb
PORT=8000
DEBUG=True
```

### Step 5: Create Data Directory

```bash
mkdir -p data/chromadb
```

### Step 6: Run the Application

```bash
python main.py
```

You should see:
```
🚀 Starting Quiz/Tutor Bot API...
📚 Initializing vector store at ./data/chromadb...
🤖 Initializing openai LLM provider...
📊 Initializing answer evaluator...
❓ Initializing quiz generator...
📝 Initializing session manager...
✅ All components initialized successfully!
📈 Vector store has 0 documents
🌐 API documentation available at http://localhost:8000/docs
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Step 7: Verify Installation

Open your browser and visit:
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/api/v1/health

---

## 🐳 Method 2: Docker Installation

### Step 1: Navigate to Project Directory

```bash
cd quiz-tutor-bot
```

### Step 2: Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit with your API key
nano .env
```

Set:
```bash
OPENAI_API_KEY=sk-your-actual-api-key-here
```

### Step 3: Build and Run

```bash
# Build and start the container
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

### Step 4: Verify

```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs -f

# Test health endpoint
curl http://localhost:8000/api/v1/health
```

### Step 5: Stop Container

```bash
# Stop
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

---

## 🧪 Testing Your Installation

### 1. Upload Sample Donor Email

```bash
curl -X POST "http://localhost:8000/api/v1/emails/upload" \
  -H "Content-Type: application/json" \
  -d '{
    "sender": "rohan.rawat@donors.org",
    "subject": "Monthly Donation Program",
    "content": "I would like to set up a monthly donation of ₹5,000 to support your education programs. Please provide details about the process and impact reporting.",
    "category": "donation"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Email uploaded successfully",
  "document_id": "abc123-uuid"
}
```

### 2. Check Database Stats

```bash
curl http://localhost:8000/api/v1/emails/stats
```

Expected:
```json
{
  "total_documents": 1,
  "total_categories": 1,
  "categories": ["donation"]
}
```

### 3. Generate a Quiz

```bash
curl -X POST "http://localhost:8000/api/v1/quiz/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user_001",
    "num_questions": 2,
    "difficulty": "easy"
  }'
```

You should receive a session with questions!

---

## 🔧 Troubleshooting

### Issue: "ModuleNotFoundError"
**Solution:**
```bash
# Make sure virtual environment is activated
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue: "OpenAI API key not found"
**Solution:**
```bash
# Check .env file exists
ls -la .env

# Verify OPENAI_API_KEY is set
cat .env | grep OPENAI_API_KEY

# Make sure no extra spaces or quotes
OPENAI_API_KEY=sk-your-key  # ✅ Correct
OPENAI_API_KEY="sk-your-key"  # ❌ Remove quotes
```

### Issue: "ChromaDB connection error"
**Solution:**
```bash
# Ensure data directory exists
mkdir -p data/chromadb

# Check permissions
chmod -R 755 data/

# Try deleting and recreating (WARNING: deletes data)
rm -rf data/chromadb
mkdir -p data/chromadb
```

### Issue: "Port 8000 already in use"
**Solution:**
```bash
# Option 1: Change port in .env
PORT=8001

# Option 2: Kill existing process
lsof -ti:8000 | xargs kill -9
```

### Issue: Docker container fails to start
**Solution:**
```bash
# Check logs
docker-compose logs

# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### Issue: "No questions could be generated"
**Solution:**
- You need to upload at least one donor email first
- Run the upload email command from Testing section
- Then try generating quiz again

---

## 📚 Next Steps

Once installed successfully:

1. **Upload More Emails**
   - Use the upload endpoint to build your knowledge base
   - Try different categories: donation, volunteer, partnership, etc.

2. **Explore API Documentation**
   - Visit http://localhost:8000/docs
   - Try all endpoints interactively

3. **Run Sample Script**
   ```bash
   python sample_test.py
   ```

4. **Build a Frontend**
   - Use the API endpoints to create a web interface
   - See README.md for React integration examples

5. **Customize Configuration**
   - Try different LLM models (gpt-4, claude-3-5-sonnet)
   - Adjust difficulty levels
   - Add custom categories

---

## 🎯 Quick Reference

### Start Server (Local)
```bash
source venv/bin/activate
python main.py
```

### Start Server (Docker)
```bash
docker-compose up
```

### Run Tests
```bash
pytest tests/ -v
```

### View Logs
```bash
# Local: stdout
# Docker:
docker-compose logs -f
```

### Reset Database
```bash
rm -rf data/chromadb
mkdir -p data/chromadb
```

---

## ✅ Installation Checklist

- [ ] Python 3.11+ installed
- [ ] Virtual environment created and activated
- [ ] Dependencies installed (`pip install -r requirements.txt`)
- [ ] `.env` file created with OPENAI_API_KEY
- [ ] Data directory exists (`data/chromadb`)
- [ ] Server starts without errors
- [ ] API docs accessible at http://localhost:8000/docs
- [ ] Health check returns success
- [ ] Sample email upload works
- [ ] Quiz generation works

---

**Need Help?** Open an issue on GitHub or check the main README.md for more details.

Happy Learning! 🎓
