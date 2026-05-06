// ============================================================================
// CONFIGURATION
// ============================================================================

const API_BASE = 'http://65.2.33.200/api/v1';
const USER_ID = `student_${Date.now()}`;

// Help topics for interactive guide
const HELP_TOPICS = [
    {
        id: 'quiz',
        title: '🎓 Take a Quiz',
        description: 'Start learning with AI-generated quizzes'
    },
    {
        id: 'donate',
        title: '💝 How to Donate',
        description: 'Learn about making donations'
    },
    {
        id: 'email',
        title: '📧 Send Donor Emails',
        description: 'Guide for sending donor communications'
    },
    {
        id: 'volunteer',
        title: '🙋 Volunteer Information',
        description: 'Learn how to volunteer with us'
    },
    {
        id: 'support',
        title: '💬 Contact Support',
        description: 'Get help from our team'
    }
];

// Donor email topics (for quiz mode)
const DONOR_EMAIL_OPTIONS = [
    {
        id: 'education',
        title: 'Donation helps provide education to children',
        topic: 'education and child development'
    },
    {
        id: 'water',
        title: 'Funds support clean water in rural areas',
        topic: 'clean water access and sanitation'
    },
    {
        id: 'healthcare',
        title: 'Healthcare access for underprivileged communities',
        topic: 'healthcare and medical services'
    },
    {
        id: 'food',
        title: 'Emergency food assistance for families in need',
        topic: 'food security and nutrition'
    },
    {
        id: 'shelter',
        title: 'Safe housing for homeless individuals',
        topic: 'housing and shelter services'
    }
];

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

const state = {
    quiz: {
        sessionId: null,
        inQuizMode: false,
        currentQuestion: null,
        questionNumber: 0,
        totalQuestions: 0,
        totalScore: 0,
        maxScore: 0,
        waitingForAnswer: false,
        selectedTopic: null
    },
    chat: {
        isOpen: false,
        inGuidedMode: false,
        conversationHistory: []
    }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function showLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.classList.add('active');
}

function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.classList.remove('active');
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

async function apiGet(endpoint) {
    const response = await fetch(`${API_BASE}${endpoint}`);
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return response.json();
}

async function apiPost(endpoint, data) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return response.json();
}

// ============================================================================
// CHAT TOGGLE FUNCTIONALITY
// ============================================================================

function toggleChat() {
    console.log('💬 Toggle chat called');
    const chatPanel = document.getElementById('chat-panel');
    const chatButton = document.getElementById('chat-toggle-btn');
    
    if (!chatPanel || !chatButton) {
        console.error('❌ Missing elements:', { chatPanel, chatButton });
        return;
    }
    
    state.chat.isOpen = !state.chat.isOpen;
    console.log('📊 Chat state:', state.chat.isOpen);
    
    if (state.chat.isOpen) {
        chatPanel.classList.remove('hidden');
        chatButton.textContent = '✖️';
        chatButton.title = 'Close Chat';
        console.log('✅ Chat opened');
        
        // Show welcome and help topics
        if (!state.quiz.inQuizMode && !state.chat.inGuidedMode) {
            showWelcomeWithOptions();
        }
    } else {
        chatPanel.classList.add('hidden');
        chatButton.textContent = '💬';
        chatButton.title = 'Open Chat';
        console.log('✅ Chat closed');
    }
}

// ============================================================================
// GUIDED CHAT MODE
// ============================================================================

function showWelcomeWithOptions() {
    console.log('👋 Showing welcome with help options');
    const container = document.getElementById('chat-messages');
    if (!container) return;
    
    container.innerHTML = `
        <div class="chat-message assistant">
            <p><strong>Hi! 👋</strong></p>
            <p style="margin-top: 8px;">I'm your AI assistant. How can I help you today?</p>
        </div>
    `;

    // Display help topics as clickable buttons
    const suggestionsContainer = document.getElementById('suggestions-container');
    if (!suggestionsContainer) return;
    
    suggestionsContainer.innerHTML = '';

    HELP_TOPICS.forEach(topic => {
        const topicBtn = document.createElement('button');
        topicBtn.className = 'donor-option-btn';
        topicBtn.innerHTML = `
            <strong>${topic.title}</strong>
            <div style="font-size: 0.85em; opacity: 0.8; margin-top: 4px;">${topic.description}</div>
        `;
        topicBtn.onclick = () => {
            console.log('🖱️ Help topic clicked:', topic.title);
            handleHelpTopic(topic);
        };
        suggestionsContainer.appendChild(topicBtn);
    });

    // Update suggestions label
    const suggestionsLabel = document.querySelector('.chat-suggestions p');
    if (suggestionsLabel) {
        suggestionsLabel.textContent = 'Choose a topic:';
    }
    
    console.log('✅ Welcome options displayed');
}

