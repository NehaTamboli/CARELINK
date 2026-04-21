"""
FastAPI routes for the Quiz/Tutor Bot API.
"""
from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from datetime import datetime

from ..models.schemas import (
    Question,
    QuizRequest,
    SubmitAnswerRequest,
    UploadEmailRequest,
    EvaluationResult,
    QuizSession,
    UserProgress,
    LearningRecommendation
)
from ..vector_db.vector_store import VectorStore
from ..llm.evaluator import LLMEvaluator
from ..quiz.generator import QuizGenerator
from ..quiz.session_manager import SessionManager

# Initialize router
router = APIRouter()

# Global instances (will be initialized in main.py)
vector_store: Optional[VectorStore] = None
evaluator: Optional[LLMEvaluator] = None
quiz_generator: Optional[QuizGenerator] = None
session_manager: Optional[SessionManager] = None


def initialize_components(
    vs: VectorStore,
    eval: LLMEvaluator,
    qg: QuizGenerator,
    sm: SessionManager
):
    """Initialize global components"""
    global vector_store, evaluator, quiz_generator, session_manager
    vector_store = vs
    evaluator = eval
    quiz_generator = qg
    session_manager = sm


# Health check endpoint
@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Quiz/Tutor Bot API",
        "timestamp": datetime.now().isoformat()
    }


# Donor email endpoints
@router.post("/emails/upload", status_code=status.HTTP_201_CREATED)
async def upload_donor_email(request: UploadEmailRequest):
    """
    Upload a donor email to the knowledge base.

    Args:
        request: Email upload request

    Returns:
        Success message with document ID
    """
    if not vector_store:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Vector store not initialized"
        )

    try:
        doc_id = vector_store.add_donor_email(
            sender=request.sender,
            subject=request.subject,
            content=request.content,
            date=request.date or datetime.now(),
            category=request.category
        )

        return {
            "success": True,
            "message": "Email uploaded successfully",
            "document_id": doc_id
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error uploading email: {str(e)}"
        )


@router.get("/emails/search")
async def search_emails(query: str, limit: int = 5):
    """
    Search for similar emails using semantic search.

    Args:
        query: Search query
        limit: Number of results to return

    Returns:
        List of matching emails
    """
    if not vector_store:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Vector store not initialized"
        )

    try:
        results = vector_store.search_similar(query, n_results=limit)
        return {
            "query": query,
            "results": results,
            "count": len(results)
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error searching emails: {str(e)}"
        )


@router.get("/emails/categories")
async def get_email_categories():
    """Get all unique categories in the email database"""
    if not vector_store:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Vector store not initialized"
        )

    try:
        categories = vector_store.get_all_categories()
        return {
            "categories": categories,
            "count": len(categories)
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching categories: {str(e)}"
        )


@router.get("/emails/stats")
async def get_email_stats():
    """Get statistics about the email database"""
    if not vector_store:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Vector store not initialized"
        )

    try:
        total_docs = vector_store.count_documents()
        categories = vector_store.get_all_categories()

        return {
            "total_documents": total_docs,
            "total_categories": len(categories),
            "categories": categories
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching stats: {str(e)}"
        )


# Quiz endpoints
@router.post("/quiz/generate", response_model=QuizSession)
async def generate_quiz(request: QuizRequest):
    """
    Generate a new quiz session.

    Args:
        request: Quiz generation request

    Returns:
        QuizSession with generated questions
    """
    if not quiz_generator or not session_manager:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Quiz system not initialized"
        )

    try:
        # Generate questions
        questions = quiz_generator.generate_quiz(
            num_questions=request.num_questions,
            difficulty=request.difficulty,
            topics=request.topics
        )

        if not questions:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No questions could be generated. Please ensure donor emails are uploaded."
            )

        # Create session
        session = session_manager.create_session(
            user_id=request.user_id,
            questions=questions
        )

        return session

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating quiz: {str(e)}"
        )


@router.post("/quiz/submit-answer", response_model=EvaluationResult)
async def submit_answer(request: SubmitAnswerRequest):
    """
    Submit an answer for evaluation.

    Args:
        request: Answer submission request

    Returns:
        EvaluationResult with feedback
    """
    if not session_manager:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Session manager not initialized"
        )

    try:
        evaluation = session_manager.submit_answer(
            session_id=request.session_id,
            question_id=request.question_id,
            user_answer=request.user_answer
        )

        return evaluation

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error submitting answer: {str(e)}"
        )


@router.get("/quiz/session/{session_id}", response_model=QuizSession)
async def get_session(session_id: str):
    """
    Get quiz session details.

    Args:
        session_id: Session identifier

    Returns:
        QuizSession object
    """
    if not session_manager:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Session manager not initialized"
        )

    session = session_manager.get_session(session_id)

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Session {session_id} not found"
        )

    return session


@router.post("/quiz/session/{session_id}/complete")
async def complete_session(session_id: str):
    """
    Mark a quiz session as completed.

    Args:
        session_id: Session identifier

    Returns:
        Session summary
    """
    if not session_manager:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Session manager not initialized"
        )

    try:
        session = session_manager.complete_session(session_id)
        summary = session_manager.get_session_summary(session_id)

        return {
            "success": True,
            "message": "Session completed successfully",
            "summary": summary
        }

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error completing session: {str(e)}"
        )


@router.get("/quiz/session/{session_id}/summary")
async def get_session_summary(session_id: str):
    """Get summary of a quiz session"""
    if not session_manager:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Session manager not initialized"
        )

    summary = session_manager.get_session_summary(session_id)

    if not summary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Session {session_id} not found"
        )

    return summary


# User progress endpoints
@router.get("/user/{user_id}/progress", response_model=UserProgress)
async def get_user_progress(user_id: str):
    """
    Get user progress and statistics.

    Args:
        user_id: User identifier

    Returns:
        UserProgress object
    """
    if not session_manager:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Session manager not initialized"
        )

    progress = session_manager.get_user_progress(user_id)

    if not progress:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No progress found for user {user_id}"
        )

    return progress


@router.get("/user/{user_id}/recommendations", response_model=LearningRecommendation)
async def get_recommendations(user_id: str):
    """
    Get personalized learning recommendations for a user.

    Args:
        user_id: User identifier

    Returns:
        LearningRecommendation object
    """
    if not session_manager:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Session manager not initialized"
        )

    recommendations = session_manager.get_learning_recommendations(user_id)

    if not recommendations:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No recommendations available for user {user_id}. Complete at least one quiz first."
        )

    return recommendations
