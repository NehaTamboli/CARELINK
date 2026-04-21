import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { motion } from 'motion/react';
import {
  Search,
  Filter,
  Download,
  User,
  Clock,
  Tag,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  UserPlus,
} from 'lucide-react';

interface Message {
  id: number;
  sender: string;
  email: string;
  subject: string;
  preview: string;
  category: 'donation' | 'volunteer' | 'complaint' | 'partnership';
  urgency: 'low' | 'medium' | 'high';
  timestamp: string;
  status: 'unread' | 'read' | 'assigned' | 'resolved';
  assignedTo?: string;
}

const mockMessages: Message[] = [
  {
    id: 1,
    sender: 'John Smith',
    email: 'john.smith@email.com',
    subject: 'Monthly Donation Inquiry',
    preview: 'I would like to set up a monthly donation of $500 to support your education program...',
    category: 'donation',
    urgency: 'medium',
    timestamp: '10 min ago',
    status: 'unread',
  },
  {
    id: 2,
    sender: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    subject: 'Volunteer Application',
    preview: 'I am interested in volunteering at your community center on weekends...',
    category: 'volunteer',
    urgency: 'low',
    timestamp: '1 hour ago',
    status: 'assigned',
    assignedTo: 'Admin User',
  },
  {
    id: 3,
    sender: 'Michael Brown',
    email: 'mbrown@email.com',
    subject: 'URGENT: Missing Food Supplies',
    preview: 'We have not received the food supplies that were promised last week...',
    category: 'complaint',
    urgency: 'high',
    timestamp: '2 hours ago',
    status: 'resolved',
    assignedTo: 'Support Team',
  },
  {
    id: 4,
    sender: 'Tech Corp Inc.',
    email: 'partnerships@techcorp.com',
    subject: 'Partnership Proposal',
    preview: 'We would like to discuss a potential partnership opportunity...',
    category: 'partnership',
    urgency: 'medium',
    timestamp: '3 hours ago',
    status: 'read',
  },
  {
    id: 5,
    sender: 'Emma Wilson',
    email: 'emma.w@email.com',
    subject: 'Question About Programs',
    preview: 'Can you provide more information about your youth mentorship program?',
    category: 'volunteer',
    urgency: 'low',
    timestamp: '5 hours ago',
    status: 'assigned',
    assignedTo: 'Program Director',
  },
];

export function MessageManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUrgency, setFilterUrgency] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedMessages, setSelectedMessages] = useState<number[]>([]);

  const categoryColors = {
    donation: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    volunteer: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    complaint: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    partnership: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  };

  const urgencyColors = {
    low: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    high: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  };

  const statusColors = {
    unread: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    read: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
    assigned: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    resolved: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  };

  const filteredMessages = mockMessages.filter((msg) => {
    const matchesSearch =
      msg.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.preview.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUrgency = filterUrgency === 'all' || msg.urgency === filterUrgency;
    const matchesCategory = filterCategory === 'all' || msg.category === filterCategory;
    return matchesSearch && matchesUrgency && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Message Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View, filter, and manage all incoming messages
          </p>
        </div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Select value={filterUrgency} onValueChange={setFilterUrgency}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Urgency</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="donation">Donations</SelectItem>
                  <SelectItem value="volunteer">Volunteers</SelectItem>
                  <SelectItem value="complaint">Complaints</SelectItem>
                  <SelectItem value="partnership">Partnerships</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm">
              <Filter size={16} className="mr-2" />
              Advanced Filters
            </Button>
            <Button variant="outline" size="sm">
              <Download size={16} className="mr-2" />
              Export Report
            </Button>
          </div>
        </motion.div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Messages</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{filteredMessages.length}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Unread</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {filteredMessages.filter((m) => m.status === 'unread').length}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Assigned</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {filteredMessages.filter((m) => m.status === 'assigned').length}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Resolved</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {filteredMessages.filter((m) => m.status === 'resolved').length}
            </p>
          </motion.div>
        </div>

        {/* Message List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Sender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Urgency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredMessages.map((message) => (
                  <tr
                    key={message.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                          {message.sender.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {message.sender}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {message.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 dark:text-white mb-1">
                        {message.subject}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                        {message.preview}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          categoryColors[message.category]
                        }`}
                      >
                        <Tag size={12} />
                        {message.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium uppercase ${
                          urgencyColors[message.urgency]
                        }`}
                      >
                        {message.urgency}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            statusColors[message.status]
                          }`}
                        >
                          {message.status}
                        </span>
                        {message.assignedTo && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            → {message.assignedTo}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Clock size={14} />
                        {message.timestamp}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye size={16} className="text-gray-600 dark:text-gray-400" />
                        </button>
                        <button
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Assign"
                        >
                          <UserPlus size={16} className="text-gray-600 dark:text-gray-400" />
                        </button>
                        <button
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="More"
                        >
                          <MoreVertical size={16} className="text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
