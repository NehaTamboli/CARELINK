"""
CareLink AI-Powered Non-Profit Support Triage System
Backend API with FastAPI, LLM Integration, and NER
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
import os
import re
from datetime import datetime
import json

# LLM and AI imports
try:
    from openai import OpenAI
except ImportError:
    OpenAI = None

try:
    import spacy
    nlp = spacy.load("en_core_web_sm")
except:
    nlp = None

# Initialize FastAPI app
app = FastAPI(
    title="CareLink Triage API",
    description="AI-Powered Non-Profit Support Triage System",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
from dotenv import load_dotenv

load_dotenv()

openai_client = None

if OpenAI:
    api_key = os.getenv("OPENAI_API_KEY")
    if api_key:
        openai_client = OpenAI(api_key=api_key)

# ============================================================================
# MODELS
# ============================================================================

class MessageAnalysisRequest(BaseModel):
    message: str

class MessageAnalysisResponse(BaseModel):
    success: bool
    analysis: Dict[str, Any]

class ExtractedInfo(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    date: Optional[str] = None
    amount: Optional[str] = None
    organization: Optional[str] = None

class AnalysisResult(BaseModel):
    category: str
    urgency: str
    extractedInfo: ExtractedInfo
    confidence: float

class QuizQuestion(BaseModel):
    id: int
    topic: str
    question: str
    options: List[str]
    correctAnswer: int
    explanation: str

class QuizAnswerRequest(BaseModel):
    questionId: int
    selectedAnswer: int

class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = None

# ============================================================================
# NER EXTRACTION FUNCTIONS
# ============================================================================

def extract_email(text: str) -> Optional[str]:
    """Extract email address from text."""
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    match = re.search(email_pattern, text)
    return match.group(0) if match else None

def extract_phone(text: str) -> Optional[str]:
    """Extract phone number from text."""
    # Indian phone numbers
    phone_patterns = [
        r'\+91[-\s]?\d{10}',
        r'\d{10}',
        r'\d{5}[-\s]?\d{5}',
        r'\(\d{3}\)[-\s]?\d{3}[-\s]?\d{4}'
    ]
    for pattern in phone_patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(0)
    return None

def extract_amount(text: str) -> Optional[str]:
    """Extract monetary amount from text."""
    # Patterns for amounts with ₹, Rs, INR, or just numbers
    amount_patterns = [
        r'[₹Rs\.]\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)',
        r'INR\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)',
        r'(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:rupees|INR|Rs)',
    ]
    for pattern in amount_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            amount = match.group(1) if match.lastindex else match.group(0)
            return amount.replace(',', '')
    return None

def extract_date(text: str) -> Optional[str]:
    """Extract date from text."""
    date_patterns = [
        r'\d{1,2}[-/]\d{1,2}[-/]\d{2,4}',
        r'\d{4}[-/]\d{1,2}[-/]\d{1,2}',
        r'(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4}',
    ]
    for pattern in date_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(0)
    return None

def extract_location(text: str) -> Optional[str]:
    """Extract location/city from text."""
    # Indian cities and common location patterns
    indian_cities = [
        'Mumbai', 'Delhi', 'Bangalore', 'Bengaluru', 'Hyderabad', 'Chennai',
        'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow',
        'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam',
        'Pimpri', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra'
    ]

    text_lower = text.lower()
    for city in indian_cities:
        if city.lower() in text_lower:
            # Find the actual case-preserved version
            pattern = re.compile(re.escape(city), re.IGNORECASE)
            match = pattern.search(text)
            if match:
                return match.group(0)

    # Try to extract with "from" or "in" patterns
    location_patterns = [
        r'from\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)',
        r'in\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)',
    ]
    for pattern in location_patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(1)

    return None

def extract_name_basic(text: str) -> Optional[str]:
    """Extract person name using basic patterns."""
    # Pattern: "My name is X" or "I am X" or "This is X"
    name_patterns = [
        r'my name is\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)',
        r'I am\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)',
        r'This is\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)',
        r'^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+(?:here|speaking|calling)',
    ]

    for pattern in name_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(1)

    return None

def extract_entities_spacy(text: str) -> ExtractedInfo:
    """Extract entities using spaCy NER."""
    if not nlp:
        return extract_entities_regex(text)

    doc = nlp(text)
    entities = ExtractedInfo()

    for ent in doc.ents:
        if ent.label_ == "PERSON" and not entities.name:
            entities.name = ent.text
        elif ent.label_ == "GPE" and not entities.location:  # Geo-political entity
            entities.location = ent.text
        elif ent.label_ == "ORG" and not entities.organization:
            entities.organization = ent.text
        elif ent.label_ == "DATE" and not entities.date:
            entities.date = ent.text

    # Supplement with regex extraction
    if not entities.email:
        entities.email = extract_email(text)
    if not entities.phone:
        entities.phone = extract_phone(text)
    if not entities.amount:
        entities.amount = extract_amount(text)
    if not entities.name:
        entities.name = extract_name_basic(text)
    if not entities.location:
        entities.location = extract_location(text)
    if not entities.date:
        entities.date = extract_date(text)

    return entities

def extract_entities_regex(text: str) -> ExtractedInfo:
    """Extract entities using regex patterns (fallback)."""
    return ExtractedInfo(
        name=extract_name_basic(text),
        email=extract_email(text),
        phone=extract_phone(text),
        location=extract_location(text),
        date=extract_date(text),
        amount=extract_amount(text),
    )

# ============================================================================
# LLM CLASSIFICATION FUNCTIONS
# ============================================================================

def classify_message_llm(message: str) -> Dict[str, Any]:
    """Classify message using OpenAI LLM."""
    if not openai_client:
        # Fallback to rule-based classification
        return classify_message_rules(message)

    try:
        prompt = f"""Analyze the following message from a non-profit organization's communication channel.

