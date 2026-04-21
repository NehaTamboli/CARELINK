# 🤖 Interactive Guided Chatbot - Complete Guide

## ✨ New Features

Your quiz-tutor-bot now has an **interactive guided chatbot** that helps users navigate through different options!

### 🎯 Main Menu Options

When users open the chat, they see:

1. **🎓 Take a Quiz** - Start AI-generated quizzes
2. **💝 How to Donate** - Complete donation guide
3. **📧 Send Donor Emails** - Email best practices guide
4. **🙋 Volunteer Information** - How to volunteer
5. **💬 Contact Support** - Support contact details

---

## 🚀 How It Works

### Step 1: User Opens Chat
- Clicks floating 💬 button
- Sees welcome message: "Hi! 👋 I'm your AI assistant. How can I help you today?"
- Sees 5 clickable help topics

### Step 2: User Selects a Topic
Each option is clickable and provides detailed guidance:

#### 🎓 Take a Quiz
- Shows quiz topic selection (5 donor email topics)
- User selects a topic
- Quiz starts automatically
- Interactive Q&A flow with scoring

#### 💝 How to Donate
**Provides:**
- Online donation steps
- Bank transfer details
- Tax benefit information
- Account numbers and IFSC code

**Example Response:**
```
How to Make a Donation:

1️⃣ Online Donation:
• Visit our donation page
• Choose your donation amount
• Select payment method (Credit Card, UPI, Bank Transfer)

2️⃣ Direct Bank Transfer:
• Account Name: Non-Profit Education Fund
• Account No: 1234567890
• IFSC Code: SBIN0001234

3️⃣ Tax Benefits:
• All donations are eligible for 80G tax deduction
• You'll receive a tax receipt via email

💝 Your support helps us provide education to underprivileged children!
```

#### 📧 Send Donor Emails
**Provides:**
- Thank you email templates
- Update email guidelines
- Best practices
- Timing recommendations

**Example Response:**
```
Guide to Sending Donor Emails:

📧 For Thank You Emails:
• Use warm, personal tone
• Mention specific donation amount
• Explain impact of their contribution
• Include tax receipt

📧 For Updates:
• Share success stories
• Include photos/videos when possible
• Be transparent about fund usage
• Keep it concise and engaging

📧 Best Practices:
• Send within 24-48 hours of donation
• Personalize with donor's name
• Include clear call-to-action
• Mobile-friendly formatting
```

#### 🙋 Volunteer Information
**Provides:**
- How to join steps
- Available roles
- Time commitment
- Contact information

**Example Response:**
```
Volunteer Opportunities:

🙋 How to Join:
1. Fill out volunteer application form
2. Attend orientation session
3. Choose your preferred role
4. Start making a difference!

📋 Available Roles:
• Teaching & Tutoring
• Event Organization
• Social Media Management
• Fundraising Support
• Administrative Help

⏰ Time Commitment:
• Flexible schedules available
• Minimum 4 hours per week
• Weekend opportunities available

📞 Contact: volunteers@nonprofit.org
```

#### 💬 Contact Support
**Provides:**
- Email and phone contact
- Business hours
- Online resources
- Common issues list

**Example Response:**
```
Contact Support:

💬 Get Help:

📧 Email: support@nonprofit.org
📞 Phone: +91-22-1234-5678
⏰ Hours: Mon-Fri, 9 AM - 6 PM IST

🌐 Online Resources:
• FAQ: www.nonprofit.org/faq
• Documentation: www.nonprofit.org/docs
• Video Tutorials: www.nonprofit.org/tutorials

💡 Common Issues:
• Donation receipt not received
• Volunteer registration help
• Technical support
• General inquiries

We typically respond within 24 hours! 🚀
```

### Step 3: Navigation
After viewing guidance, users can:
- **◀ Back to Main Menu** - Return to main options
- **🔄 Take Another Quiz** - Start new quiz (after completing one)

---

## 🎨 User Experience Flow

```
User clicks 💬
       ↓
Welcome Message + 5 Options
       ↓
User clicks "💝 How to Donate"
       ↓
Selection appears as user message
       ↓
Bot shows detailed donation guide
       ↓
"Back to Main Menu" button appears
       ↓
User can select another topic or close chat
```

---

## 📊 Complete Flow Diagram

