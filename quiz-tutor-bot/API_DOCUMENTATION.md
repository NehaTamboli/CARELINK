# 📡 API Documentation

Complete REST API reference for the Non-Profit Quiz/Tutor Bot.

**Base URL**: `http://localhost:8000/api/v1`

**Interactive Docs**: http://localhost:8000/docs

---

## 🔐 Authentication

Currently, the API does not require authentication. For production use, implement JWT-based auth.

---

## 📧 Email Management

### Upload Donor Email

Upload a donor email to the knowledge base.

**Endpoint**: `POST /emails/upload`

**Request Body**:
```json
{
  "sender": "donor@example.com",
  "subject": "Subject line",
  "content": "Email content here...",
  "category": "donation",
  "date": "2024-04-10T10:30:00Z"  // Optional
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Email uploaded successfully",
  "document_id": "abc123-uuid"
}
```

**Categories**: `general`, `donation`, `volunteer`, `partnership`, `feedback`, `complaint`

---

### Search Emails

Semantic search across uploaded emails.

**Endpoint**: `GET /emails/search`

**Query Parameters**:
- `query` (required): Search query
- `limit` (optional): Number of results (default: 5)

**Example**:
```bash
GET /emails/search?query=volunteer%20program&limit=3
```

**Response** (200 OK):
```json
{
  "query": "volunteer program",
  "results": [
    {
      "id": "doc-uuid",
      "content": "Subject: Volunteer...\n\nContent: I'm interested...",
      "metadata": {
        "sender": "user@example.com",
        "subject": "Volunteer Program",
        "date": "2024-04-10T10:30:00",
        "category": "volunteer"
      },
      "distance": 0.234
    }
  ],
  "count": 3
}
```

---

### Get Categories

List all email categories in the database.

**Endpoint**: `GET /emails/categories`

**Response** (200 OK):
```json
{
  "categories": ["donation", "volunteer", "partnership", "general"],
  "count": 4
}
```

---

### Get Email Statistics

Get database statistics.

**Endpoint**: `GET /emails/stats`

**Response** (200 OK):
```json
{
  "total_documents": 42,
  "total_categories": 5,
  "categories": ["donation", "volunteer", "partnership", "feedback", "general"]
}
```

---

## 📝 Quiz Management

### Generate Quiz

Create a new quiz session with AI-generated questions.

**Endpoint**: `POST /quiz/generate`

**Request Body**:
```json
{
  "user_id": "student_123",
  "num_questions": 5,
  "difficulty": "medium",  // Optional: easy, medium, hard
  "topics": ["donor engagement", "fundraising"]  // Optional
}
```

**Response** (200 OK):
```json
{
  "session_id": "session-uuid",
  "user_id": "student_123",
  "questions": [
    {
      "id": "q1-uuid",
      "text": "What are the key principles of donor stewardship?",
      "question_type": "short_answer",
      "difficulty": "medium",
      "options": null,
      "correct_answer": "Relationship building, transparency, regular communication, impact reporting, donor recognition",
      "topic": "Donor engagement",
      "context": "Subject: Donor Update...",
      "points": 20
    }
  ],
  "answers": [],
  "evaluations": [],
  "started_at": "2024-04-10T10:30:00",
  "completed_at": null,
  "total_score": 0.0,
  "max_possible_score": 100.0
}
```

**Question Types**:
- `multiple_choice`: Has `options` array
- `short_answer`: Text response
- `true_false`: Options are ["True", "False"]
- `essay`: Long-form response

---

### Submit Answer

Submit an answer for evaluation.

**Endpoint**: `POST /quiz/submit-answer`

**Request Body**:
```json
{
  "session_id": "session-uuid",
  "question_id": "q1-uuid",
  "user_answer": "Donor stewardship involves building relationships through communication, transparency, and recognition programs."
}
```

**Response** (200 OK):
```json
{
  "question_id": "q1-uuid",
  "user_answer": "Donor stewardship involves...",
  "is_correct": true,
  "score": 85.0,
  "max_score": 100.0,
  "feedback": "Good answer! You correctly identified key aspects of donor stewardship.",
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
  ],
  "evaluated_at": "2024-04-10T10:35:00"
}
```

---

### Get Session

Retrieve quiz session details.

**Endpoint**: `GET /quiz/session/{session_id}`

**Response** (200 OK):
```json
{
  "session_id": "session-uuid",
  "user_id": "student_123",
  "questions": [...],
  "answers": [...],
  "evaluations": [...],
  "started_at": "2024-04-10T10:30:00",
  "completed_at": null,
  "total_score": 85.0,
  "max_possible_score": 100.0
}
```

---

### Complete Session