Message: "{message}"

Please provide a JSON response with the following structure:
{{
    "category": "<one of: Donation, Volunteer, Complaint, Partnership, General Inquiry>",
    "urgency": "<one of: Critical, High, Medium, Low>",
    "reasoning": "<brief explanation>",
    "confidence": <0.0 to 1.0>
}}

Urgency Guidelines:
- Critical: Immediate safety concerns, emergency situations
- High: Complaints, urgent requests, time-sensitive matters
- Medium: General donations, partnership inquiries
- Low: General questions, routine inquiries

Only respond with valid JSON."""

        response = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an AI assistant that classifies non-profit communications. Always respond with valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=200
        )

        result_text = response.choices[0].message.content.strip()
        # Remove markdown code blocks if present
        result_text = re.sub(r'^```json\s*', '', result_text)
        result_text = re.sub(r'\s*```$', '', result_text)

        result = json.loads(result_text)
        return result

    except Exception as e:
        print(f"LLM classification error: {e}")
        return classify_message_rules(message)

def classify_message_rules(message: str) -> Dict[str, Any]:
    """Rule-based message classification (fallback)."""
    message_lower = message.lower()

    # Category detection
    category = "General Inquiry"
    confidence = 0.6

    if any(word in message_lower for word in ['donate', 'donation', 'contribute', 'fund', 'rupees', '₹', 'rs']):
        category = "Donation"
        confidence = 0.8
    elif any(word in message_lower for word in ['volunteer', 'help', 'join', 'participate', 'work with']):
        category = "Volunteer"
        confidence = 0.75
    elif any(word in message_lower for word in ['complaint', 'issue', 'problem', 'unhappy', 'disappointed', 'poor']):
        category = "Complaint"
        confidence = 0.85
    elif any(word in message_lower for word in ['partner', 'collaboration', 'collaborate', 'partnership', 'business']):
        category = "Partnership"
        confidence = 0.7

    # Urgency detection
    urgency = "Low"
    if any(word in message_lower for word in ['urgent', 'emergency', 'immediately', 'asap', 'critical', 'help']):
        urgency = "High"
    elif any(word in message_lower for word in ['complaint', 'issue', 'problem']):
        urgency = "High"
    elif any(word in message_lower for word in ['soon', 'quickly', 'important']):
        urgency = "Medium"
    elif category in ["Donation", "Partnership"]:
        urgency = "Medium"

    return {
        "category": category,
        "urgency": urgency,
        "reasoning": f"Classified based on keyword matching for {category.lower()}",
        "confidence": confidence
    }

def generate_response_llm(message: str, category: str, urgency: str) -> str:
    """Generate appropriate response using LLM."""
    if not openai_client:
        return generate_response_template(category, urgency)

    try:
        prompt = f"""You are a compassionate customer service representative for CareLink, a non-profit organization.

Message Category: {category}
Urgency Level: {urgency}
Message: "{message}"

