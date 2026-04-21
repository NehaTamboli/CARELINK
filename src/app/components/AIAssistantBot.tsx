import { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle, Minimize2, Bot, Sparkles, BookOpen, Heart, Mail, Users, Phone, Award, ChevronRight, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'quiz' | 'options';
  options?: string[];
  quizData?: {
    question: string;
    options: string[];
    correctAnswer: number;
  };
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    topic: 'Donor Engagement',
    question: 'What is the most effective way to acknowledge a first-time donor?',
    options: [
      'Send an automated email receipt',
      'Make a personal phone call within 48 hours',
      'Add them to a monthly newsletter',
      'Wait until the next campaign to reach out'
    ],
    correctAnswer: 1,
    explanation: 'Personal phone calls within 48 hours create a strong connection and increase donor retention by 30%.'
  },
  {
    id: 2,
    topic: 'Donor Communication',
    question: 'How often should you communicate with regular donors?',
    options: [
      'Only when asking for donations',
      'Quarterly with impact updates',
      'Monthly newsletters plus impact reports',
      'Weekly updates'
    ],
    correctAnswer: 2,
    explanation: 'Monthly newsletters combined with impact reports keep donors engaged without overwhelming them.'
  },
  {
    id: 3,
    topic: 'Donation Impact',
    question: 'What type of content resonates most with donors?',
    options: [
      'Organizational achievements',
      'Stories of individual beneficiaries',
      'Financial reports',
      'Volunteer opportunities'
    ],
    correctAnswer: 1,
    explanation: 'Personal stories create emotional connections and show donors the direct impact of their contributions.'
  },
  {
    id: 4,
    topic: 'Donor Retention',
    question: 'What percentage of donors typically give a second time?',
    options: [
      '80-90%',
      '60-70%',
      '40-50%',
      'Less than 30%'
    ],
    correctAnswer: 3,
    explanation: 'Only about 20-30% of first-time donors give again, highlighting the importance of retention strategies.'
  },
  {
    id: 5,
    topic: 'Email Best Practices',
    question: 'What is the ideal subject line length for donor emails?',
    options: [
      '10-20 characters',
      '30-50 characters',
      '60-80 characters',
      'Over 100 characters'
    ],
    correctAnswer: 1,
    explanation: 'Subject lines between 30-50 characters have the highest open rates and display fully on mobile devices.'
  }
];

const helpTopics = [
  { icon: BookOpen, title: 'Take a Quiz', color: 'bg-purple-500', description: 'Test your knowledge on donor engagement' },
  { icon: Heart, title: 'How to Donate', color: 'bg-pink-500', description: 'Learn about donation methods' },
  { icon: Mail, title: 'Send Donor Emails', color: 'bg-blue-500', description: 'Email templates and best practices' },
  { icon: Users, title: 'Volunteer Information', color: 'bg-green-500', description: 'Get volunteer opportunities' },
  { icon: Phone, title: 'Contact Support', color: 'bg-orange-500', description: 'Reach our support team' },
];

