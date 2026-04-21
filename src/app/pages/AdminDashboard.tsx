import React from 'react';
import { StatCard } from '../components/StatCard';
import {
  MessageSquare,
  DollarSign,
  Users,
  AlertCircle,
  TrendingUp,
  Activity,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { motion } from 'motion/react';

const messageData = [
  { month: 'Jan', messages: 245 },
  { month: 'Feb', messages: 312 },
  { month: 'Mar', messages: 428 },
  { month: 'Apr', messages: 389 },
  { month: 'May', messages: 456 },
  { month: 'Jun', messages: 521 },
];

const categoryData = [
  { name: 'Donations', value: 342, color: '#3b82f6' },
  { name: 'Volunteers', value: 198, color: '#8b5cf6' },
  { name: 'Complaints', value: 67, color: '#ef4444' },
  { name: 'Partnerships', value: 123, color: '#10b981' },
];

const activityLogs = [
  { id: 1, type: 'donation', message: 'New donation inquiry from John Smith', time: '2 min ago', status: 'processed' },
  { id: 2, type: 'volunteer', message: 'Volunteer application received', time: '15 min ago', status: 'pending' },
  { id: 3, type: 'complaint', message: 'Complaint resolved for case #1234', time: '1 hour ago', status: 'resolved' },
  { id: 4, type: 'partnership', message: 'Partnership proposal from Tech Corp', time: '2 hours ago', status: 'processed' },
  { id: 5, type: 'donation', message: 'Monthly donation processed', time: '3 hours ago', status: 'processed' },
];

export function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Non-Profit Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Overview of all incoming messages and system performance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Messages"
            value="1,247"
            icon={MessageSquare}
            trend={{ value: 12.5, isPositive: true }}
            color="blue"
          />
          <StatCard
            title="Donation Inquiries"
            value="342"
            icon={DollarSign}
            trend={{ value: 8.2, isPositive: true }}
            color="green"
          />
          <StatCard
            title="Volunteer Requests"
            value="198"
            icon={Users}
            trend={{ value: 15.3, isPositive: true }}
            color="purple"
          />
          <StatCard
            title="Complaints"
            value="67"
            icon={AlertCircle}
            trend={{ value: 3.1, isPositive: false }}
            color="red"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Message Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Message Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={messageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="messages"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Message Categories
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Response Success Rate
              </h3>
              <TrendingUp className="text-green-500" size={24} />
            </div>
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">96.8%</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI-generated responses successfully handled
            </p>
            <div className="mt-4 bg-gray-100 dark:bg-gray-800 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                style={{ width: '96.8%' }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Avg Response Time
              </h3>
              <Activity className="text-blue-500" size={24} />
            </div>
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">1.2s</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Average AI processing time per message
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                ↓ 23% faster
              </span>
              <span className="text-xs text-gray-500">than last month</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                System Uptime
              </h3>
              <Activity className="text-purple-500" size={24} />
            </div>
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">99.9%</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Infrastructure availability this month
            </p>
            <div className="mt-4 bg-gray-100 dark:bg-gray-800 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full"
                style={{ width: '99.9%' }}
              />
            </div>
          </motion.div>
        </div>

        {/* Activity Log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {activityLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      log.status === 'processed'
                        ? 'bg-blue-500'
                        : log.status === 'resolved'
                        ? 'bg-green-500'
                        : 'bg-yellow-500'
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {log.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{log.time}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    log.status === 'processed'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : log.status === 'resolved'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                  }`}
                >
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
