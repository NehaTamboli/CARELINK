import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { motion } from 'motion/react';
import {
  Send,
  Sparkles,
  Tag,
  AlertCircle,
  User,
  DollarSign,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
} from 'lucide-react';

interface AnalysisResult {
  intent: string;
  urgency: 'low' | 'medium' | 'high';
  entities: {
    name?: string;
    amount?: string;
    location?: string;
    date?: string;
  };
  response: string;
  confidence: number;
}

const messageHistory = [
  {
    id: 1,
    message: 'I would like to make a $500 donation to support your education program',
    intent: 'Donation',
    urgency: 'medium',
    timestamp: '10 minutes ago',
  },
  {
    id: 2,
    message: 'I am interested in volunteering at your community center on weekends',
    intent: 'Volunteer',
    urgency: 'low',
    timestamp: '1 hour ago',
  },
  {
    id: 3,
    message: 'URGENT: We have not received the food supplies promised last week',
    intent: 'Complaint',
    urgency: 'high',
    timestamp: '2 hours ago',
  },
];

export function AIAnalyzer() {
  const [message, setMessage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!message.trim()) return;

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock result based on message content
    const mockResult: AnalysisResult = {
      intent: message.toLowerCase().includes('donation')
        ? 'Donation Inquiry'
        : message.toLowerCase().includes('volunteer')
        ? 'Volunteer Request'
        : message.toLowerCase().includes('partner')
        ? 'Partnership Inquiry'
        : 'General Inquiry',
      urgency: message.toLowerCase().includes('urgent') ? 'high' : 'medium',
      entities: {
        name: 'John Smith',
        amount: '$500',
        location: 'New York, NY',
        date: 'March 16, 2026',
      },
      response: `Thank you for your message. We appreciate your interest in ${
        message.toLowerCase().includes('donation')
          ? 'supporting our cause through a donation'
          : message.toLowerCase().includes('volunteer')
          ? 'volunteering with our organization'
          : 'partnering with us'
      }. Our team will review your request and get back to you within 24 hours. If you have any urgent questions, please call our hotline at (555) 123-4567.`,
      confidence: 94.5,
    };

    setResult(mockResult);
    setIsAnalyzing(false);
  };

  const urgencyColors = {
    low: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    high: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            AI Message Analyzer
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Analyze incoming messages using LangChain-powered AI classification
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
            >
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                Enter Message to Analyze
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Paste the incoming message here..."
                className="min-h-[200px] mb-4"
              />
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !message.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Clock className="mr-2 animate-spin" size={20} />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2" size={20} />
                    Analyze with AI
                  </>
                )}
              </Button>
            </motion.div>

            {/* Results Panel */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={24} />
                  Analysis Results
                </h3>

                <div className="space-y-4">
                  {/* Intent Classification */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="text-blue-600 dark:text-blue-400" size={20} />
                      <span className="font-medium text-gray-900 dark:text-white">
                        Intent Classification
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {result.intent}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Confidence: {result.confidence}%
                    </p>
                  </div>

                  {/* Urgency Level */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="text-gray-600 dark:text-gray-400" size={20} />
                      <span className="font-medium text-gray-900 dark:text-white">
                        Urgency Level
                      </span>
                    </div>
                    <span
                      className={`inline-block px-4 py-2 rounded-full text-sm font-medium uppercase ${
                        urgencyColors[result.urgency]
                      }`}
                    >
                      {result.urgency}
                    </span>
                  </div>

                  {/* Extracted Entities */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                      Extracted Entities
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {result.entities.name && (
                        <div className="flex items-center gap-2">
                          <User className="text-gray-400" size={16} />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Name</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {result.entities.name}
                            </p>
                          </div>
                        </div>
                      )}
                      {result.entities.amount && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="text-gray-400" size={16} />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {result.entities.amount}
                            </p>
                          </div>
                        </div>
                      )}
                      {result.entities.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="text-gray-400" size={16} />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {result.entities.location}
                            </p>
                          </div>
                        </div>
                      )}
                      {result.entities.date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="text-gray-400" size={16} />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {result.entities.date}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* AI Generated Response */}
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Send className="text-purple-600 dark:text-purple-400" size={20} />
                      <span className="font-medium text-gray-900 dark:text-white">
                        AI Generated Response
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {result.response}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline">
                        Edit Response
                      </Button>
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Send Response
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Message History */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 sticky top-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Messages
              </h3>
              <div className="space-y-3">
                {messageHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setMessage(item.message)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        {item.intent}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          urgencyColors[item.urgency as keyof typeof urgencyColors]
                        }`}
                      >
                        {item.urgency}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-2">
                      {item.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.timestamp}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