```
┌─────────────────────────────┐
│   User Opens Chat (💬)      │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  Welcome + 5 Help Topics    │
│  1. Take a Quiz 🎓          │
│  2. How to Donate 💝        │
│  3. Send Emails 📧          │
│  4. Volunteer Info 🙋       │
│  5. Contact Support 💬      │
└──────────┬──────────────────┘
           │
     ┌─────┴─────┬─────┬─────┬─────┐
     │           │     │     │     │
     ▼           ▼     ▼     ▼     ▼
  ┌────┐    ┌──────┐ ┌────┐ ┌────┐ ┌────┐
  │Quiz│    │Donate│ │Email│ │Vol │ │Supp│
  └─┬──┘    └──┬───┘ └──┬─┘ └─┬──┘ └─┬──┘
    │          │        │     │      │
    │          └────────┴─────┴──────┘
    │                   │
    │          ┌────────┴────────┐
    │          │ Show Guidance   │
    │          │ + Back Button   │
    │          └─────────────────┘
    │
    ▼
┌──────────────────────┐
│  Select Quiz Topic   │
│  (5 donor emails)    │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│   Quiz Starts        │
│   Q&A Flow          │
│   Scoring           │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Quiz Complete       │
│  • Take Another Quiz │
│  • Back to Menu      │
└──────────────────────┘
```

---

## 🛠️ Technical Implementation

### New State Management
```javascript
state.chat = {
    isOpen: false,
    inGuidedMode: false,
    conversationHistory: []
}
```

### Help Topics Configuration
```javascript
const HELP_TOPICS = [
    {
        id: 'quiz',
        title: '🎓 Take a Quiz',
        description: 'Start learning with AI-generated quizzes'
    },
    // ... 4 more topics
];
```

### Key Functions

**`showWelcomeWithOptions()`**
- Displays welcome message
- Shows 5 clickable help topics
- Sets up event listeners

**`handleHelpTopic(topic)`**
- Handles topic selection
- Shows user's choice
- Displays appropriate guidance
- Shows navigation buttons

**`showBackToMenuButton()`**
- Adds "Back to Main Menu" button
- Resets guided mode
- Returns to welcome screen

---

## 🧪 Testing Checklist

### Initial Load
- [ ] Page loads without errors
- [ ] Stats cards show data
- [ ] Floating 💬 button visible

### Opening Chat
- [ ] Click 💬 button → chat opens
- [ ] See welcome message
- [ ] See 5 help topic buttons
- [ ] All buttons have icons and descriptions

### Topic Selection
- [ ] Click "How to Donate" → guidance appears
- [ ] Click "Send Emails" → email guide appears
- [ ] Click "Volunteer Info" → volunteer guide appears
- [ ] Click "Contact Support" → support info appears
- [ ] Click "Take a Quiz" → quiz topic selection appears

### Navigation
- [ ] After viewing guidance, see "Back to Main Menu" button
- [ ] Click back button → returns to main menu
- [ ] Can select different topics multiple times

### Quiz Flow
- [ ] Select "Take a Quiz"
- [ ] Choose quiz topic
- [ ] Quiz starts correctly
- [ ] After quiz, see both "Take Another Quiz" and "Back to Menu"

---

## 🎯 Customization Guide

### Adding New Help Topics

1. **Add to HELP_TOPICS array:**
```javascript
{
    id: 'new-topic',
    title: '🌟 New Feature',
    description: 'Description of feature'
}
```

2. **Add response in handleHelpTopic:**
```javascript
case 'new-topic':
    response = `
        <strong>New Feature Guide:</strong><br><br>
        • Step 1<br>
        • Step 2<br>
        • Step 3
    `;
    break;
```

### Customizing Responses

Edit the switch statement in `handleHelpTopic()` function:
```javascript
switch(topic.id) {
    case 'donate':
        response = `Your custom donation guide here`;
        break;
}
```

### Styling Topic Buttons

Modify button creation in `showWelcomeWithOptions()`:
```javascript
topicBtn.style.background = 'linear-gradient(...)';
topicBtn.style.border = '2px solid ...';
```

---

## 📱 Mobile Responsiveness

The chatbot is fully responsive:
- Panel width: `450px` on desktop
- Adapts to `calc(100vw - 40px)` on mobile
- Touch-friendly button sizes
- Scrollable content areas

---

## 🎨 Visual Design

**Help Topic Buttons:**
- Gray background (`#edf2f7`)
- Purple on hover (`#667eea`)
- Slide animation
- Two-line format (title + description)

**Navigation Buttons:**
- Teal background for primary actions (`#14b8a6`)
- White text
- Full-width
- Clear icons (◀ for back, 🔄 for restart)

---

## 🚀 Quick Start

```bash
cd /workspaces/default/code/quiz-tutor-bot
./start-server.sh
```

Then:
1. Open `http://localhost:8000`
2. Click 💬 button
3. Select any help topic
4. Explore the guidance!

---

## ✅ Summary

**Your chatbot now:**
- ✅ Greets users with "Hi! How can I help?"
- ✅ Shows 5 clickable help topics
- ✅ Provides detailed guidance for each topic
- ✅ Supports quiz mode with topic selection
- ✅ Allows easy navigation between topics
- ✅ Has "Back to Menu" functionality
- ✅ Maintains conversation history
- ✅ Works seamlessly with quiz system

**Users can:**
- 🎓 Start quizzes
- 💝 Learn how to donate
- 📧 Get email guidance
- 🙋 Find volunteer info
- 💬 Contact support

All in one interactive chatbot! 🎉