function handleHelpTopic(topic) {
    state.chat.inGuidedMode = true;
    
    // Show user selection
    addChatMessage(topic.title, 'user');
    
    // Get response based on topic
    let response = '';
    
    switch(topic.id) {
        case 'quiz':
            response = "Great! Let me help you start a quiz. I'll show you some topics to choose from.";
            setTimeout(() => {
                showDonorEmailOptions();
            }, 1000);
            break;
            
        case 'donate':
            response = `
                <strong>How to Make a Donation:</strong><br><br>
                1️⃣ <strong>Online Donation:</strong><br>
                • Visit our donation page<br>
                • Choose your donation amount<br>
                • Select payment method (Credit Card, UPI, Bank Transfer)<br><br>
                
                2️⃣ <strong>Direct Bank Transfer:</strong><br>
                • Account Name: Non-Profit Education Fund<br>
                • Account No: 1234567890<br>
                • IFSC Code: SBIN0001234<br><br>
                
                3️⃣ <strong>Tax Benefits:</strong><br>
                • All donations are eligible for 80G tax deduction<br>
                • You'll receive a tax receipt via email<br><br>
                
                💝 Your support helps us provide education to underprivileged children!
            `;
            break;
            
        case 'email':
            response = `
                <strong>Guide to Sending Donor Emails:</strong><br><br>
                
                📧 <strong>For Thank You Emails:</strong><br>
                • Use warm, personal tone<br>
                • Mention specific donation amount<br>
                • Explain impact of their contribution<br>
                • Include tax receipt<br><br>
                
                📧 <strong>For Updates:</strong><br>
                • Share success stories<br>
                • Include photos/videos when possible<br>
                • Be transparent about fund usage<br>
                • Keep it concise and engaging<br><br>
                
                📧 <strong>Best Practices:</strong><br>
                • Send within 24-48 hours of donation<br>
                • Personalize with donor's name<br>
                • Include clear call-to-action<br>
                • Mobile-friendly formatting
            `;
            break;
            
        case 'volunteer':
            response = `
                <strong>Volunteer Opportunities:</strong><br><br>
                
                🙋 <strong>How to Join:</strong><br>
                1. Fill out volunteer application form<br>
                2. Attend orientation session<br>
                3. Choose your preferred role<br>
                4. Start making a difference!<br><br>
                
                📋 <strong>Available Roles:</strong><br>
                • Teaching & Tutoring<br>
                • Event Organization<br>
                • Social Media Management<br>
                • Fundraising Support<br>
                • Administrative Help<br><br>
                
                ⏰ <strong>Time Commitment:</strong><br>
                • Flexible schedules available<br>
                • Minimum 4 hours per week<br>
                • Weekend opportunities available<br><br>
                
                📞 <strong>Contact:</strong> volunteers@nonprofit.org
            `;
            break;
            
        case 'support':
            response = `
                <strong>Contact Support:</strong><br><br>
                
                💬 <strong>Get Help:</strong><br><br>
                
                📧 <strong>Email:</strong> support@nonprofit.org<br>
                📞 <strong>Phone:</strong> +91-22-1234-5678<br>
                ⏰ <strong>Hours:</strong> Mon-Fri, 9 AM - 6 PM IST<br><br>
                
                🌐 <strong>Online Resources:</strong><br>
                • FAQ: www.nonprofit.org/faq<br>
                • Documentation: www.nonprofit.org/docs<br>
                • Video Tutorials: www.nonprofit.org/tutorials<br><br>
                
                💡 <strong>Common Issues:</strong><br>
                • Donation receipt not received<br>
                • Volunteer registration help<br>
                • Technical support<br>
                • General inquiries<br><br>
                
                We typically respond within 24 hours! 🚀
            `;
            break;
    }
    
    // Display response
    setTimeout(() => {
        const container = document.getElementById('chat-messages');
        if (!container) return;
        
        const responseMsg = document.createElement('div');
        responseMsg.className = 'chat-message assistant';
        responseMsg.innerHTML = `<p>${response}</p>`;
        container.appendChild(responseMsg);
        container.scrollTop = container.scrollHeight;
        
        // Show back button unless going to quiz
        if (topic.id !== 'quiz') {
            showBackToMenuButton();
        }
    }, 800);
}

