import { useState } from 'react';
import { X, Send, MessageCircle, Minimize2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Hello! I\'m CareLink Assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const quickResponses = [
    'How do I analyze a message?',
    'How to filter messages?',
    'View analytics',
    'Contact support',
  ];

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

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(inputMessage);
      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);
  };

  const getBotResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('analyze') || lowerMessage.includes('message')) {
      return 'To analyze a message, go to the Dashboard and paste your message in the text box. Click "Analyze Message" to get AI-powered insights including intent, urgency level, and extracted details.';
    } else if (lowerMessage.includes('filter')) {
      return 'You can filter messages by category, urgency, and status from the Messages page. Use the dropdown filters at the top to refine your search.';
    } else if (lowerMessage.includes('analytics')) {
      return 'The Analytics page shows detailed insights including donation trends, message categories, location data, and response times. You can access it from the sidebar.';
    } else if (lowerMessage.includes('support') || lowerMessage.includes('help')) {
      return 'For additional support, please contact us at support@carelink.org or call +91-22-12345678. Our team is available Monday to Friday, 9 AM to 6 PM IST.';
    } else {
      return 'I can help you with analyzing messages, filtering data, viewing analytics, and general support. What would you like to know more about?';
    }
  };

  const handleQuickResponse = (response: string) => {
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: response,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputMessage('');

    // Get bot response
    setTimeout(() => {
      const botResponse = getBotResponse(response);
      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#14b8a6] hover:bg-[#0f9688] text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 transition-all ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-[#14b8a6] text-white rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-[#14b8a6]" />
          </div>
          <div>
            <h3 className="font-semibold">CareLink Assistant</h3>
            <p className="text-xs opacity-90">Always here to help</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 h-[340px]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-[#14b8a6] text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Responses */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickResponses.map((response, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickResponse(response)}
                    className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-full transition-colors cursor-pointer"
                  >
                    {response}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-gray-600"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-[#14b8a6] hover:bg-[#0f9688] text-white px-4"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}