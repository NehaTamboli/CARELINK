"""
Main FastAPI application entry point for Quiz/Tutor Bot.
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import uvicorn

from src.vector_db.vector_store import VectorStore
from src.llm.evaluator import LLMEvaluator
from src.llm.providers import OpenAIProvider, AnthropicProvider
from src.quiz.generator import QuizGenerator
from src.quiz.session_manager import SessionManager
from src.api.routes import router, initialize_components

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="Non-Profit Quiz/Tutor Bot API",
    description="AI-powered educational quiz system for non-profit sector learning",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Initialize components on application startup"""
    print("🚀 Starting Quiz/Tutor Bot API...")

    # Get configuration from environment
    llm_provider = os.getenv("LLM_PROVIDER", "openai")
    chromadb_path = os.getenv("CHROMADB_PATH", "./data/chromadb")
    collection_name = os.getenv("COLLECTION_NAME", "donor_emails")

    # Initialize vector store
    print(f"📚 Initializing vector store at {chromadb_path}...")
    vector_store = VectorStore(
        persist_directory=chromadb_path,
        collection_name=collection_name
    )

    # Initialize LLM provider
    print(f"🤖 Initializing {llm_provider} LLM provider...")
    if llm_provider == "openai":
        llm = OpenAIProvider(
            model=os.getenv("MODEL_NAME", "gpt-4o-mini")
        )
    elif llm_provider == "anthropic":
        llm = AnthropicProvider(
            model=os.getenv("MODEL_NAME", "claude-3-5-sonnet-20241022")
        )
    else:
        raise ValueError(f"Unsupported LLM provider: {llm_provider}")

    # Initialize evaluator
    print("📊 Initializing answer evaluator...")
    evaluator = LLMEvaluator(provider=llm_provider)

    # Initialize quiz generator
    print("❓ Initializing quiz generator...")
    quiz_generator = QuizGenerator(
        vector_store=vector_store,
        llm_provider=llm
    )

    # Initialize session manager
    print("📝 Initializing session manager...")
    session_manager = SessionManager(evaluator=evaluator)

    # Initialize API components
    initialize_components(
        vs=vector_store,
        eval=evaluator,
        qg=quiz_generator,
        sm=session_manager
    )

    print("✅ All components initialized successfully!")
    print(f"📈 Vector store has {vector_store.count_documents()} documents")
    print(f"🌐 API documentation available at http://localhost:{os.getenv('PORT', 8000)}/docs")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on application shutdown"""
    print("👋 Shutting down Quiz/Tutor Bot API...")


# Include API routes
app.include_router(router, prefix="/api/v1", tags=["Quiz Bot"])


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Non-Profit Quiz/Tutor Bot API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/v1/health"
    }


if __name__ == "__main__":
    # Get configuration
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    debug = os.getenv("DEBUG", "True").lower() == "true"

    # Run server
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=debug,
        log_level="info"
    )
