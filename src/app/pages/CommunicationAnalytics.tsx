import React from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  MessageSquare,
  DollarSign,
  Users,
  AlertCircle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { StatCard } from '../components/StatCard';

const monthlyData = [
  { month: 'Jan', donations: 45, volunteers: 32, complaints: 12, partnerships: 8 },
  { month: 'Feb', donations: 52, volunteers: 41, complaints: 9, partnerships: 11 },
  { month: 'Mar', donations: 61, volunteers: 48, complaints: 14, partnerships: 15 },
  { month: 'Apr', donations: 58, volunteers: 55, complaints: 8, partnerships: 12 },
  { month: 'May', donations: 72, volunteers: 63, complaints: 11, partnerships: 18 },
  { month: 'Jun', donations: 85, volunteers: 71, complaints: 7, partnerships: 21 },
];

const urgencyTrends = [
  { month: 'Jan', high: 15, medium: 48, low: 82 },
  { month: 'Feb', high: 12, medium: 56, low: 95 },
  { month: 'Mar', high: 18, medium: 63, low: 107 },
  { month: 'Apr', high: 11, medium: 58, low: 115 },
  { month: 'May', high: 14, medium: 71, low: 128 },
  { month: 'Jun', high: 9, medium: 68, low: 142 },
];

const categoryDistribution = [
  { name: 'Donations', value: 342, color: '#3b82f6' },
  { name: 'Volunteers', value: 198, color: '#8b5cf6' },
  { name: 'Partnerships', value: 123, color: '#10b981' },
  { name: 'Complaints', value: 67, color: '#ef4444' },
];

const donationActivity = [
  { week: 'Week 1', amount: 2400, count: 12 },
  { week: 'Week 2', amount: 3100, count: 18 },
  { week: 'Week 3', amount: 2800, count: 15 },
  { week: 'Week 4', amount: 4200, count: 24 },
];

const volunteerTrends = [
  { month: 'Jan', applications: 32, approved: 28, active: 25 },
  { month: 'Feb', applications: 41, approved: 37, active: 33 },
  { month: 'Mar', applications: 48, approved: 44, active: 40 },
  { month: 'Apr', applications: 55, approved: 51, active: 47 },
  { month: 'May', applications: 63, approved: 58, active: 54 },
  { month: 'Jun', applications: 71, approved: 66, active: 62 },
];

export function CommunicationAnalytics() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Communication Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Insights and trends for message categories and donor activity
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Messages"
            value="1,247"
            icon={MessageSquare}
            trend={{ value: 12.5, isPositive: true }}
            color="blue"
          />
          <StatCard
            title="Total Donations"
            value="$48.2K"
            icon={DollarSign}
            trend={{ value: 18.3, isPositive: true }}
            color="green"
          />
          <StatCard
            title="Active Volunteers"
            value="198"
            icon={Users}
            trend={{ value: 15.7, isPositive: true }}
            color="purple"
          />
          <StatCard
            title="Complaints"
            value="67"
            icon={AlertCircle}
            trend={{ value: 3.2, isPositive: false }}
            color="red"
          />
        </div>

        {/* Message Categories Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Message Categories Over Time
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyData}>
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
              <Legend />
              <Bar dataKey="donations" fill="#3b82f6" name="Donations" radius={[4, 4, 0, 0]} />
              <Bar dataKey="volunteers" fill="#8b5cf6" name="Volunteers" radius={[4, 4, 0, 0]} />
              <Bar dataKey="partnerships" fill="#10b981" name="Partnerships" radius={[4, 4, 0, 0]} />
              <Bar dataKey="complaints" fill="#ef4444" name="Complaints" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Distribution & Urgency Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Category Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Urgency Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={urgencyTrends}>
                <defs>
                  <linearGradient id="highGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="mediumGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="lowGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                <Legend />
                <Area
                  type="monotone"
                  dataKey="high"
                  stackId="1"
                  stroke="#ef4444"
                  fill="url(#highGradient)"
                  name="High"
                />
                <Area
                  type="monotone"
                  dataKey="medium"
                  stackId="1"
                  stroke="#f59e0b"
                  fill="url(#mediumGradient)"
                  name="Medium"
                />
                <Area
                  type="monotone"
                  dataKey="low"
                  stackId="1"
                  stroke="#10b981"
                  fill="url(#lowGradient)"
                  name="Low"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Donation Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Donation Activity (Last 4 Weeks)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={donationActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="week" stroke="#9ca3af" />
              <YAxis yAxisId="left" stroke="#9ca3af" />
              <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="amount"
                fill="#3b82f6"
                name="Amount ($)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                yAxisId="right"
                dataKey="count"
                fill="#10b981"
                name="Count"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Volunteer Request Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Volunteer Request Analytics
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={volunteerTrends}>
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
              <Legend />
              <Line
                type="monotone"
                dataKey="applications"
                stroke="#8b5cf6"
                strokeWidth={3}
                name="Applications"
                dot={{ fill: '#8b5cf6', r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="approved"
                stroke="#3b82f6"
                strokeWidth={3}
                name="Approved"
                dot={{ fill: '#3b82f6', r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="active"
                stroke="#10b981"
                strokeWidth={3}
                name="Active"
                dot={{ fill: '#10b981', r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