Mark a quiz session as completed.

**Endpoint**: `POST /quiz/session/{session_id}/complete`

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Session completed successfully",
  "summary": {
    "session_id": "session-uuid",
    "user_id": "student_123",
    "total_questions": 5,
    "answered_questions": 5,
    "correct_answers": 4,
    "total_score": 425.0,
    "max_score": 500.0,
    "percentage": 85.0,
    "started_at": "2024-04-10T10:30:00",
    "completed_at": "2024-04-10T10:45:00",
    "is_completed": true
  }
}
```

---

### Get Session Summary

Get summary statistics for a session.

**Endpoint**: `GET /quiz/session/{session_id}/summary`

**Response** (200 OK):
```json
{
  "session_id": "session-uuid",
  "user_id": "student_123",
  "total_questions": 5,
  "answered_questions": 5,
  "correct_answers": 4,
  "total_score": 425.0,
  "max_score": 500.0,
  "percentage": 85.0,
  "started_at": "2024-04-10T10:30:00",
  "completed_at": "2024-04-10T10:45:00",
  "is_completed": true
}
```

---

## 📈 User Progress

### Get User Progress

Retrieve user learning progress and statistics.

**Endpoint**: `GET /user/{user_id}/progress`

**Response** (200 OK):
```json
{
  "user_id": "student_123",
  "total_sessions": 10,
  "total_questions_answered": 50,
  "average_score": 78.5,
  "weak_topics": [
    "Grant writing",
    "Financial sustainability"
  ],
  "strong_topics": [
    "Volunteer management",
    "Donor engagement"
  ],
  "recent_performance": [75.0, 80.0, 85.0, 78.0, 82.0],
  "last_active": "2024-04-10T10:45:00"
}
```

---

### Get Learning Recommendations

Get personalized study recommendations.

**Endpoint**: `GET /user/{user_id}/recommendations`

**Response** (200 OK):
```json
{
  "user_id": "student_123",
  "weak_areas": [
    "Grant proposal structure",
    "Budget planning for non-profits"
  ],
  "recommended_topics": [
    "Impact measurement frameworks",
    "Stakeholder engagement strategies"
  ],
  "suggested_questions": [],
  "study_tips": [
    "Review grant writing case studies to understand successful proposal structures",
    "Practice creating mock budgets for different program types",
    "Study real non-profit case studies to understand practical applications",
    "Create summary notes for topics you found challenging",
    "Revisit donor communication examples to strengthen contextual understanding"
  ],
  "generated_at": "2024-04-10T10:46:00"
}
```

---

## 🏥 System Health

### Health Check

Check API health status.

**Endpoint**: `GET /health`

**Response** (200 OK):
```json
{
  "status": "healthy",
  "service": "Quiz/Tutor Bot API",
  "timestamp": "2024-04-10T10:30:00.123456"
}
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "detail": "Validation error: field 'sender' is required"
}
```

### 404 Not Found
```json
{
  "detail": "Session abc-123 not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Error generating quiz: OpenAI API error"
}
```

---

## 📊 Response Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET/POST request |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server-side error |

---

## 🔄 Example Workflow

### Complete Quiz Flow

```python
import requests

API = "http://localhost:8000/api/v1"

# 1. Upload email
email = {
    "sender": "donor@example.com",
    "subject": "Donation inquiry",
    "content": "I'd like to contribute...",
    "category": "donation"
}
requests.post(f"{API}/emails/upload", json=email)

# 2. Generate quiz
quiz_req = {
    "user_id": "student_001",
    "num_questions": 3
}
session = requests.post(f"{API}/quiz/generate", json=quiz_req).json()

# 3. Answer questions
for question in session['questions']:
    answer = {
        "session_id": session['session_id'],
        "question_id": question['id'],
        "user_answer": "My answer..."
    }
    eval = requests.post(f"{API}/quiz/submit-answer", json=answer).json()
    print(f"Score: {eval['score']}/{eval['max_score']}")

# 4. Complete session
requests.post(f"{API}/quiz/session/{session['session_id']}/complete")

# 5. Get recommendations
recs = requests.get(f"{API}/user/student_001/recommendations").json()
print("Study tips:", recs['study_tips'])
```

---

## 🔧 Rate Limiting

Currently not implemented. For production, consider:
- 100 requests/minute per user for quiz endpoints
- 1000 requests/hour for email upload
- Unlimited for GET requests

---

## 📝 Notes

- All timestamps are in ISO 8601 format
- Scores are float values (0.0 - 100.0)
- Session IDs and document IDs are UUIDs
- Content-Type must be `application/json`

---

For more examples, see the [sample_test.py](sample_test.py) script.
