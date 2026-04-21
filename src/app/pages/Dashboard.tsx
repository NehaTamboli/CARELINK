import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Card } from '../components/ui/card';
import UrgencyScale from '../components/UrgencyScale';
import NERDisplay from '../components/NERDisplay';
import LLMResponseGenerator from '../components/LLMResponseGenerator';
import {
  Heart,
  Users,
  AlertCircle,
  MessageCircle,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Brain
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { api } from '../utils/api';
import { toast } from 'sonner';

interface AnalysisResult {
  intent: string;
  urgency: 'High' | 'Medium' | 'Low' | 'Critical';
  details: {
    name?: string;
    amount?: string;
    location?: string;
    date?: string;
    email?: string;
    phone?: string;
  };
  response: string;
}

export default function Dashboard() {
  const [message, setMessage] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 287,
    donations: 180000,
    volunteers: 42,
    pending: 8,
  });

  // Load messages from backend
  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    const messages = await api.getMessages();
    if (messages && messages.length > 0) {
      setRecentMessages(messages.slice(-5).reverse());
      
      // Update stats based on real data
      const pending = messages.filter(m => m.status === 'pending').length;
      const donations = messages
        .filter(m => m.category === 'Donation' && m.amount)
        .reduce((sum, m) => {
          const amount = parseInt(m.amount?.replace(/[^\d]/g, '') || '0');
          return sum + amount;
        }, 0);
      const volunteers = messages.filter(m => m.category === 'Volunteer').length;
      
      setStats({
        total: messages.length,
        donations: donations,
        volunteers: volunteers,
        pending: pending,
      });
    }
  };

  const handleAnalyze = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message to analyze');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Call backend API to analyze the message
      const analysis = await api.analyzeMessage(message);
      
      if (analysis) {
        const { category, urgency, extractedInfo } = analysis;
        
        // Generate appropriate response based on category
        let response = '';
        let intent = category;
        
        if (category === 'Donation') {
          response = 'Thank you for your generous donation intent! We truly appreciate your support. A member of our donation team will contact you shortly to process your contribution.';
        } else if (category === 'Volunteer') {
          response = 'Thank you for your interest in volunteering! Your support means a lot to us. We will connect you with our volunteer coordinator to discuss available opportunities.';
        } else if (category === 'Complaint') {
          response = 'We sincerely apologize for any inconvenience. Your concern is important to us and has been marked as high priority. Our support team will reach out to you within 24 hours to resolve this matter.';
        } else if (category === 'Partnership') {
          response = 'Thank you for your interest in partnering with us! We are excited about potential collaboration opportunities. Our partnerships team will contact you to discuss this further.';
        } else {
          response = 'Thank you for reaching out! We have received your message and will get back to you shortly with the information you need.';
        }
        
        setAnalysisResult({
          intent,
          urgency: urgency as 'High' | 'Medium' | 'Low' | 'Critical',
          details: extractedInfo || {},
          response,
        });
        
        // Save message to backend
        const savedMessage = await api.createMessage({
          message: message,
          sender: extractedInfo?.name || 'Anonymous',
          category: category,
          urgency: urgency,
          status: 'pending',
          contact: extractedInfo?.email || extractedInfo?.phone || '',
          amount: extractedInfo?.amount || null,
          location: extractedInfo?.location || '',
        });
        
        if (savedMessage) {
          toast.success('Message analyzed and saved successfully!');
          // Reload messages to show the new one
          await loadMessages();
          // Clear the input
          setMessage('');
        } else {
          toast.error('Message analyzed but failed to save');
        }
      } else {
        toast.error('Failed to analyze message. Please try again.');
      }
    } catch (error) {
      console.error('Error analyzing message:', error);
      toast.error('An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const categoryData = [
    { id: 'donations', name: 'Donations', value: 45, color: '#14b8a6' },
    { id: 'volunteers', name: 'Volunteers', value: 30, color: '#3b82f6' },
    { id: 'complaints', name: 'Complaints', value: 15, color: '#ef4444' },
    { id: 'general', name: 'General', value: 10, color: '#8b5cf6' },
  ];

  const dailyTrends = [
    { id: 'mon', day: 'Mon', messages: 24 },
    { id: 'tue', day: 'Tue', messages: 32 },
    { id: 'wed', day: 'Wed', messages: 28 },
    { id: 'thu', day: 'Thu', messages: 35 },
    { id: 'fri', day: 'Fri', messages: 42 },
    { id: 'sat', day: 'Sat', messages: 38 },
    { id: 'sun', day: 'Sun', messages: 30 },
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'Low': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'Critical': return 'text-red-800 bg-red-50 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Messages</p>
                <p className="text-3xl font-semibold text-gray-900 dark:text-white mt-2">{stats.total}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +12% from last week
                </p>
              </div>
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-[#14b8a6]" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Donations</p>
                <p className="text-3xl font-semibold text-gray-900 dark:text-white mt-2">₹{stats.donations.toLocaleString()}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +8% from last week
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Volunteers</p>
                <p className="text-3xl font-semibold text-gray-900 dark:text-white mt-2">{stats.volunteers}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +8 this week
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-3xl font-semibold text-gray-900 dark:text-white mt-2">{stats.pending}</p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Needs attention
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Message Analysis Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Message Analyzer</h3>
            <div className="space-y-4">
              <Textarea
                placeholder="Paste a message here to analyze... 
Example: Hi, I would like to donate ₹10,000 for education support. My name is Rahul from Mumbai."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[150px] bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-gray-600 resize-none"
              />
              <Button
                onClick={handleAnalyze}
                disabled={!message.trim() || isAnalyzing}
                className="w-full bg-[#14b8a6] hover:bg-[#0f9688] text-white py-6"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Message'}
              </Button>
            </div>
          </Card>

          {/* Results Panel */}
          <Card className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 space-y-6">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-[#14b8a6]" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Analysis Results</h3>
            </div>
            {analysisResult ? (
              <div className="space-y-6">
                {/* Intent Category */}
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Detected Intent
                  </p>
                  <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#14b8a6]/10 to-[#0f9688]/10 text-[#14b8a6] rounded-lg font-medium border border-[#14b8a6]/30">
                    {analysisResult.intent}
                  </span>
                </div>

                {/* Urgency Scale Visualization */}
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Urgency Analysis</p>
                  <UrgencyScale urgency={analysisResult.urgency} animated={true} />
                </div>

                {/* NER Display */}
                {Object.keys(analysisResult.details).length > 0 && (
                  <NERDisplay
                    entities={{
                      ...analysisResult.details,
                      category: analysisResult.intent
                    }}
                    animated={true}
                  />
                )}

                {/* LLM Response */}
                <LLMResponseGenerator
                  response={analysisResult.response}
                  category={analysisResult.intent}
                  urgency={analysisResult.urgency}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-[400px] text-gray-400 dark:text-gray-500">
                <div className="text-center">
                  <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">AI-Powered Message Triage</p>
                  <p className="text-sm">Enter a message and click analyze to see:</p>
                  <ul className="text-xs mt-3 space-y-1 text-left max-w-xs mx-auto">
                    <li>• Intent classification with LLM</li>
                    <li>• Urgency scale with visual indicators</li>
                    <li>• Named Entity Recognition (NER)</li>
                    <li>• AI-generated response drafts</li>
                  </ul>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Message Categories */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-5 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-[#14b8a6]" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">562</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Donation Requests</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">374</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Volunteer Requests</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">187</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Complaints</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">124</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">General Queries</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Messages and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Messages */}
          <Card className="lg:col-span-2 p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Messages</h3>
              <Button variant="ghost" className="text-[#14b8a6] hover:text-[#0f9688]">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white font-medium">{msg.sender}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{msg.text}</p>
                    </div>
                    {msg.status === 'Resolved' ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-1" />
                    ) : (
                      <Clock className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-1" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-[#14b8a6] rounded">
                      {msg.category}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${getUrgencyColor(msg.urgency)}`}>
                      {msg.urgency}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Analytics Preview */}
          <div className="space-y-6">
            <Card className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Messages by Category</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry) => (
                      <Cell key={`cell-${entry.id}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {categoryData.map((cat) => (
                  <div key={cat.id} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">{cat.name} ({cat.value}%)</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">This Week</h3>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={dailyTrends}>
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="messages" fill="#14b8a6" radius={[8, 8, 0, 0]}>
                    {dailyTrends.map((entry) => (
                      <Cell key={`bar-${entry.id}`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}