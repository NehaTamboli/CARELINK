"""
Quiz question generator using donor emails and LLM.
"""
import json
import uuid
from typing import List, Optional
from ..models.schemas import Question, QuestionType, DifficultyLevel
from ..vector_db.vector_store import VectorStore
from ..llm.providers import LLMProvider, OpenAIProvider


class QuizGenerator:
    """
    Generates quiz questions based on donor email knowledge base.
    Uses semantic search to find relevant context and LLM to create questions.
    """

    def __init__(
        self,
        vector_store: VectorStore,
        llm_provider: Optional[LLMProvider] = None
    ):
        """
        Initialize the quiz generator.

        Args:
            vector_store: Vector database instance
            llm_provider: LLM provider for question generation
        """
        self.vector_store = vector_store
        self.llm = llm_provider or OpenAIProvider()

    def generate_quiz(
        self,
        num_questions: int = 5,
        difficulty: Optional[DifficultyLevel] = None,
        topics: Optional[List[str]] = None
    ) -> List[Question]:
        """
        Generate a complete quiz with multiple questions.

        Args:
            num_questions: Number of questions to generate
            difficulty: Optional difficulty level
            topics: Optional list of specific topics

        Returns:
            List of Question objects
        """
        questions = []

        # If no topics specified, get random samples
        if not topics:
            topics = self._get_diverse_topics(num_questions)

        # Generate questions for each topic
        questions_per_topic = max(1, num_questions // len(topics))

        for topic in topics:
            if len(questions) >= num_questions:
                break

            # Get relevant context from donor emails
            context_docs = self.vector_store.get_by_topic(topic, n_results=3)

            if not context_docs:
                continue

            # Generate questions for this topic
            topic_questions = self._generate_questions_for_topic(
                topic=topic,
                context_docs=context_docs,
                num_questions=min(questions_per_topic, num_questions - len(questions)),
                difficulty=difficulty
            )

            questions.extend(topic_questions)

        return questions[:num_questions]

    def _get_diverse_topics(self, num_topics: int) -> List[str]:
        """Get diverse topics from the knowledge base"""
        # Default non-profit topics
        default_topics = [
            "Donor engagement and stewardship",
            "Fundraising strategies",
            "Volunteer management",
            "Grant writing and proposals",
            "Non-profit governance",
            "Community outreach",
            "Impact measurement",
            "Financial sustainability"
        ]

        # Get categories from vector store
        categories = self.vector_store.get_all_categories()

        # Combine and return diverse set
        all_topics = list(set(default_topics + categories))
        return all_topics[:num_topics]

    def _generate_questions_for_topic(
        self,
        topic: str,
        context_docs: List[dict],
        num_questions: int = 1,
        difficulty: Optional[DifficultyLevel] = None
    ) -> List[Question]:
        """
        Generate questions for a specific topic using donor email context.

        Args:
            topic: Topic for the questions
            context_docs: Relevant donor email documents
            num_questions: Number of questions to generate
            difficulty: Optional difficulty level

        Returns:
            List of Question objects
        """
        # Prepare context from donor emails
        context_text = "\n\n---\n\n".join([
            doc['content'] for doc in context_docs[:2]
        ])

        # Build prompt for question generation
        prompt = self._build_question_generation_prompt(
            topic=topic,
            context=context_text,
            num_questions=num_questions,
            difficulty=difficulty or DifficultyLevel.MEDIUM
        )

        # Generate questions using LLM
        try:
            response = self.llm.generate_response(prompt, temperature=0.8)
            questions_data = self._parse_questions_response(response)

            # Create Question objects
            questions = []
            for q_data in questions_data[:num_questions]:
                question = Question(
                    id=str(uuid.uuid4()),
                    text=q_data.get("text", ""),
                    question_type=QuestionType(q_data.get("type", "short_answer")),
                    difficulty=difficulty or DifficultyLevel.MEDIUM,
                    options=q_data.get("options"),
                    correct_answer=q_data.get("correct_answer", ""),
                    topic=topic,
                    context=context_text[:500],  # Limit context length
                    points=self._calculate_points(difficulty or DifficultyLevel.MEDIUM)
                )
                questions.append(question)

            return questions

        except Exception as e:
            print(f"Error generating questions: {str(e)}")
            return []

    def _build_question_generation_prompt(
        self,
        topic: str,
        context: str,
        num_questions: int,
        difficulty: DifficultyLevel
    ) -> str:
        """Build prompt for LLM to generate questions"""

        prompt = f"""
You are creating educational quiz questions for non-profit sector learning.

**Topic:** {topic}
**Difficulty Level:** {difficulty.value}
**Number of Questions:** {num_questions}

**Context from Donor Communications:**
{context[:1000]}

---

Generate {num_questions} quiz question(s) based on the above context and topic. The questions should:
1. Test understanding of non-profit concepts
2. Be relevant to real-world donor interactions
3. Be at {difficulty.value} difficulty level
4. Use the provided context where applicable
5. Have clear, unambiguous correct answers

Return ONLY a JSON array with this exact structure:

[
  {{
    "text": "Question text here?",
    "type": "multiple_choice",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer": "The complete correct answer"
  }},
  {{
    "text": "Another question?",
    "type": "short_answer",
    "options": null,
    "correct_answer": "Brief correct answer"
  }}
]

**Question Types:**
- "multiple_choice": Include 4 options in the "options" array
- "short_answer": Set "options" to null
- "true_false": Include ["True", "False"] as options
- "essay": Set "options" to null, provide comprehensive correct answer

**Difficulty Guidelines:**
- Easy: Recall and basic comprehension
- Medium: Application and analysis
- Hard: Evaluation and synthesis

Provide ONLY the JSON array, no additional text or explanation.
"""
        return prompt

    def _parse_questions_response(self, response: str) -> List[dict]:
        """Parse the LLM response containing questions"""
        try:
            # Clean the response
            response = response.strip()

            # Remove markdown code blocks
            if response.startswith("```json"):
                response = response[7:]
            if response.startswith("```"):
                response = response[3:]
            if response.endswith("```"):
                response = response[:-3]

            response = response.strip()

            # Parse JSON
            questions = json.loads(response)

            if not isinstance(questions, list):
                return []

            return questions

        except json.JSONDecodeError as e:
            print(f"Error parsing questions JSON: {str(e)}")
            return []

    def _calculate_points(self, difficulty: DifficultyLevel) -> int:
        """Calculate points based on difficulty"""
        points_map = {
            DifficultyLevel.EASY: 10,
            DifficultyLevel.MEDIUM: 20,
            DifficultyLevel.HARD: 30
        }
        return points_map.get(difficulty, 20)

    def generate_similar_question(self, question: Question) -> Optional[Question]:
        """
        Generate a similar question for practice.

        Args:
            question: Original question

        Returns:
            New similar question
        """
        # Get context for the same topic
        context_docs = self.vector_store.get_by_topic(question.topic, n_results=2)

        if not context_docs:
            return None

        # Generate one similar question
        similar_questions = self._generate_questions_for_topic(
            topic=question.topic,
            context_docs=context_docs,
            num_questions=1,
            difficulty=question.difficulty
        )

        return similar_questions[0] if similar_questions else None