Generate a professional, empathetic response that:
1. Acknowledges the message appropriately
2. Addresses the category-specific needs
3. Provides next steps
4. Maintains a warm, professional tone

Keep the response concise (2-3 sentences) and actionable."""

        response = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful customer service AI for a non-profit organization."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=150
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        print(f"LLM response generation error: {e}")
        return generate_response_template(category, urgency)

def generate_response_template(category: str, urgency: str) -> str:
    """Generate template-based response (fallback)."""
    templates = {
        "Donation": "Thank you for your generous donation intent! We truly appreciate your support. A member of our donation team will contact you shortly to process your contribution.",
        "Volunteer": "Thank you for your interest in volunteering! Your support means a lot to us. We will connect you with our volunteer coordinator to discuss available opportunities.",
        "Complaint": "We sincerely apologize for any inconvenience. Your concern is important to us and has been marked as high priority. Our support team will reach out to you within 24 hours to resolve this matter.",
        "Partnership": "Thank you for your interest in partnering with us! We are excited about potential collaboration opportunities. Our partnerships team will contact you to discuss this further.",
        "General Inquiry": "Thank you for reaching out! We have received your message and will get back to you shortly with the information you need."
    }

    response = templates.get(category, templates["General Inquiry"])

    if urgency in ["Critical", "High"]:
        response = response.replace("shortly", "immediately").replace("will contact", "will prioritize and contact")

    return response

# ============================================================================
# QUIZ DATA
# ============================================================================

QUIZ_QUESTIONS = [
    {
        "id": 1,
        "topic": "Donor Engagement",
        "question": "What is the most effective way to acknowledge a first-time donor?",
        "options": [
            "Send an automated email receipt",
            "Make a personal phone call within 48 hours",
            "Add them to a monthly newsletter",
            "Wait until the next campaign to reach out"
        ],
        "correctAnswer": 1,
        "explanation": "Personal phone calls within 48 hours create a strong connection and increase donor retention by 30%."
    },
    {
        "id": 2,
        "topic": "Donor Communication",
        "question": "How often should you communicate with regular donors?",
        "options": [
            "Only when asking for donations",
            "Quarterly with impact updates",
            "Monthly newsletters plus impact reports",
            "Weekly updates"
        ],
        "correctAnswer": 2,
        "explanation": "Monthly newsletters combined with impact reports keep donors engaged without overwhelming them."
    },
    {
        "id": 3,
        "topic": "Donation Impact",
        "question": "What type of content resonates most with donors?",
        "options": [
            "Organizational achievements",
            "Stories of individual beneficiaries",
            "Financial reports",
            "Volunteer opportunities"
        ],
        "correctAnswer": 1,
        "explanation": "Personal stories create emotional connections and show donors the direct impact of their contributions."
    },
    {
        "id": 4,
        "topic": "Donor Retention",
        "question": "What percentage of donors typically give a second time?",
        "options": [
            "80-90%",
            "60-70%",
            "40-50%",
            "Less than 30%"
        ],
        "correctAnswer": 3,
        "explanation": "Only about 20-30% of first-time donors give again, highlighting the importance of retention strategies."
    },
    {
        "id": 5,
        "topic": "Email Best Practices",
        "question": "What is the ideal subject line length for donor emails?",
        "options": [
            "10-20 characters",
            "30-50 characters",
            "60-80 characters",
            "Over 100 characters"
        ],
        "correctAnswer": 1,
        "explanation": "Subject lines between 30-50 characters have the highest open rates and display fully on mobile devices."
    }
]

# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "online",
        "service": "CareLink Triage API",
        "version": "1.0.0",
        "features": {
            "llm_enabled": openai_client is not None,
            "ner_enabled": nlp is not None
        }
    }

@app.post("/api/analyze", response_model=MessageAnalysisResponse)
async def analyze_message(request: MessageAnalysisRequest):
    """
    Analyze a message using AI/LLM for category classification,
    urgency detection, and entity extraction.
    """
    try:
        message = request.message.strip()

        if not message:
            raise HTTPException(status_code=400, detail="Message cannot be empty")

        # Step 1: Classify message using LLM
        classification = classify_message_llm(message)

        # Step 2: Extract entities using NER
        extracted_info = extract_entities_spacy(message)

        # Step 3: Generate response
        response_text = generate_response_llm(
            message,
            classification["category"],
            classification["urgency"]
        )

        # Prepare analysis result
        analysis = {
            "category": classification["category"],
            "urgency": classification["urgency"],
            "extractedInfo": extracted_info.dict(exclude_none=True),
            "response": response_text,
            "confidence": classification.get("confidence", 0.75),
            "reasoning": classification.get("reasoning", "Classified using AI model"),
            "timestamp": datetime.utcnow().isoformat()
        }

        return MessageAnalysisResponse(
            success=True,
            analysis=analysis
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.get("/api/quiz/questions")
async def get_quiz_questions():
    """Get all quiz questions."""
    return {
        "success": True,
        "questions": QUIZ_QUESTIONS
    }

@app.get("/api/quiz/question/{question_id}")
async def get_quiz_question(question_id: int):
    """Get a specific quiz question."""
    question = next((q for q in QUIZ_QUESTIONS if q["id"] == question_id), None)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return {
        "success": True,
        "question": question
    }

@app.post("/api/quiz/check-answer")
async def check_quiz_answer(request: QuizAnswerRequest):
    """Check if a quiz answer is correct."""
    question = next((q for q in QUIZ_QUESTIONS if q["id"] == request.questionId), None)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    is_correct = request.selectedAnswer == question["correctAnswer"]

    return {
        "success": True,
        "correct": is_correct,
        "correctAnswer": question["correctAnswer"],
        "explanation": question["explanation"]
    }

@app.post("/api/chat")
async def chat_with_bot(request: ChatRequest):
    """
    Chat with the AI assistant bot.
    Provides contextual responses based on user queries.
    """
    try:
        message = request.message.lower().strip()

        # Rule-based responses for common queries
        if any(word in message for word in ['donate', 'donation']):
            response = """We accept donations through:

