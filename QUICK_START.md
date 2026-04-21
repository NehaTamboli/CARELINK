# ⚡ CareLink Quick Start Guide

Get your AI-Powered Non-Profit Triage System running in 5 minutes!

## 🎯 What You're Building

A production-grade triage system featuring:
- 🤖 AI message classification using LLM
- 🎯 4-level urgency detection (Critical → High → Medium → Low)
- 🏷️ Named Entity Recognition (names, emails, phones, amounts, locations)
- 💬 AI-powered response generation
- 📚 Interactive quiz & tutor bot with 5 topics
- 📊 Visual urgency scale and analytics

## 🚀 Super Quick Start (3 Commands)

### 1️⃣ Setup Backend (One-Time)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
cp .env.example .env
# Edit .env and add: OPENAI_API_KEY=sk-your-key-here
```

### 2️⃣ Run Backend
```bash
python main.py
```
✅ Backend running at: http://localhost:8000

### 3️⃣ Run Frontend (New Terminal)
```bash
# In project root
pnpm install  # First time only
```
✅ Frontend will auto-preview in Figma Make!

---

## 📦 What's Included

### Backend (`/backend`)
- **main.py**: FastAPI server with AI endpoints
- **Features**:
  - `/api/analyze` - AI message classification & NER
  - `/api/quiz/*` - Quiz system endpoints
  - `/api/chat` - Chatbot responses
  - Auto-fallback when LLM unavailable

### Frontend Components
- **AIAssistantBot**: Interactive chatbot with 5 help topics
- **UrgencyScale**: Visual urgency indicator
- **NERDisplay**: Entity extraction visualization
- **LLMResponseGenerator**: AI response with typing effect

### Integration
- Frontend → Backend API communication
- Real-time AI analysis
- Persistent message storage (Supabase)

---

## 🔑 Getting OpenAI API Key (Optional but Recommended)

1. Visit: https://platform.openai.com/api-keys
2. Sign up (new users get $5 free credits!)
3. Create new secret key
4. Copy and add to `backend/.env`:
   ```env
   OPENAI_API_KEY=sk-proj-your-key-here
   ```

**Cost**: ~$0.001 per message analysis (very cheap!)

**Without API Key**: System works with rule-based classification (free, less accurate)

---

## ✅ Verify It's Working

### Test 1: Backend Health Check
```bash
curl http://localhost:8000/
```
Should return: `{"status": "online", "llm_enabled": true}`

### Test 2: AI Analysis
```bash
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"message": "I want to donate ₹5000 for education"}'
```

### Test 3: Frontend
1. Open Figma Make preview
2. Go to Dashboard
3. Enter test message:
   ```
   Hi, I'm Priya from Mumbai. I'd like to donate ₹10,000 for 
   children's education. Email: priya@example.com
   ```
4. Click "Analyze Message"
5. Should see:
   - ✅ Category: Donation
   - ✅ Urgency scale
   - ✅ Extracted: name, location, amount, email
   - ✅ AI response

### Test 4: AI Bot
1. Click bot icon (bottom-right)
2. Try "Take a Quiz"
3. Answer questions
4. Test other topics

---

## 🐛 Common Issues & Fixes

### "Cannot connect to backend"
**Fix**: Make sure backend is running on port 8000
```bash
cd backend
python main.py
```

### "Module not found" error
**Fix**: Install dependencies
```bash
pip install -r requirements.txt
```

### spaCy model error
**Fix**: Download the model
```bash
python -m spacy download en_core_web_sm
```

### CORS errors in browser
**Fix**: Backend CORS is pre-configured for frontend. Just ensure both servers are running.

### Port 8000 already in use
**Fix**: Kill the process
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <number> /F

# macOS/Linux
lsof -ti:8000 | xargs kill -9
```

---

## 📚 File Structure

```
carelink/
├── backend/
│   ├── main.py              ⭐ Main API server
│   ├── requirements.txt     📦 Python dependencies
│   ├── .env                 🔑 API keys (create from .env.example)
│   └── README.md            📖 Detailed backend docs
│
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── AIAssistantBot.tsx      🤖 Quiz & chat bot
│   │   │   ├── UrgencyScale.tsx        📊 Visual urgency
│   │   │   ├── NERDisplay.tsx          🏷️ Entity display
│   │   │   └── LLMResponseGenerator.tsx 💬 AI responses
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx           🏠 Main dashboard
│   │   │   └── Messages.tsx            📨 Message management
│   │   │
│   │   └── utils/
│   │       └── api.ts                  🔌 Backend integration
│   │
│   └── styles/
│       └── theme.css                   🎨 Turquoise theme
│
├── FULLSTACK_SETUP.md       📖 Complete setup guide
├── QUICK_START.md           ⚡ This file
└── package.json
```

---

## 🎨 Features Showcase

### 1. AI Message Triage
- **Input**: Any message from donors/volunteers/complainants
- **Output**:
  - Category classification
  - Urgency level (visual scale)
  - Extracted entities (NER)
  - Draft response

### 2. Interactive Quiz Bot
- 5 donor engagement quiz questions
- Real-time scoring
- Explanations for answers
- Progress tracking

### 3. Help Topics
1. 📚 Take a Quiz
2. 💝 How to Donate
3. 📧 Send Donor Emails
4. 👥 Volunteer Information
5. 📞 Contact Support

### 4. Visual Analytics
- Urgency scale with animated markers
- Color-coded entity cards
- Streaming AI responses
- Real-time feedback

---

## 🚢 Next Steps

After basic setup works:

1. **Customize AI Prompts**: Edit classification logic in `backend/main.py`
2. **Add More Quiz Questions**: Extend `QUIZ_QUESTIONS` array
3. **Connect Database**: Use Supabase for message persistence
4. **Add Authentication**: Implement user login system
5. **Deploy**: See `FULLSTACK_SETUP.md` for deployment guides

---

## 📞 Need Help?

- **Backend API Docs**: http://localhost:8000/docs (when running)
- **Full Setup Guide**: See `FULLSTACK_SETUP.md`
- **Backend Details**: See `backend/README.md`
- **Issues**: Check troubleshooting section above

---

## 💡 Pro Tips

1. **Development**: Keep both terminals open (backend + frontend)
2. **Testing**: Use `/docs` endpoint for interactive API testing
3. **Debugging**: Check browser console and terminal logs
4. **Performance**: Backend responds in ~500ms with LLM, ~50ms without
5. **Cost**: OpenAI usage is minimal (~$0.10 for 100 messages)

---

## 🎉 You're Ready!

Your AI-powered non-profit triage system is now running with:
- ✅ Production-grade backend (Python/FastAPI)
- ✅ Beautiful frontend (React/Tailwind)
- ✅ LLM integration (OpenAI GPT-3.5)
- ✅ NER extraction (spaCy)
- ✅ Interactive AI bot
- ✅ Visual urgency classification

**Start analyzing messages and helping non-profits! 🚀**