export default function AIAssistantBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Welcome to CareLink AI Assistant! 🌟\n\nI\'m your intelligent guide for non-profit support. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showingTopics, setShowingTopics] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleTopicClick = (topic: string) => {
    setShowingTopics(false);
    const userMessage: Message = {
      id: messages.length + 1,
      text: topic,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);

    setTimeout(() => {
      const botResponse = getTopicResponse(topic);
      setMessages((prev) => [...prev, botResponse]);
    }, 500);
  };

  const getTopicResponse = (topic: string): Message => {
    const id = messages.length + 2;
    const timestamp = new Date();

    if (topic === 'Take a Quiz') {
      const randomQuiz = quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
      setCurrentQuiz(randomQuiz);
      return {
        id,
        text: `📚 Quiz Time!\n\nTopic: ${randomQuiz.topic}\n\n${randomQuiz.question}`,
        sender: 'bot',
        timestamp,
        type: 'quiz',
        quizData: randomQuiz,
      };
    } else if (topic === 'How to Donate') {
      return {
        id,
        text: `💝 Donation Methods\n\nWe accept donations through:\n\n1. **Online Payment**: UPI, Credit/Debit Cards, Net Banking\n2. **Bank Transfer**: Direct transfer to our account\n3. **Cheque/DD**: Payable to "CareLink Foundation"\n4. **Monthly Giving**: Set up recurring donations\n\nAll donations are tax-deductible under 80G.\n\nAccount Details:\nBank: HDFC Bank\nA/C No: 1234567890\nIFSC: HDFC0001234\n\nWould you like to proceed with a donation?`,
        sender: 'bot',
        timestamp,
      };
    } else if (topic === 'Send Donor Emails') {
      return {
        id,
        text: `📧 Donor Email Best Practices\n\n**Email Templates Available:**\n\n1. **Welcome Email**: For first-time donors\n2. **Thank You Email**: Post-donation acknowledgment\n3. **Impact Update**: Quarterly impact reports\n4. **Campaign Launch**: New fundraising campaigns\n5. **Year-End Summary**: Annual impact review\n\n**Key Tips:**\n• Personalize with donor's name and history\n• Keep subject lines under 50 characters\n• Include specific impact stories\n• Add clear call-to-action\n• Send within 48 hours of donation\n\nWould you like a specific template?`,
        sender: 'bot',
        timestamp,
      };
    } else if (topic === 'Volunteer Information') {
      return {
        id,
        text: `🤝 Volunteer Opportunities\n\n**Available Positions:**\n\n1. **Education Support**: Tutoring underprivileged children\n2. **Community Outreach**: Field visits and awareness\n3. **Event Management**: Organize fundraising events\n4. **Content Creation**: Social media and blogs\n5. **Administrative Support**: Office assistance\n\n**Requirements:**\n• Minimum 4 hours/week commitment\n• Background verification required\n• Orientation session attendance\n\n**Benefits:**\n• Certificate of appreciation\n• Skill development workshops\n• Networking opportunities\n\nInterested in volunteering?`,
        sender: 'bot',
        timestamp,
      };
    } else if (topic === 'Contact Support') {
      return {
        id,
        text: `📞 Contact Information\n\n**Support Channels:**\n\n**Email**: support@carelink.org\n**Phone**: +91-22-1234-5678\n**WhatsApp**: +91-98765-43210\n\n**Office Hours:**\nMonday - Friday: 9:00 AM - 6:00 PM IST\nSaturday: 10:00 AM - 2:00 PM IST\n\n**Office Address:**\nCareLink Foundation\n123, Charity Complex\nMumbai, Maharashtra 400001\n\n**Emergency Hotline:**\n+91-22-9999-8888 (24/7)\n\nHow can we assist you today?`,
        sender: 'bot',
        timestamp,
      };
    }

    return {
      id,
      text: 'I can help you with various topics. Please select from the menu above.',
      sender: 'bot',
      timestamp,
    };
  };

  const handleQuizAnswer = (selectedIndex: number) => {
    if (!currentQuiz) return;

    const isCorrect = selectedIndex === currentQuiz.correctAnswer;
    const newScore = isCorrect ? quizScore + 1 : quizScore;
    const newQuestionsAnswered = questionsAnswered + 1;

    setQuizScore(newScore);
    setQuestionsAnswered(newQuestionsAnswered);

    const resultMessage: Message = {
      id: messages.length + 1,
      text: isCorrect
        ? `✅ Correct! ${currentQuiz.explanation}\n\nScore: ${newScore}/${newQuestionsAnswered}`
        : `❌ Incorrect. ${currentQuiz.explanation}\n\nThe correct answer was: ${currentQuiz.options[currentQuiz.correctAnswer]}\n\nScore: ${newScore}/${newQuestionsAnswered}`,
      sender: 'bot',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, resultMessage]);
    setCurrentQuiz(null);

    // Offer another quiz
    setTimeout(() => {
      const followUp: Message = {
        id: messages.length + 2,
        text: 'Would you like to try another quiz question or explore other topics?',
        sender: 'bot',
        timestamp: new Date(),
        type: 'options',
        options: ['Another Quiz', 'Back to Menu'],
      };
      setMessages((prev) => [...prev, followUp]);
    }, 1000);
  };

  const handleOptionClick = (option: string) => {
    const userMessage: Message = {
      id: messages.length + 1,
      text: option,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);

    if (option === 'Another Quiz') {
      handleTopicClick('Take a Quiz');
    } else if (option === 'Back to Menu') {
      setShowingTopics(true);
      const botMessage: Message = {
        id: messages.length + 2,
        text: 'Sure! Select a topic from the menu below:',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputMessage('');
    setShowingTopics(false);

    setTimeout(() => {
      const botResponse = getAIResponse(inputMessage);
      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);
  };

  const getAIResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('quiz') || lowerMessage.includes('test') || lowerMessage.includes('question')) {
      return 'Great! I can help you with a quiz. Click on "Take a Quiz" from the menu to start.';
    } else if (lowerMessage.includes('donate') || lowerMessage.includes('donation') || lowerMessage.includes('contribute')) {
      return 'Thank you for your interest in donating! I can provide you with all the donation methods and bank details. Click on "How to Donate" from the menu.';
    } else if (lowerMessage.includes('email') || lowerMessage.includes('template') || lowerMessage.includes('donor communication')) {
      return 'I can help you with donor email templates and best practices. Select "Send Donor Emails" from the menu to get started.';
    } else if (lowerMessage.includes('volunteer') || lowerMessage.includes('help') || lowerMessage.includes('join')) {
      return 'Wonderful! We have various volunteer opportunities. Click on "Volunteer Information" to learn more about available positions.';
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('support') || lowerMessage.includes('phone') || lowerMessage.includes('email')) {
      return 'I can connect you with our support team. Click on "Contact Support" for all contact details and office hours.';
    } else if (lowerMessage.includes('urgent') || lowerMessage.includes('emergency') || lowerMessage.includes('critical')) {
      return 'For urgent matters, please call our 24/7 emergency hotline at +91-22-9999-8888 or use "Contact Support" from the menu.';
    } else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return 'You\'re welcome! I\'m here to help. Feel free to ask anything or select a topic from the menu.';
    }

    return `I understand you're asking about "${message}". I can help you with:\n\n• Taking quizzes on donor engagement\n• Donation methods and details\n• Email templates for donors\n• Volunteer opportunities\n• Contact and support information\n\nPlease select a topic from the menu or ask me anything specific!`;
  };

  const resetChat = () => {
    setMessages([
      {
        id: 1,
        text: 'Welcome to CareLink AI Assistant! 🌟\n\nI\'m your intelligent guide for non-profit support. How can I help you today?',
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      },
    ]);
    setShowingTopics(true);
    setCurrentQuiz(null);
    setQuizScore(0);
    setQuestionsAnswered(0);
  };

  if (!isOpen) {
    return (
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-[#14b8a6] to-[#0f9688] hover:from-[#0f9688] hover:to-[#0d8477] text-white rounded-full shadow-2xl flex items-center justify-center transition-all z-50 group"
      >
        <Bot className="w-7 h-7 group-hover:rotate-12 transition-transform" />
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed bottom-6 right-6 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border-2 border-[#14b8a6]/20 dark:border-[#14b8a6]/40 z-50 transition-all overflow-hidden ${
        isMinimized ? 'w-80 h-16' : 'w-[420px] h-[680px]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#14b8a6] to-[#0f9688] text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
            <Bot className="w-6 h-6 text-[#14b8a6]" />
          </div>
          <div>
            <h3 className="font-semibold flex items-center gap-2">
              AI Assistant Bot
              <Sparkles className="w-4 h-4" />
            </h3>
            <p className="text-xs opacity-90">Powered by LLM</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetChat}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            title="Reset Chat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Score Display */}
          {questionsAnswered > 0 && (
            <div className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center">
              <div className="flex items-center justify-center gap-2">
                <Award className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Quiz Score: {quizScore}/{questionsAnswered} ({Math.round((quizScore / questionsAnswered) * 100)}%)
                </span>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[450px] bg-gradient-to-b from-gray-50/50 to-white dark:from-slate-900/50 dark:to-slate-800">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-br from-[#14b8a6] to-[#0f9688] text-white shadow-lg'
                        : 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-md border border-gray-100 dark:border-gray-600'
                    }`}
                  >
                    {message.type === 'quiz' && message.quizData ? (
                      <div className="space-y-3">
                        <p className="text-sm whitespace-pre-line">{message.text}</p>
                        <div className="space-y-2 mt-3">
                          {message.quizData.options.map((option, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleQuizAnswer(idx)}
                              className="w-full text-left p-3 bg-gray-50 dark:bg-slate-600 hover:bg-[#14b8a6] hover:text-white rounded-lg transition-all text-sm border border-gray-200 dark:border-gray-500 hover:border-[#14b8a6] hover:shadow-lg"
                            >
                              {String.fromCharCode(65 + idx)}. {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : message.type === 'options' && message.options ? (
                      <div className="space-y-3">
                        <p className="text-sm">{message.text}</p>
                        <div className="flex gap-2">
                          {message.options.map((option, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleOptionClick(option)}
                              className="flex-1 p-2 bg-[#14b8a6] text-white hover:bg-[#0f9688] rounded-lg transition-all text-sm shadow-md hover:shadow-lg"
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                        <p
                          className={`text-xs mt-2 ${
                            message.sender === 'user' ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Help Topics Menu */}
          {showingTopics && (
            <div className="px-4 pb-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 mt-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Select a topic:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {helpTopics.map((topic, index) => {
                  const Icon = topic.icon;
                  return (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTopicClick(topic.title)}
                      className="flex items-center gap-2 p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-600 hover:from-[#14b8a6]/10 hover:to-[#0f9688]/10 rounded-xl transition-all text-left border border-gray-200 dark:border-gray-600 hover:border-[#14b8a6] hover:shadow-md group"
                    >
                      <div className={`w-8 h-8 ${topic.color} rounded-lg flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{topic.title}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{topic.description}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#14b8a6] transition-colors flex-shrink-0" />
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything..."
                className="flex-1 bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-gray-600 focus:border-[#14b8a6] rounded-xl"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-[#14b8a6] to-[#0f9688] hover:from-[#0f9688] hover:to-[#0d8477] text-white px-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