function showBackToMenuButton() {
    const suggestionsContainer = document.getElementById('suggestions-container');
    if (!suggestionsContainer) return;
    
    suggestionsContainer.innerHTML = '';
    
    const backBtn = document.createElement('button');
    backBtn.className = 'donor-option-btn';
    backBtn.style.background = '#14b8a6';
    backBtn.style.color = 'white';
    backBtn.innerHTML = '<strong>◀ Back to Main Menu</strong>';
    backBtn.onclick = () => {
        state.chat.inGuidedMode = false;
        showWelcomeWithOptions();
    };
    suggestionsContainer.appendChild(backBtn);
}

// ============================================================================
// DONOR EMAIL SELECTION (QUIZ MODE)
// ============================================================================

function showDonorEmailOptions() {
    console.log('📧 Showing donor email options');
    const container = document.getElementById('chat-messages');
    if (!container) return;
    
    const msg = document.createElement('div');
    msg.className = 'chat-message assistant';
    msg.innerHTML = `
        <p><strong>Choose a topic for your quiz:</strong></p>
    `;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;

    // Display donor options as clickable buttons
    const suggestionsContainer = document.getElementById('suggestions-container');
    if (!suggestionsContainer) return;
    
    suggestionsContainer.innerHTML = '';

    DONOR_EMAIL_OPTIONS.forEach(option => {
        const optionBtn = document.createElement('button');
        optionBtn.className = 'donor-option-btn';
        optionBtn.textContent = option.title;
        optionBtn.onclick = () => {
            console.log('🖱️ Quiz topic selected:', option.title);
            selectDonorEmail(option);
        };
        suggestionsContainer.appendChild(optionBtn);
    });

    // Update suggestions label
    const suggestionsLabel = document.querySelector('.chat-suggestions p');
    if (suggestionsLabel) {
        suggestionsLabel.textContent = 'Select a quiz topic:';
    }
    
    console.log('✅ Quiz topic options displayed');
}

async function selectDonorEmail(option) {
    state.quiz.selectedTopic = option.topic;
    
    // Show user selection in chat
    addChatMessage(`I chose: ${option.title}`, 'user');
    
    // Start quiz with selected topic
    await startQuizMode(option.topic);
}

// ============================================================================
// INITIALIZATION
// ============================================================================

async function initializeApp() {
    console.log('🚀 Initializing app...');
    try {
        const stats = await apiGet('/emails/stats');
        const totalDocsEl = document.getElementById('total-docs');
        if (totalDocsEl) {
            totalDocsEl.textContent = stats.total_documents;
        }

        // Hide chat panel initially
        const chatPanel = document.getElementById('chat-panel');
        if (chatPanel) {
            chatPanel.classList.add('hidden');
            console.log('✅ Chat panel hidden initially');
        }

        console.log('✅ App initialized successfully');
    } catch (error) {
        console.error('❌ Init error:', error);
        showToast('Failed to connect to server', 'error');
    }
}

// ============================================================================
// QUIZ MODE FUNCTIONALITY
// ============================================================================

