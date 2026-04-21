import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import UrgencyScale from '../components/UrgencyScale';
import NERDisplay from '../components/NERDisplay';
import { Search, Filter, CheckCircle2, Clock, User, Calendar, Trash2, Eye, X } from 'lucide-react';
import { api } from '../utils/api';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  sender: string;
  contact: string;
  message: string;
  category: string;
  urgency: 'High' | 'Medium' | 'Low' | 'Critical';
  status: string;
  timestamp: string;
  amount?: string | null;
  location?: string;
}

export default function Messages() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedUrgency, setSelectedUrgency] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    const data = await api.getMessages();
    setMessages(data);
    setLoading(false);
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const updated = await api.updateMessage(id, { status: newStatus });
    if (updated) {
      toast.success(`Message status updated to ${newStatus}`);
      await loadMessages();
    } else {
      toast.error('Failed to update message status');
    }
  };

  const handleDeleteMessage = async (id: string) => {
    const success = await api.deleteMessage(id);
    if (success) {
      toast.success('Message deleted successfully');
      await loadMessages();
    } else {
      toast.error('Failed to delete message');
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch = 
      msg.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.contact.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || msg.category === selectedCategory;
    const matchesUrgency = selectedUrgency === 'All' || msg.urgency === selectedUrgency;
    const matchesStatus = selectedStatus === 'All' || msg.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesUrgency && matchesStatus;
  });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High': return 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'Low': return 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'Critical': return 'text-pink-600 bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'Pending': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'In Progress': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Message Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">View and manage all incoming messages</p>
        </div>

        {/* Filters */}
        <Card className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-gray-600"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#14b8a6]"
            >
              <option value="All">All Categories</option>
              <option value="Donation">Donation</option>
              <option value="Volunteer">Volunteer</option>
              <option value="Complaint">Complaint</option>
              <option value="Partnership">Partnership</option>
              <option value="General Inquiry">General Inquiry</option>
            </select>

            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#14b8a6]"
            >
              <option value="All">All Urgency</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
              <option value="Critical">Critical</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#14b8a6]"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredMessages.length} of {messages.length} messages
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedUrgency('All');
                setSelectedStatus('All');
              }}
              className="text-[#14b8a6] border-[#14b8a6] hover:bg-teal-50 dark:hover:bg-teal-900/20"
            >
              Clear Filters
            </Button>
          </div>
        </Card>

        {/* Messages List */}
        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <Card key={message.id} className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-[#14b8a6] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {message.sender.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{message.sender}</h4>
                      <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(message.status)}`}>
                        {message.status}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded border ${getUrgencyColor(message.urgency)}`}>
                        {message.urgency}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{message.contact}</p>
                    <p className="text-gray-900 dark:text-white">{message.message}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-[#14b8a6] rounded-lg text-xs font-medium">
                      {message.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(message.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  {message.amount && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>Amount: ₹{parseInt(message.amount).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {!message.amount && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#14b8a6] text-[#14b8a6] hover:bg-teal-50 dark:hover:bg-teal-900/20"
                    >
                      Assign
                    </Button>
                  )}
                  <Button
                    size="sm"
                    className="bg-[#14b8a6] hover:bg-[#0f9688] text-white"
                    onClick={() => setSelectedMessage(message)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => handleDeleteMessage(message.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredMessages.length === 0 && (
          <Card className="p-12 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No messages found matching your filters</p>
            </div>
          </Card>
        )}
      </div>

      {/* Message Detail Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMessage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gradient-to-r from-[#14b8a6] to-[#0f9688] text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">Message Details</h2>
                    <p className="text-sm opacity-90 mt-1">AI Analysis & Classification</p>
                  </div>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Sender Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Sender Information</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#14b8a6] rounded-full flex items-center justify-center text-white font-semibold">
                      {selectedMessage.sender.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{selectedMessage.sender}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{selectedMessage.contact}</p>
                    </div>
                  </div>
                </div>

                {/* Message Content */}
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Message</h3>
                  <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4">
                    <p className="text-gray-900 dark:text-white">{selectedMessage.message}</p>
                  </div>
                </div>

                {/* Urgency Scale */}
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Urgency Analysis</h3>
                  <UrgencyScale urgency={selectedMessage.urgency} animated={true} size="md" />
                </div>

                {/* Extracted Entities */}
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Extracted Information</h3>
                  <NERDisplay
                    entities={{
                      name: selectedMessage.sender,
                      email: selectedMessage.contact.includes('@') ? selectedMessage.contact : undefined,
                      phone: selectedMessage.contact.includes('+') || selectedMessage.contact.match(/\d{10}/) ? selectedMessage.contact : undefined,
                      amount: selectedMessage.amount || undefined,
                      location: selectedMessage.location || undefined,
                      category: selectedMessage.category
                    }}
                    animated={true}
                    compact={false}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    onClick={() => {
                      handleUpdateStatus(selectedMessage.id, 'In Progress');
                      setSelectedMessage(null);
                    }}
                    className="flex-1 bg-[#14b8a6] hover:bg-[#0f9688] text-white"
                  >
                    Mark In Progress
                  </Button>
                  <Button
                    onClick={() => {
                      handleUpdateStatus(selectedMessage.id, 'Resolved');
                      setSelectedMessage(null);
                    }}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  >
                    Mark Resolved
                  </Button>
                  <Button
                    onClick={() => {
                      handleDeleteMessage(selectedMessage.id);
                      setSelectedMessage(null);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}