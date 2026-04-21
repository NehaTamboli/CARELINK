# 🚀 CareLink Fullstack Setup Guide

Complete guide to run the AI-Powered Non-Profit Support Triage System with both Frontend and Backend.

## 📋 Prerequisites

### Frontend Requirements
- Node.js 18+ or higher
- pnpm (or npm/yarn)

### Backend Requirements
- Python 3.9 or higher
- pip package manager
- OpenAI API key (for LLM features)

## 🔧 Installation

### Step 1: Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create and activate virtual environment:**

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

3. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

4. **Download spaCy NER model:**
```bash
python -m spacy download en_core_web_sm
```

5. **Configure environment variables:**
```bash
cp .env.example .env
```

Edit `backend/.env` and add your OpenAI API key:
```env
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
```

### Step 2: Frontend Setup

1. **Navigate back to root and install frontend dependencies:**
```bash
cd ..
pnpm install
```

2. **Configure frontend environment:**
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_BACKEND_URL=http://localhost:8000/api
```

## 🏃 Running the Application

### Option 1: Run Both Servers Separately (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python main.py
```

Backend will start at: `http://localhost:8000`
API Docs available at: `http://localhost:8000/docs`

**Terminal 2 - Frontend:**
```bash
# In root directory
pnpm run dev
```

Frontend will start (Figma Make preview will show automatically)

### Option 2: Use the Combined Script

Create a startup script for your platform:

**Windows (`start.bat`):**
```batch
@echo off
start cmd /k "cd backend && venv\Scripts\activate && python main.py"
timeout /t 3
start cmd /k "pnpm run dev"
```

**macOS/Linux (`start.sh`):**
```bash
#!/bin/bash
cd backend
source venv/bin/activate
python main.py &
BACKEND_PID=$!
cd ..
pnpm run dev
kill $BACKEND_PID
```

Make executable and run:
```bash
chmod +x start.sh
./start.sh
```

## 🔍 Verifying the Setup

### 1. Check Backend Health

Open browser or use curl:
```bash
curl http://localhost:8000/
```

Expected response:
```json
{
  "status": "online",
  "service": "CareLink Triage API",
  "version": "1.0.0",
  "features": {
    "llm_enabled": true,
    "ner_enabled": true
  }
}
```

### 2. Test Message Analysis

```bash
curl -X POST "http://localhost:8000/api/analyze" \
  -H "Content-Type: application/json" \
  -d '{"message": "I want to donate ₹5000 for education. My name is Priya from Delhi."}'
```

### 3. Check Frontend

- Open your browser to the Figma Make preview
- Navigate to Dashboard
- Try analyzing a message
- Check if AI Assistant Bot appears in bottom-right corner

## 🎯 Testing the Features

### 1. Message Analysis with AI
1. Go to **Dashboard** page
2. Enter a test message:
   ```
   Hi, I would like to donate ₹10,000 for education support. 
   My name is Rahul from Mumbai. You can reach me at rahul@example.com
   ```
3. Click "Analyze Message"
4. Verify you see:
   - ✅ Intent classification (Donation)
   - ✅ Urgency scale visualization
   - ✅ Extracted entities (name, amount, location, email)
   - ✅ AI-generated response

### 2. AI Quiz & Tutor Bot
1. Look for the AI bot icon in bottom-right corner
2. Click to open the bot
3. Try the "Take a Quiz" option
4. Answer quiz questions and see scoring
5. Test other topics:
   - How to Donate
   - Send Donor Emails
   - Volunteer Information
   - Contact Support

### 3. Messages Page
1. Navigate to **Messages** page
2. View analyzed messages
3. Click "View Details" on any message
4. See detailed urgency analysis and NER display

## 🐛 Troubleshooting

### Backend Issues

**Issue: `ModuleNotFoundError: No module named 'openai'`**
```bash
cd backend
pip install -r requirements.txt
```

**Issue: spaCy model not found**
```bash
python -m spacy download en_core_web_sm
```

**Issue: OpenAI API errors**
- Check your API key in `backend/.env`
- Verify you have API credits
- System will fallback to rule-based if LLM unavailable