async function startQuizMode(topic = null) {
    console.log('🎯 Starting quiz mode...');
    showLoading();
    try {
        const response = await apiPost('/chat/quiz/start', {
            num_questions: 5
        });

        state.quiz.sessionId = response.session_id;
        state.quiz.inQuizMode = true;
        state.quiz.waitingForAnswer = true;
        state.quiz.totalQuestions = response.question.total_questions;
        state.quiz.questionNumber = response.question.question_number;

        // Clear suggestions
        const suggestionsContainer = document.getElementById('suggestions-container');
        if (suggestionsContainer) {
            suggestionsContainer.innerHTML = '';
        }
        
        const suggestionsLabel = document.querySelector('.chat-suggestions p');
        if (suggestionsLabel) {
            suggestionsLabel.textContent = 'Type your answer below and press Send';
        }

        displayQuizQuestion(response.question);
        updateProgressStats();
        
        console.log('✅ Quiz started');
    } catch (error) {
        console.error('❌ Start quiz error:', error);
        showToast('Failed to start quiz. Upload some emails first!', 'error');
    }
    hideLoading();
}

function displayQuizQuestion(questionData) {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    // Add question message
    const questionMsg = document.createElement('div');
    questionMsg.className = 'chat-message assistant';
    questionMsg.innerHTML = `
        <p><strong>Question ${questionData.question_number}/${questionData.total_questions}</strong></p>
        <p style="margin-top: 8px; font-size: 1.05em;">${questionData.question_text}</p>
        <p style="margin-top: 8px; color: #666; font-size: 0.9em;">Type your answer below (aim for 1-2 sentences)</p>
    `;
    container.appendChild(questionMsg);
    container.scrollTop = container.scrollHeight;

    state.quiz.currentQuestion = questionData;
    state.quiz.waitingForAnswer = true;
}

async function sendQuizAnswer() {
    const input = document.getElementById('chat-input');
    if (!input) return;
    
    const answer = input.value.trim();

    if (!answer) {
        showToast('Please type your answer first', 'error');
        return;
    }

    if (!state.quiz.inQuizMode || !state.quiz.waitingForAnswer) {
        return;
    }

    // Display user's answer in chat
    addChatMessage(answer, 'user');
    input.value = '';
    state.quiz.waitingForAnswer = false;

    showLoading();
    try {
        const response = await apiPost('/chat/quiz/answer', {
            session_id: state.quiz.sessionId,
            answer: answer
        });

        const evaluation = response.evaluation;

        // Update scores
        state.quiz.totalScore += evaluation.score;
        state.quiz.maxScore += evaluation.max_score;

        // Display evaluation
        displayEvaluation(evaluation);

        // Check if there's a next question
        if (response.next_question && !response.next_question.completed) {
            // Auto-show next question after brief delay
            setTimeout(() => {
                displayQuizQuestion(response.next_question);
            }, 2000);
        } else {
            // Quiz complete
            setTimeout(() => {
                displayQuizComplete(evaluation.progress);
            }, 2000);
        }

        updateProgressStats();

    } catch (error) {
        console.error('Submit answer error:', error);
        showToast('Failed to submit answer', 'error');
        state.quiz.waitingForAnswer = true;
    }
    hideLoading();
}

function displayEvaluation(evaluation) {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    const evalMsg = document.createElement('div');
    evalMsg.className = 'chat-message assistant';

    let missedPointsHtml = '';
    if (evaluation.missed_points && evaluation.missed_points.length > 0) {
        missedPointsHtml = `
            <p style="margin-top: 8px;"><strong>💡 What you missed:</strong></p>
            <ul style="margin-left: 20px; margin-top: 4px;">
                ${evaluation.missed_points.map(point => `<li>${point}</li>`).join('')}
            </ul>
        `;
    }

    evalMsg.innerHTML = `
        <p><strong>📊 Score: ${evaluation.score}/${evaluation.max_score}</strong></p>
        <p style="margin-top: 8px;"><strong>💬 ${evaluation.feedback}</strong></p>
        <p style="margin-top: 8px;"><strong>✅ Correct Answer:</strong></p>
        <p style="margin-top: 4px;">${evaluation.explanation}</p>
        ${missedPointsHtml}
    `;

    container.appendChild(evalMsg);
    container.scrollTop = container.scrollHeight;
}

