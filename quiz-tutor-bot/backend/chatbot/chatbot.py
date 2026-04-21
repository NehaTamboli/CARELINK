"""
AI Quiz/Tutor Bot with Retrieval-Augmented Generation (RAG).
Provides quiz-based learning from donor emails knowledge base.
"""
import uuid
import json
from typing import List, Dict, Any, Optional
from datetime import datetime

from ..vector_db.vector_store import VectorStore
from ..llm.providers import LLMProvider, OpenAIProvider


class ConversationMessage:
    """Represents a single message in conversation history"""
    def __init__(self, role: str, content: str, timestamp: datetime = None):
        self.role = role  # 'user' or 'assistant'
        self.content = content
        self.timestamp = timestamp or datetime.now()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "role": self.role,
            "content": self.content,
            "timestamp": self.timestamp.isoformat()
        }


class Chatbot:
    """
    RAG-based chatbot for educational assistance.

    Features:
    - Retrieves relevant context from donor emails
    - Maintains conversation history
    - Provides educational responses about non-profit sector
    - Helps with quiz concepts and donor communication
    """

    def __init__(
        self,
        vector_store: VectorStore,
        llm_provider: Optional[LLMProvider] = None,
        max_context_docs: int = 3,
        max_history: int = 10
    ):
        """
        Initialize the chatbot.

        Args:
            vector_store: Vector database for knowledge retrieval
            llm_provider: LLM provider for response generation
            max_context_docs: Maximum documents to retrieve for context
            max_history: Maximum conversation history to maintain
        """
        self.vector_store = vector_store
        self.llm = llm_provider or OpenAIProvider()
        self.max_context_docs = max_context_docs
        self.max_history = max_history

        # Store conversations by session ID
        self.conversations: Dict[str, List[ConversationMessage]] = {}

    def create_session(self) -> str:
        """Create a new conversation session"""
        session_id = str(uuid.uuid4())
        self.conversations[session_id] = []
        return session_id

    def chat(
        self,
        session_id: str,
        user_message: str,
        include_context: bool = True
    ) -> Dict[str, Any]:
        """
        Process a user message and generate response.

        Args:
            session_id: Conversation session ID
            user_message: User's message
            include_context: Whether to retrieve context from vector DB

        Returns:
            Dictionary with response and metadata
        """
        # Create session if doesn't exist
        if session_id not in self.conversations:
            self.conversations[session_id] = []

        # Add user message to history
        user_msg = ConversationMessage("user", user_message)
        self.conversations[session_id].append(user_msg)

        # Retrieve relevant context from vector DB
        context = ""
        retrieved_docs = []

        if include_context and self.vector_store.count_documents() > 0:
            try:
                results = self.vector_store.search_similar(
                    user_message,
                    n_results=self.max_context_docs
                )

                if results:
                    context_parts = []
                    for doc in results:
                        # Limit context length
                        content = doc['content']
                        if len(content) > 300:
                            content = content[:300] + "..."
                        context_parts.append(content)
                        retrieved_docs.append({
                            "id": doc['id'],
                            "content": content,
                            "metadata": doc.get('metadata', {})
                        })

                    context = "\n\n---\n\n".join(context_parts)
            except Exception as e:
                print(f"Error retrieving context: {str(e)}")

        # Build conversation prompt
        prompt = self._build_chat_prompt(
            user_message=user_message,
            context=context,
            conversation_history=self.conversations[session_id][-self.max_history:-1]
        )

        # Generate response
        try:
            response_text = self.llm.generate_response(
                prompt=prompt,
                temperature=0.7,
                max_tokens=500
            )
        except Exception as e:
            response_text = f"I apologize, but I encountered an error: {str(e)}. Please try rephrasing your question."

        # Add assistant response to history
        assistant_msg = ConversationMessage("assistant", response_text)
        self.conversations[session_id].append(assistant_msg)

        # Trim history if too long
        if len(self.conversations[session_id]) > self.max_history * 2:
            self.conversations[session_id] = self.conversations[session_id][-self.max_history * 2:]

        return {
            "session_id": session_id,
            "response": response_text,
            "context_used": bool(context),
            "retrieved_documents": retrieved_docs,
            "timestamp": assistant_msg.timestamp.isoformat()
        }

    def _build_chat_prompt(
        self,
        user_message: str,
        context: str,
        conversation_history: List[ConversationMessage]
    ) -> str:
        """Build the prompt for the LLM"""

        system_prompt = """You are an educational AI assistant for a non-profit learning platform. Your role is to:

1. Help students understand non-profit sector concepts
2. Answer questions about donor communication and NGO activities
3. Explain quiz concepts and provide study guidance
4. Maintain a friendly, encouraging, and educational tone

Guidelines:
- Provide clear, concise explanations
- Use examples from the non-profit sector when helpful
- If you don't have specific information, acknowledge it and provide general guidance
- Encourage learning and critical thinking
- Be patient and supportive

Always prioritize educational value in your responses."""

        prompt = f"{system_prompt}\n\n"

        # Add context from donor emails if available
        if context:
            prompt += f"""**Relevant Context from Donor Communications:**

{context}

---

Use the above context to provide informed answers when relevant, but don't be limited by it.

"""

        # Add conversation history
        if conversation_history:
            prompt += "**Conversation History:**\n\n"
            for msg in conversation_history:
                role_label = "Student" if msg.role == "user" else "Assistant"
                prompt += f"{role_label}: {msg.content}\n\n"

        # Add current user message
        prompt += f"**Current Question:**\nStudent: {user_message}\n\n"
        prompt += "**Your Response:**\nAssistant: "

        return prompt

    def get_conversation_history(self, session_id: str) -> List[Dict[str, Any]]:
        """Get conversation history for a session"""
        if session_id not in self.conversations:
            return []

        return [msg.to_dict() for msg in self.conversations[session_id]]

    def clear_session(self, session_id: str) -> bool:
        """Clear a conversation session"""
        if session_id in self.conversations:
            del self.conversations[session_id]
            return True
        return False

    def get_suggestions(self, session_id: str = None) -> List[str]:
        """Get suggested questions for the user"""

        # Get total documents in knowledge base
        doc_count = self.vector_store.count_documents()

        if doc_count == 0:
            return [
                "What is donor stewardship?",
                "How can I improve volunteer engagement?",
                "What are best practices for grant writing?",
                "How do non-profits measure impact?",
                "What is CSR partnership?"
            ]

        # Get categories
        categories = self.vector_store.get_all_categories()

        suggestions = [
            "What are the key principles of donor communication?",
            "How should non-profits approach volunteer management?",
            "What makes a successful fundraising campaign?",
        ]

        if "donation" in categories:
            suggestions.append("Tell me about donation management best practices")

        if "volunteer" in categories:
            suggestions.append("What are effective volunteer retention strategies?")

        if "partnership" in categories:
            suggestions.append("How do CSR partnerships benefit non-profits?")

        return suggestions[:5]

    def ask_about_topic(self, topic: str) -> str:
        """Quick topic-based query without session"""
        session_id = self.create_session()
        response = self.chat(
            session_id=session_id,
            user_message=f"Please explain: {topic}",
            include_context=True
        )
        self.clear_session(session_id)
        return response['response']

    # ========================================================================
    # QUIZ MODE FUNCTIONALITY
    # ========================================================================

    def start_quiz_session(self, session_id: str, num_questions: int = 5) -> Dict[str, Any]:
        """
        Start a quiz session in the chat interface.

        Args:
            session_id: Session ID
            num_questions: Number of questions in quiz

        Returns:
            First question with metadata
        """
        # Initialize quiz state for this session
        if not hasattr(self, 'quiz_sessions'):
            self.quiz_sessions = {}

        # Generate all questions upfront
        questions = self._generate_quiz_questions(num_questions)

        self.quiz_sessions[session_id] = {
            'questions': questions,
            'current_index': 0,
            'scores': [],
            'total_score': 0,
            'max_score': num_questions * 10,
            'started_at': datetime.now()
        }

        # Return first question
        return self._get_current_question(session_id)

    def _generate_quiz_questions(self, num_questions: int) -> List[Dict[str, Any]]:
        """Generate quiz questions from donor emails"""
        questions = []

        # Get random samples from vector DB
        docs = self.vector_store.get_random_samples(n_samples=num_questions * 2)

        if not docs:
            # Fallback questions if no docs
            return [{
                'id': f'q_{i}',
                'text': f'Sample question {i+1}',
                'context': '',
                'answer_key': 'Sample answer'
            } for i in range(num_questions)]

        for i, doc in enumerate(docs[:num_questions]):
            # Generate question from document context
            question = self._generate_question_from_context(
                doc['content'],
                doc.get('metadata', {})
            )
            questions.append({
                'id': f'q_{i}',
                'text': question['text'],
                'context': doc['content'][:500],
                'answer_key': question.get('answer_key', '')
            })

        return questions

    def _generate_question_from_context(
        self,
        content: str,
        metadata: Dict[str, Any]
    ) -> Dict[str, str]:
        """Use LLM to generate a question from email content"""

        prompt = f"""Based on this donor email, create ONE educational quiz question:

Email Content:
{content[:800]}

Generate a question that tests understanding of:
- The purpose or impact mentioned
- Key beneficiaries or outcomes
- Important concepts about non-profit work

Return ONLY a JSON object:
{{
    "text": "Your question here?",
    "answer_key": "Brief correct answer"
}}

Keep the question clear and focused. Make it test comprehension, not just recall.
"""

        try:
            response = self.llm.generate_response(prompt, temperature=0.7, max_tokens=200)
            # Parse JSON response
            response = response.strip()
            if response.startswith("```json"):
                response = response[7:]
            if response.startswith("```"):
                response = response[3:]
            if response.endswith("```"):
                response = response[:-3]

            question_data = json.loads(response.strip())
            return question_data
        except Exception as e:
            # Fallback question
            return {
                'text': 'What is the main purpose or impact described in this communication?',
                'answer_key': 'Purpose of donation and expected social impact'
            }

    def _get_current_question(self, session_id: str) -> Dict[str, Any]:
        """Get the current question for a quiz session"""
        if session_id not in self.quiz_sessions:
            return {'error': 'Quiz session not found'}

        quiz = self.quiz_sessions[session_id]
        if quiz['current_index'] >= len(quiz['questions']):
            return {
                'completed': True,
                'total_score': quiz['total_score'],
                'max_score': quiz['max_score'],
                'percentage': (quiz['total_score'] / quiz['max_score'] * 100) if quiz['max_score'] > 0 else 0
            }

        current_q = quiz['questions'][quiz['current_index']]
        return {
            'question_id': current_q['id'],
            'question_text': current_q['text'],
            'question_number': quiz['current_index'] + 1,
            'total_questions': len(quiz['questions']),
            'completed': False
        }

    def evaluate_quiz_answer(
        self,
        session_id: str,
        user_answer: str
    ) -> Dict[str, Any]:
        """
        Evaluate user's answer in quiz mode.

        Args:
            session_id: Session ID
            user_answer: User's submitted answer

        Returns:
            Evaluation with score and feedback
        """
        if session_id not in self.quiz_sessions:
            return {'error': 'Quiz session not found'}

        quiz = self.quiz_sessions[session_id]
        current_q = quiz['questions'][quiz['current_index']]

        # Evaluate answer using LLM
        evaluation = self._evaluate_answer_with_llm(
            question=current_q['text'],
            user_answer=user_answer,
            context=current_q['context'],
            answer_key=current_q.get('answer_key', '')
        )

        # Update quiz state
        quiz['scores'].append(evaluation['score'])
        quiz['total_score'] += evaluation['score']
        quiz['current_index'] += 1

        # Check if quiz is complete
        has_next = quiz['current_index'] < len(quiz['questions'])

        return {
            'score': evaluation['score'],
            'max_score': 10,
            'feedback': evaluation['feedback'],
            'explanation': evaluation['explanation'],
            'missed_points': evaluation['missed_points'],
            'has_next_question': has_next,
            'progress': {
                'current': quiz['current_index'],
                'total': len(quiz['questions']),
                'total_score': quiz['total_score'],
                'max_total': quiz['max_score']
            }
        }

    def _evaluate_answer_with_llm(
        self,
        question: str,
        user_answer: str,
        context: str,
        answer_key: str
    ) -> Dict[str, Any]:
        """Use LLM to evaluate the answer and provide feedback"""

        prompt = f"""You are evaluating a student's answer about non-profit donor communication.

Question: {question}

Context from donor email:
{context[:600]}

Expected answer elements: {answer_key}

Student's answer: {user_answer}

Evaluate the answer and provide:
1. Score out of 10
2. Brief feedback (1-2 sentences)
3. Correct explanation (2-3 sentences)
4. What the student missed (if applicable)

Return ONLY a JSON object:
{{
    "score": <number 0-10>,
    "feedback": "Brief feedback here",
    "explanation": "Correct answer explanation",
    "missed_points": ["point1", "point2"] or []
}}

Be fair but thorough. Give partial credit for partially correct answers.
"""

        try:
            response = self.llm.generate_response(prompt, temperature=0.3, max_tokens=400)
            # Parse JSON
            response = response.strip()
            if response.startswith("```json"):
                response = response[7:]
            if response.startswith("```"):
                response = response[3:]
            if response.endswith("```"):
                response = response[:-3]

            eval_data = json.loads(response.strip())

            # Ensure score is valid
            if 'score' not in eval_data or not isinstance(eval_data['score'], (int, float)):
                eval_data['score'] = 5
            eval_data['score'] = max(0, min(10, eval_data['score']))

            # Ensure required fields
            eval_data.setdefault('feedback', 'Good attempt!')
            eval_data.setdefault('explanation', 'Check the key concepts.')
            eval_data.setdefault('missed_points', [])

            return eval_data

        except Exception as e:
            # Fallback evaluation
            return {
                'score': 5,
                'feedback': 'Answer received. Review the correct explanation.',
                'explanation': 'Focus on the purpose and impact of the donation.',
                'missed_points': []
            }

    def get_next_quiz_question(self, session_id: str) -> Dict[str, Any]:
        """Get the next question in the quiz"""
        return self._get_current_question(session_id)
