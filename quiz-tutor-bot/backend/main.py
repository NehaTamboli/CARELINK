"""
Main FastAPI application entry point for Quiz/Tutor Bot with Chatbot.
Serves both API endpoints and frontend static files.
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv
import uvicorn

from vector_db.vector_store import VectorStore
from llm.evaluator import LLMEvaluator
from llm.providers import OpenAIProvider, AnthropicProvider
from quiz.generator import QuizGenerator
from quiz.session_manager import SessionManager
from chatbot.chatbot import Chatbot
from api.routes import router, initialize_components

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="AI Non-Profit Quiz & Tutor Bot",
    description="AI-powered quiz and chatbot system for non-profit education",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
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
    print("🚀 Starting AI Quiz & Tutor Bot...")

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

    # Initialize chatbot
    print("💬 Initializing AI chatbot...")
    chatbot = Chatbot(
        vector_store=vector_store,
        llm_provider=llm,
        max_context_docs=3,
        max_history=10
    )

    # Initialize API components
    initialize_components(
        vs=vector_store,
        eval=evaluator,
        qg=quiz_generator,
        sm=session_manager,
        cb=chatbot
    )

    print("✅ All components initialized successfully!")
    print(f"📈 Vector store has {vector_store.count_documents()} documents")
    print(f"🌐 Frontend: http://localhost:{os.getenv('PORT', 8000)}")
    print(f"📚 API Docs: http://localhost:{os.getenv('PORT', 8000)}/api/docs")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on application shutdown"""
    print("👋 Shutting down AI Quiz & Tutor Bot...")


# Include API routes with /api/v1 prefix
app.include_router(router, prefix="/api/v1", tags=["API"])


# Serve frontend static files
frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend")
if os.path.exists(frontend_path):
    app.mount("/static", StaticFiles(directory=frontend_path), name="static")

    @app.get("/")
    async def serve_frontend():
        """Serve the frontend HTML"""
        return FileResponse(os.path.join(frontend_path, "index.html"))

    @app.get("/styles.css")
    async def serve_css():
        """Serve CSS file"""
        return FileResponse(os.path.join(frontend_path, "styles.css"))

    @app.get("/script.js")
    async def serve_js():
        """Serve JavaScript file"""
        return FileResponse(os.path.join(frontend_path, "script.js"))


@app.get("/api")
async def api_root():
    """API root endpoint"""
    return {
        "message": "AI Non-Profit Quiz & Tutor Bot API",
        "version": "2.0.0",
        "features": ["quiz", "chatbot", "rag"],
        "docs": "/api/docs",
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
