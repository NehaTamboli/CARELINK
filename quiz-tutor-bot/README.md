# 🎓 Non-Profit Quiz/Tutor Bot

An **AI-powered educational assessment system** for non-profit sector learning. This application generates personalized quizzes from donor emails, evaluates answers using advanced LLMs, and provides deep contextual feedback to create an effective learning loop.

![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

---

## 🌟 Features

### Core Capabilities
- ✅ **AI-Driven Quiz Generation** - Automatically creates questions from donor email knowledge base
- ✅ **Intelligent Answer Evaluation** - Uses GPT-4/Claude to score and provide detailed feedback
- ✅ **Vector Database Search** - ChromaDB-powered semantic search for contextual learning
- ✅ **Personalized Learning** - Identifies weak areas and recommends targeted study topics
- ✅ **Progress Tracking** - Monitors user performance over time with analytics
- ✅ **Deep Explanations** - Provides comprehensive feedback on every answer

### Technical Features
- 🔥 **FastAPI Backend** - Modern, fast, production-ready REST API
- 🧠 **LLM Integration** - Supports OpenAI (GPT-4) and Anthropic (Claude)
- 📊 **ChromaDB Vector Store** - Efficient semantic search and retrieval
- 🐳 **Docker Support** - Easy deployment with Docker & Docker Compose
- 📝 **Type Safety** - Full Pydantic schemas and type hints
- 🔌 **Modular Architecture** - Clean separation of concerns

---

## 🏗️ Architecture

```
quiz-tutor-bot/
├── src/
│   ├── api/              # FastAPI routes and endpoints
│   ├── llm/              # LLM providers (OpenAI, Anthropic)
│   ├── vector_db/        # ChromaDB vector database
│   ├── quiz/             # Quiz generation & session management
│   └── models/           # Pydantic schemas
├── data/                 # Persistent data storage
├── tests/                # Unit and integration tests
├── main.py               # Application entry point
├── requirements.txt      # Python dependencies
├── Dockerfile            # Container configuration
└── docker-compose.yml    # Multi-service orchestration
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- OpenAI API key (or Anthropic API key)
- Docker (optional, for containerized deployment)

### Installation

#### Option 1: Local Setup

```bash
# Clone the repository
cd quiz-tutor-bot

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env and add your API key
# OPENAI_API_KEY=sk-your-key-here
```

#### Option 2: Docker Setup

```bash
# Create .env file
cp .env.example .env

# Edit .env and add your API key
# OPENAI_API_KEY=sk-your-key-here

# Build and run with Docker Compose
docker-compose up --build
```

---

## 📖 Usage

### 1. Start the Server

```bash
# Local
python main.py

# Docker
docker-compose up
```

The API will be available at `http://localhost:8000`

### 2. Access API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### 3. Upload Donor Emails

```bash
curl -X POST "http://localhost:8000/api/v1/emails/upload" \
  -H "Content-Type: application/json" \
  -d '{
    "sender": "donor@nonprofit.org",
    "subject": "Donation Inquiry",
    "content": "I would like to contribute to your literacy program...",
    "category": "donation"
  }'
```

### 4. Generate a Quiz

```bash
curl -X POST "http://localhost:8000/api/v1/quiz/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "student_123",
    "num_questions": 5,
    "difficulty": "medium"
  }'
```

### 5. Submit an Answer

```bash
curl -X POST "http://localhost:8000/api/v1/quiz/submit-answer" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "session_uuid",
    "question_id": "question_uuid",
    "user_answer": "Your answer here..."
  }'
```

---

## 🔧 API Endpoints

### Email Management
- `POST /api/v1/emails/upload` - Upload donor email
- `GET /api/v1/emails/search?query=...` - Search emails
- `GET /api/v1/emails/categories` - Get all categories
- `GET /api/v1/emails/stats` - Get database statistics

### Quiz Management
- `POST /api/v1/quiz/generate` - Generate new quiz session
- `POST /api/v1/quiz/submit-answer` - Submit answer for evaluation
- `GET /api/v1/quiz/session/{session_id}` - Get session details
- `POST /api/v1/quiz/session/{session_id}/complete` - Complete session
- `GET /api/v1/quiz/session/{session_id}/summary` - Get session summary

### User Progress
- `GET /api/v1/user/{user_id}/progress` - Get user progress
- `GET /api/v1/user/{user_id}/recommendations` - Get learning recommendations

### Health
- `GET /api/v1/health` - Health check endpoint

---

## 🧪 Testing with Sample Data

```python
# test_quiz.py - Sample test script
import requests

API_BASE = "http://localhost:8000/api/v1"

# 1. Upload sample donor email
email_data = {
    "sender": "neha.tamboli@donors.org",
    "subject": "Volunteer Program Interest",
    "content": """
    Dear Team,
    
    I'm interested in your volunteer program and would like to contribute
    my skills in community outreach. I have 5 years of experience in
    non-profit management and am passionate about education initiatives.
    
    Could you share more details about training requirements and time commitments?
    
    Best regards,
    Neha Tamboli
    """,
    "category": "volunteer"
}

response = requests.post(f"{API_BASE}/emails/upload", json=email_data)
print(f"✅ Email uploaded: {response.json()}")

# 2. Generate quiz
quiz_request = {
    "user_id": "student_001",
    "num_questions": 3,
    "difficulty": "medium"
}

response = requests.post(f"{API_BASE}/quiz/generate", json=quiz_request)
session = response.json()
print(f"\n📝 Quiz generated with {len(session['questions'])} questions")

# 3. Answer first question
question = session['questions'][0]
print(f"\nQuestion: {question['text']}")

answer_request = {
    "session_id": session['session_id'],
    "question_id": question['id'],
    "user_answer": "Volunteers play a crucial role in community outreach by providing direct engagement with beneficiaries and bringing diverse skills to support program delivery."
}

response = requests.post(f"{API_BASE}/quiz/submit-answer", json=answer_request)
evaluation = response.json()

print(f"\n{'✅ Correct!' if evaluation['is_correct'] else '❌ Incorrect'}")
print(f"Score: {evaluation['score']}/{evaluation['max_score']}")
print(f"Feedback: {evaluation['feedback']}")
```

Run: `python test_quiz.py`

---

## 🎯 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `OPENAI_API_KEY` | OpenAI API key | - | Yes* |
| `ANTHROPIC_API_KEY` | Anthropic API key | - | Yes* |
| `LLM_PROVIDER` | LLM provider (`openai` or `anthropic`) | `openai` | No |
| `MODEL_NAME` | Model to use | `gpt-4o-mini` | No |
| `CHROMADB_PATH` | Path to ChromaDB storage | `./data/chromadb` | No |
| `COLLECTION_NAME` | ChromaDB collection name | `donor_emails` | No |
| `HOST` | Server host | `0.0.0.0` | No |
| `PORT` | Server port | `8000` | No |
| `DEBUG` | Debug mode | `True` | No |

\* One of `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` is required

---

## 🧠 How It Works

### 1. Knowledge Base Creation
- Donor emails are uploaded and stored in ChromaDB
- Content is automatically embedded using sentence transformers
- Semantic search enables contextual question generation

### 2. Quiz Generation
- System identifies relevant topics from the knowledge base
- LLM generates questions based on donor email context
- Questions are categorized by difficulty and type

### 3. Answer Evaluation
- User submits answer
- LLM evaluates answer against correct response and context
- Provides:
  - ✅ Correctness score (0-100%)
  - 💬 Brief feedback
  - 📚 Detailed explanation
  - 🎯 Key concepts missed
  - ✨ Strengths identified
  - 🚀 Improvement areas

### 4. Personalized Learning
- System tracks performance across sessions
- Identifies weak and strong topics
- Generates targeted study recommendations
- Suggests similar questions for practice

---

## 📊 Example Evaluation Response

```json
{
  "is_correct": true,
  "score": 85.0,
  "max_score": 100.0,
  "feedback": "Good answer! You correctly identified the key aspects of donor stewardship.",
  "detailed_explanation": "Your answer demonstrates a solid understanding of donor stewardship principles. You correctly emphasized relationship building and transparency. However, you could strengthen your response by mentioning regular communication schedules and impact reporting...",
  "key_concepts_missed": [
    "Impact measurement and reporting",
    "Donor recognition programs"
  ],
  "strengths": [
    "Clear understanding of relationship building",
    "Emphasized transparency and trust"
  ],
  "improvement_areas": [
    "Include specific examples of stewardship activities",
    "Mention quantitative metrics for tracking engagement"
  ]
}
```

---

## 🛠️ Development

### Project Structure Explained

```python
src/
├── models/schemas.py      # Pydantic models for type safety
├── llm/
│   ├── providers.py       # OpenAI & Anthropic implementations
│   └── evaluator.py       # Answer evaluation logic
├── vector_db/
│   └── vector_store.py    # ChromaDB operations
├── quiz/
│   ├── generator.py       # Question generation
│   └── session_manager.py # Session & progress tracking
└── api/
    └── routes.py          # FastAPI endpoints
```

### Adding a New LLM Provider

```python
# src/llm/providers.py

class NewLLMProvider(LLMProvider):
    def __init__(self, api_key: str = None, model: str = "model-name"):
        self.api_key = api_key or os.getenv("NEW_LLM_API_KEY")
        self.model = model
        self.client = NewLLMClient(api_key=self.api_key)

    def generate_response(self, prompt: str, **kwargs) -> str:
        response = self.client.complete(
            model=self.model,
            prompt=prompt,
            **kwargs
        )
        return response.text
```

### Running Tests

```bash
# Install test dependencies
pip install pytest pytest-asyncio

# Run tests
pytest tests/ -v
```

---

## 🎨 Frontend Integration

The backend API can be integrated with any frontend framework. Here's a React example:

```javascript
// Example: Generate Quiz
const generateQuiz = async () => {
  const response = await fetch('http://localhost:8000/api/v1/quiz/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: 'student_123',
      num_questions: 5,
      difficulty: 'medium'
    })
  });
  
  const session = await response.json();
  return session;
};

// Example: Submit Answer
const submitAnswer = async (sessionId, questionId, answer) => {
  const response = await fetch('http://localhost:8000/api/v1/quiz/submit-answer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: sessionId,
      question_id: questionId,
      user_answer: answer
    })
  });
  
  const evaluation = await response.json();
  return evaluation;
};
```

---

## 🚢 Deployment

### Docker Production Build

```bash
# Build optimized image
docker build -t quiz-tutor-bot:latest .

# Run in production mode
docker run -d \
  --name quiz-bot \
  -p 8000:8000 \
  -e OPENAI_API_KEY=your-key \
  -e DEBUG=False \
  -v $(pwd)/data:/app/data \
  quiz-tutor-bot:latest
```

### Environment-Specific Configs

```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  quiz-bot-api:
    image: quiz-tutor-bot:latest
    environment:
      - DEBUG=False
      - LLM_PROVIDER=openai
      - MODEL_NAME=gpt-4o
    restart: always
```

---

## 📈 Performance & Scalability

- **Vector Search**: ChromaDB handles millions of documents efficiently
- **Async Operations**: FastAPI's async support for concurrent requests
- **Caching**: LLM responses can be cached for repeated questions
- **Rate Limiting**: Implement rate limiting for production use

---

## 🤝 Contributing

Contributions are welcome! Areas for improvement:

- [ ] Add user authentication (JWT)
- [ ] Implement response caching
- [ ] Add more question types
- [ ] Support image-based questions
- [ ] Add multi-language support
- [ ] Create detailed analytics dashboard
- [ ] Add batch email upload
- [ ] Implement question difficulty auto-adjustment

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **FastAPI** - Modern web framework
- **OpenAI/Anthropic** - LLM providers
- **ChromaDB** - Vector database
- **Sentence Transformers** - Embedding models

---

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Email: support@example.com

---

**Built with ❤️ for Non-Profit Education**
