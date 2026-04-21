"""
Data models and schemas for the Quiz/Tutor Bot system.
"""
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class DifficultyLevel(str, Enum):
    """Question difficulty levels"""
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class QuestionType(str, Enum):
    """Types of questions"""
    MULTIPLE_CHOICE = "multiple_choice"
    TRUE_FALSE = "true_false"
    SHORT_ANSWER = "short_answer"
    ESSAY = "essay"


class DonorEmail(BaseModel):
    """Model for donor email documents"""
    id: Optional[str] = None
    sender: EmailStr
    subject: str
    content: str
    date: datetime
    category: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)


class Question(BaseModel):
    """Model for quiz questions"""
    id: Optional[str] = None
    text: str
    question_type: QuestionType
    difficulty: DifficultyLevel
    options: Optional[List[str]] = None  # For multiple choice
    correct_answer: Optional[str] = None  # For reference
    topic: str
    context: str  # Related donor email context
    points: int = Field(default=10, ge=1, le=100)
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)


class Answer(BaseModel):
    """Model for user answers"""
    question_id: str
    user_answer: str
    submitted_at: datetime = Field(default_factory=datetime.now)


class EvaluationResult(BaseModel):
    """Model for answer evaluation results"""
    question_id: str
    user_answer: str
    is_correct: bool
    score: float = Field(ge=0.0, le=100.0)
    max_score: float = 100.0
    feedback: str
    detailed_explanation: str
    key_concepts_missed: List[str] = Field(default_factory=list)
    strengths: List[str] = Field(default_factory=list)
    improvement_areas: List[str] = Field(default_factory=list)
    evaluated_at: datetime = Field(default_factory=datetime.now)


class QuizSession(BaseModel):
    """Model for quiz session"""
    session_id: str
    user_id: str
    questions: List[Question]
    answers: List[Answer] = Field(default_factory=list)
    evaluations: List[EvaluationResult] = Field(default_factory=list)
    started_at: datetime = Field(default_factory=datetime.now)
    completed_at: Optional[datetime] = None
    total_score: float = 0.0
    max_possible_score: float = 0.0


class UserProgress(BaseModel):
    """Model for tracking user learning progress"""
    user_id: str
    total_sessions: int = 0
    total_questions_answered: int = 0
    average_score: float = 0.0
    weak_topics: List[str] = Field(default_factory=list)
    strong_topics: List[str] = Field(default_factory=list)
    recent_performance: List[float] = Field(default_factory=list)
    last_active: datetime = Field(default_factory=datetime.now)


class LearningRecommendation(BaseModel):
    """Model for personalized learning recommendations"""
    user_id: str
    weak_areas: List[str]
    recommended_topics: List[str]
    suggested_questions: List[Question] = Field(default_factory=list)
    study_tips: List[str] = Field(default_factory=list)
    generated_at: datetime = Field(default_factory=datetime.now)


class QuizRequest(BaseModel):
    """Request model for generating quiz"""
    user_id: str
    num_questions: int = Field(default=5, ge=1, le=20)
    difficulty: Optional[DifficultyLevel] = None
    topics: Optional[List[str]] = None


class SubmitAnswerRequest(BaseModel):
    """Request model for submitting answers"""
    session_id: str
    question_id: str
    user_answer: str


class UploadEmailRequest(BaseModel):
    """Request model for uploading donor emails"""
    sender: EmailStr
    subject: str
    content: str
    date: Optional[datetime] = Field(default_factory=datetime.now)
    category: Optional[str] = None