function displayQuizComplete(progress) {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    const percentage = progress.max_total > 0 ? 
        ((progress.total_score / progress.max_total) * 100).toFixed(1) : 0;

    const completeMsg = document.createElement('div');
    completeMsg.className = 'chat-message assistant';
    completeMsg.innerHTML = `
        <p><strong>🎉 Quiz Complete!</strong></p>
        <p style="margin-top: 8px; font-size: 1.2em;"><strong>Final Score: ${progress.total_score}/${progress.max_total} (${percentage}%)</strong></p>
        <p style="margin-top: 8px;">Great job! You've completed all questions.</p>
    `;

    container.appendChild(completeMsg);
    container.scrollTop = container.scrollHeight;

    // Reset quiz state
    state.quiz.inQuizMode = false;
    state.quiz.waitingForAnswer = false;

    // Show options
    const suggestionsContainer = document.getElementById('suggestions-container');
    if (!suggestionsContainer) return;
    
    suggestionsContainer.innerHTML = '';

    const restartBtn = document.createElement('button');
    restartBtn.className = 'donor-option-btn';
    restartBtn.style.background = '#14b8a6';
    restartBtn.style.color = 'white';
    restartBtn.innerHTML = '<strong>🔄 Take Another Quiz</strong>';
    restartBtn.onclick = () => {
        state.quiz.totalScore = 0;
        state.quiz.maxScore = 0;
        showDonorEmailOptions();
    };
    suggestionsContainer.appendChild(restartBtn);
    
    const menuBtn = document.createElement('button');
    menuBtn.className = 'donor-option-btn';
    menuBtn.innerHTML = '<strong>◀ Back to Main Menu</strong>';
    menuBtn.onclick = () => {
        state.chat.inGuidedMode = false;
        state.quiz.totalScore = 0;
        state.quiz.maxScore = 0;
        showWelcomeWithOptions();
    };
    suggestionsContainer.appendChild(menuBtn);
}

function addChatMessage(content, role) {
    const container = document.getElementById('chat-messages');
    if (!container) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${role}`;

    const p = document.createElement('p');
    p.textContent = content;
    messageDiv.appendChild(p);

    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

function updateProgressStats() {
    const percentage = state.quiz.maxScore > 0 ? 
        ((state.quiz.totalScore / state.quiz.maxScore) * 100).toFixed(0) : 0;

    const scoreEl = document.getElementById('current-score');
    const questionsEl = document.getElementById('questions-answered');
    
    if (scoreEl) scoreEl.textContent = `${percentage}%`;
    if (questionsEl) {
        questionsEl.textContent = `${state.quiz.questionNumber}/${state.quiz.totalQuestions}`;
    }
}

function clearChat() {
    state.quiz.inQuizMode = false;
    state.quiz.waitingForAnswer = false;
    state.quiz.totalScore = 0;
    state.quiz.maxScore = 0;
    state.chat.inGuidedMode = false;
    showWelcomeWithOptions();
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎓 Quiz Tutor Bot - DOM Loaded');

    initializeApp();

    // Chat toggle button
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    if (chatToggleBtn) {
        chatToggleBtn.onclick = toggleChat;
        console.log('✅ Chat toggle button listener attached');
    } else {
        console.error('❌ Chat toggle button not found!');
    }

    // Close chat button
    const closeBtn = document.getElementById('close-chat-btn');
    if (closeBtn) {
        closeBtn.onclick = toggleChat;
        console.log('✅ Close button listener attached');
    } else {
        console.error('❌ Close button not found!');
    }

    // Chat send button
    const sendBtn = document.getElementById('send-chat-btn');
    if (sendBtn) {
        sendBtn.onclick = () => {
            console.log('📤 Send button clicked');
            if (state.quiz.inQuizMode && state.quiz.waitingForAnswer) {
                sendQuizAnswer();
            }
        };
        console.log('✅ Send button listener attached');
    } else {
        console.error('❌ Send button not found!');
    }

    // Enter key in chat input
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.onkeypress = (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                console.log('⏎ Enter pressed');
                if (state.quiz.inQuizMode && state.quiz.waitingForAnswer) {
                    sendQuizAnswer();
                }
            }
        };
        console.log('✅ Chat input listener attached');
    } else {
        console.error('❌ Chat input not found!');
    }

    console.log('✅ All event listeners initialized');
    console.log('💡 Click the 💬 button to start!');
});