1. **Online Payment**: UPI, Credit/Debit Cards, Net Banking
2. **Bank Transfer**: Direct transfer to our account
3. **Cheque/DD**: Payable to "CareLink Foundation"

All donations are tax-deductible under 80G.

Would you like our bank details?"""

        elif any(word in message for word in ['volunteer', 'help']):
            response = """We have several volunteer opportunities:

1. Education Support
2. Community Outreach
3. Event Management
4. Content Creation

Minimum commitment: 4 hours/week
Benefits include certificates and skill development workshops.

Interested in joining?"""

        elif any(word in message for word in ['contact', 'support', 'phone']):
            response = """Contact Information:

📧 Email: support@carelink.org
📞 Phone: +91-22-1234-5678
💬 WhatsApp: +91-98765-43210

Office Hours: Mon-Fri 9AM-6PM IST
Emergency: +91-22-9999-8888 (24/7)"""

        elif any(word in message for word in ['email', 'template']):
            response = """Donor Email Best Practices:

✅ Personalize with donor's name
✅ Keep subject lines under 50 characters
✅ Include impact stories
✅ Send within 48 hours of donation

We have templates for:
• Welcome emails
• Thank you notes
• Impact updates
• Campaign launches"""

        else:
            # Use LLM for general queries if available
            if openai_client:
                try:
                    llm_response = openai_client.chat.completions.create(
                        model="gpt-3.5-turbo",
                        messages=[
                            {"role": "system", "content": "You are a helpful AI assistant for CareLink, a non-profit organization. Provide concise, helpful responses."},
                            {"role": "user", "content": request.message}
                        ],
                        temperature=0.7,
                        max_tokens=150
                    )
                    response = llm_response.choices[0].message.content.strip()
                except:
                    response = "I can help you with donations, volunteering, contact information, and email templates. What would you like to know?"
            else:
                response = "I can help you with donations, volunteering, contact information, and email templates. What would you like to know?"

        return {
            "success": True,
            "response": response,
            "timestamp": datetime.utcnow().isoformat()
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

# ============================================================================
# MAIN
# ============================================================================

if __name__ == "__main__":
    import uvicorn

    print("""
╔═══════════════════════════════════════════════════════════╗
║       CareLink AI Triage System - Backend API             ║
║       Production-Grade Non-Profit Support Platform        ║
╚═══════════════════════════════════════════════════════════╝
    """)

    print(f"LLM Status: {'✓ Enabled' if openai_client else '✗ Disabled (using rule-based)'}")
    print(f"NER Status: {'✓ spaCy Enabled' if nlp else '✗ Using regex fallback'}")
    print(f"\nStarting server on http://localhost:8000")
    print(f"API Documentation: http://localhost:8000/docs\n")

    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
