# 🎓 Quiz Tutor System Guide

## Overview

The chatbot has been transformed into an **AI Quiz Tutor** that delivers interactive quizzes through a familiar chat interface. Same UI, completely new behavior.

## How It Works

### 🎯 Quiz Flow (Chat-Based)

1. **Welcome Screen**
   - Chat displays welcome message
   - "Start Learning Session" button appears in suggestions

2. **Question Delivery**
   - Questions appear as **chat messages** from the assistant
   - Format: "Question 1/5: [question text]"
   - User types answer in the **chat input field**

3. **Answer Evaluation**
   - User submits answer by clicking "Send" or pressing Enter
   - Answer appears as user message in chat
   - AI evaluation appears as assistant response with:
     - **Score**: X/10 points
     - **Feedback**: Brief comment on the answer
     - **Correct Answer**: Detailed explanation
     - **Missed Points**: What the student didn't include (if any)

4. **Auto-Progress**
   - After 2 seconds, next question automatically appears in chat
   - Process repeats until all questions answered

5. **Quiz Complete**
   - Final score displayed in chat
   - Percentage and total points shown
   - "Start New Quiz" button appears

## Key Features

### ✅ No Visual Changes
- Same chat window
- Same message bubbles (user/assistant)
- Same input field
- Same suggestion chips
- Only text and behavior changed

### 🤖 AI-Powered
- Questions generated from donor email knowledge base
- LLM evaluates answers with detailed feedback
- Partial credit for partially correct answers
- Context-aware explanations

### 📊 Progress Tracking
- Current score percentage updated in real-time
- Questions answered count displayed
- Knowledge base size shown

## Technical Implementation

### Frontend (`frontend/script.js`)
```javascript
// Main quiz functions
startQuizMode()           // Initialize quiz session
displayQuizQuestion()     // Show question in chat
sendQuizAnswer()          // Submit and evaluate answer
displayEvaluation()       // Show score and feedback
displayQuizComplete()     // Show final results
```

### Backend Endpoints

#### `POST /api/v1/chat/quiz/start`
Start a new quiz session
- Request: `{ num_questions: 5 }`
- Response: First question data

#### `POST /api/v1/chat/quiz/answer`
Submit answer for evaluation
- Request: `{ session_id, answer }`
- Response: Evaluation + next question

### Backend Logic (`backend/chatbot/chatbot.py`)
```python
# Quiz mode methods in Chatbot class
start_quiz_session()          # Create quiz with N questions
evaluate_quiz_answer()        # Score answer using LLM
_generate_quiz_questions()    # Generate from donor emails
_evaluate_answer_with_llm()   # LLM-based evaluation
```

## Usage Example

```bash
# 1. Start the server
cd backend && python main.py

# 2. Open browser
http://localhost:8000

# 3. Click "Start Learning Session"
# 4. Type your answer to each question
# 5. Review feedback and explanations
# 6. Complete quiz and see final score
```

## Scoring System

- Each question worth **10 points**
- LLM evaluates on scale of 0-10
- Partial credit given for partially correct answers
- Total score = sum of all question scores
- Percentage = (total score / max possible) × 100

## Evaluation Criteria

The LLM evaluates based on:
- **Accuracy**: Is the core concept correct?
- **Completeness**: Are key points included?
- **Understanding**: Does answer show comprehension?

Feedback includes:
- What was done well
- What was missed
- Correct answer explanation
- Key concepts to review

## Data Flow

```
User clicks "Start Learning"
    ↓
POST /chat/quiz/start
    ↓
Chatbot.start_quiz_session()
    ↓
_generate_quiz_questions() → retrieves donor emails
    ↓
LLM generates questions from email context
    ↓
First question displayed in chat
    ↓
User types answer → POST /chat/quiz/answer
    ↓
Chatbot.evaluate_quiz_answer()
    ↓
_evaluate_answer_with_llm() → LLM scores 0-10
    ↓
Evaluation displayed in chat
    ↓
Next question auto-loaded (if any)
    ↓
Repeat until all questions answered
    ↓
Final score displayed
```

## Benefits of Chat-Based Quiz

✅ **Familiar Interface**: Users already know how to use chat
✅ **Natural Flow**: Questions and answers feel conversational
✅ **Immediate Feedback**: Evaluations appear inline with questions
✅ **Scroll History**: Can review previous Q&A pairs
✅ **Simple UX**: No need to learn new UI patterns

## Customization

To change quiz behavior, edit:

**Number of questions:**
```javascript
// frontend/script.js line 113
num_questions: 5  // Change to 3, 7, 10, etc.
```

**Question generation:**
```python
# backend/chatbot/chatbot.py line 302
def _generate_quiz_questions(self, num_questions: int)
```

**Evaluation prompt:**
```python
# backend/chatbot/chatbot.py line 454
def _evaluate_answer_with_llm(...)
```

---

**The quiz tutor is now fully operational using only the chat interface!** 🚀