**Issue: Port 8000 already in use**
```bash
# Find and kill the process
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:8000 | xargs kill -9
```

### Frontend Issues

**Issue: CORS errors in browser console**
- Verify backend is running on port 8000
- Check `VITE_BACKEND_URL` in `.env`
- Ensure backend CORS is configured correctly

**Issue: "Cannot connect to backend" errors**
- Confirm backend server is running
- Check browser console for actual error
- Verify URL in `src/app/utils/api.ts`

**Issue: Components not rendering**
```bash
# Clear cache and reinstall
rm -rf node_modules
pnpm install
```

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Dashboard   │  │   Messages   │  │  AI Bot      │ │
│  │              │  │   Page       │  │  Assistant   │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘ │
│         │                 │                  │          │
│         └─────────────────┴──────────────────┘          │
│                           │                              │
│                    ┌──────▼──────┐                      │
│                    │   API Utils  │                      │
│                    └──────┬───────┘                      │
└────────────────────────────┼─────────────────────────────┘
                            │
                    HTTP/REST API
                            │
┌────────────────────────────▼─────────────────────────────┐
│                 Backend (FastAPI)                         │
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Message      │  │   NER        │  │   Quiz       │  │
│  │ Analysis     │  │   Extraction │  │   System     │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘  │
│         │                 │                              │
│         └─────────────────┘                              │
│                   │                                      │
│         ┌─────────▼──────────┐                          │
│         │  OpenAI GPT-3.5    │                          │
│         │  spaCy NER         │                          │
│         └────────────────────┘                          │
└──────────────────────────────────────────────────────────┘
```

## 🔑 API Key Setup

### Getting an OpenAI API Key

1. Go to https://platform.openai.com/signup
2. Create an account or sign in
3. Navigate to API Keys section
4. Click "Create new secret key"
5. Copy the key (starts with `sk-`)
6. Add to `backend/.env`:
   ```env
   OPENAI_API_KEY=sk-your-key-here
   ```

**Note:** OpenAI API is not free, but new accounts get $5 in free credits. Each message analysis costs approximately $0.001-0.002.

### Running Without OpenAI (Free Alternative)

The system works without OpenAI using:
- Rule-based classification
- Regex-based NER
- Template responses

Simply don't set the `OPENAI_API_KEY` or set it to a placeholder.

## 🚀 Production Deployment

### Backend Deployment

**Option 1: Heroku**
```bash
cd backend
echo "web: uvicorn main:app --host=0.0.0.0 --port=\$PORT" > Procfile
git init
heroku create carelink-backend
heroku config:set OPENAI_API_KEY=your-key
git add .
git commit -m "Deploy backend"
git push heroku main
```

**Option 2: DigitalOcean App Platform**
- Create new Python app
- Point to `backend/` directory
- Set environment variables
- Deploy

**Option 3: Docker**
```bash
cd backend
docker build -t carelink-backend .
docker run -p 8000:8000 -e OPENAI_API_KEY=your-key carelink-backend
```

### Frontend Deployment

Already handled by Figma Make platform!

## 📈 Performance Tips

1. **Backend Caching**: Implement Redis for repeated queries
2. **Database**: Use Supabase for persistent storage
3. **Rate Limiting**: Add rate limiting for API endpoints
4. **Load Balancing**: Use multiple backend instances
5. **CDN**: Serve frontend static assets via CDN

## 📞 Support

- **Backend Issues**: Check `backend/README.md`
- **Frontend Issues**: Check main `README.md`
- **API Documentation**: http://localhost:8000/docs

## 🎉 Success Checklist

- [ ] Backend starts on port 8000
- [ ] Frontend preview shows CareLink dashboard
- [ ] Message analysis returns AI classification
- [ ] Urgency scale shows visual indicators
- [ ] NER extracts entities correctly
- [ ] AI bot opens and responds
- [ ] Quiz system works
- [ ] Messages page shows analyzed data

---

**You're all set! 🎊 Enjoy building with CareLink!**
