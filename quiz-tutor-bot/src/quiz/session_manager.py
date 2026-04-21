"""
Quiz session management and user progress tracking.
"""
import uuid
from datetime import datetime
from typing import Dict, List, Optional
from ..models.schemas import (
    QuizSession,
    Question,
    Answer,
    EvaluationResult,
    UserProgress,
    LearningRecommendation
)
from ..llm.evaluator import LLMEvaluator


class SessionManager:
    """
    Manages quiz sessions and tracks user progress.
    Handles session lifecycle, answer submission, and progress analytics.
    """

    def __init__(self, evaluator: LLMEvaluator):
        """
        Initialize session manager.

        Args:
            evaluator: LLM evaluator instance
        """
        self.evaluator = evaluator
        self.sessions: Dict[str, QuizSession] = {}
        self.user_progress: Dict[str, UserProgress] = {}

    def create_session(
        self,
        user_id: str,
        questions: List[Question]
    ) -> QuizSession:
        """
        Create a new quiz session.

        Args:
            user_id: User identifier
            questions: List of questions for the session

        Returns:
            QuizSession object
        """
        session_id = str(uuid.uuid4())

        # Calculate max possible score
        max_score = sum(q.points for q in questions)

        session = QuizSession(
            session_id=session_id,
            user_id=user_id,
            questions=questions,
            answers=[],
            evaluations=[],
            started_at=datetime.now(),
            total_score=0.0,
            max_possible_score=float(max_score)
        )

        self.sessions[session_id] = session

        # Initialize user progress if needed
        if user_id not in self.user_progress:
            self.user_progress[user_id] = UserProgress(user_id=user_id)

        return session

    def submit_answer(
        self,
        session_id: str,
        question_id: str,
        user_answer: str
    ) -> EvaluationResult:
        """
        Submit an answer for evaluation.

        Args:
            session_id: Session identifier
            question_id: Question identifier
            user_answer: User's answer

        Returns:
            EvaluationResult with feedback
        """
        if session_id not in self.sessions:
            raise ValueError(f"Session {session_id} not found")

        session = self.sessions[session_id]

        # Find the question
        question = next(
            (q for q in session.questions if q.id == question_id),
            None
        )

        if not question:
            raise ValueError(f"Question {question_id} not found in session")

        # Create answer record
        answer = Answer(
            question_id=question_id,
            user_answer=user_answer,
            submitted_at=datetime.now()
        )

        # Evaluate the answer
        evaluation = self.evaluator.evaluate_answer(
            question=question,
            user_answer=user_answer,
            context=question.context
        )

        # Update session
        session.answers.append(answer)
        session.evaluations.append(evaluation)
        session.total_score += evaluation.score

        # Update user progress
        self._update_user_progress(session.user_id, evaluation, question)

        return evaluation

    def get_session(self, session_id: str) -> Optional[QuizSession]:
        """Get a session by ID"""
        return self.sessions.get(session_id)

    def complete_session(self, session_id: str) -> QuizSession:
        """
        Mark a session as completed.

        Args:
            session_id: Session identifier

        Returns:
            Completed QuizSession
        """
        if session_id not in self.sessions:
            raise ValueError(f"Session {session_id} not found")

        session = self.sessions[session_id]
        session.completed_at = datetime.now()

        # Update user progress
        user_progress = self.user_progress.get(session.user_id)
        if user_progress:
            user_progress.total_sessions += 1
            user_progress.last_active = datetime.now()

            # Update average score
            total_sessions = user_progress.total_sessions
            current_avg = user_progress.average_score
            session_percentage = (session.total_score / session.max_possible_score * 100
                                if session.max_possible_score > 0 else 0)

            user_progress.average_score = (
                (current_avg * (total_sessions - 1) + session_percentage) / total_sessions
            )

            # Track recent performance
            user_progress.recent_performance.append(session_percentage)
            if len(user_progress.recent_performance) > 10:
                user_progress.recent_performance.pop(0)

        return session

    def get_user_progress(self, user_id: str) -> Optional[UserProgress]:
        """Get user progress data"""
        return self.user_progress.get(user_id)

    def get_learning_recommendations(
        self,
        user_id: str
    ) -> Optional[LearningRecommendation]:
        """
        Generate personalized learning recommendations for a user.

        Args:
            user_id: User identifier

        Returns:
            LearningRecommendation with suggestions
        """
        # Get all evaluations for this user
        user_evaluations = []
        for session in self.sessions.values():
            if session.user_id == user_id:
                user_evaluations.extend(session.evaluations)

        if not user_evaluations:
            return None

        # Analyze weak areas
        analysis = self.evaluator.identify_weak_areas(user_evaluations)

        # Get user progress
        progress = self.user_progress.get(user_id)

        recommendation = LearningRecommendation(
            user_id=user_id,
            weak_areas=analysis.get("weak_topics", []),
            recommended_topics=analysis.get("missed_concepts", []),
            suggested_questions=[],  # Could be populated with new questions
            study_tips=analysis.get("recommendations", []),
            generated_at=datetime.now()
        )

        return recommendation

    def _update_user_progress(
        self,
        user_id: str,
        evaluation: EvaluationResult,
        question: Question
    ):
        """Update user progress based on evaluation"""
        progress = self.user_progress.get(user_id)
        if not progress:
            return

        progress.total_questions_answered += 1

        # Track weak and strong topics
        score_percentage = (evaluation.score / evaluation.max_score * 100
                          if evaluation.max_score > 0 else 0)

        if score_percentage < 60:
            # Weak area
            if question.topic not in progress.weak_topics:
                progress.weak_topics.append(question.topic)
            # Remove from strong topics if present
            if question.topic in progress.strong_topics:
                progress.strong_topics.remove(question.topic)
        elif score_percentage >= 80:
            # Strong area
            if question.topic not in progress.strong_topics:
                progress.strong_topics.append(question.topic)
            # Remove from weak topics if present
            if question.topic in progress.weak_topics:
                progress.weak_topics.remove(question.topic)

        progress.last_active = datetime.now()

    def get_session_summary(self, session_id: str) -> Dict:
        """
        Get a comprehensive summary of a session.

        Args:
            session_id: Session identifier

        Returns:
            Dictionary with session summary
        """
        session = self.get_session(session_id)
        if not session:
            return {}

        total_questions = len(session.questions)
        answered_questions = len(session.answers)
        correct_answers = sum(1 for e in session.evaluations if e.is_correct)

        score_percentage = (
            session.total_score / session.max_possible_score * 100
            if session.max_possible_score > 0 else 0
        )

        return {
            "session_id": session_id,
            "user_id": session.user_id,
            "total_questions": total_questions,
            "answered_questions": answered_questions,
            "correct_answers": correct_answers,
            "total_score": session.total_score,
            "max_score": session.max_possible_score,
            "percentage": round(score_percentage, 2),
            "started_at": session.started_at.isoformat(),
            "completed_at": session.completed_at.isoformat() if session.completed_at else None,
            "is_completed": session.completed_at is not None
        }
