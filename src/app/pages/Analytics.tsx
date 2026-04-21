import DashboardLayout from '../components/DashboardLayout';
import { Card } from '../components/ui/card';
import { TrendingUp, TrendingDown, Users, Heart, MessageSquare, Calendar } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

export default function Analytics() {
  const monthlyTrends = [
    { month: 'Sep', donations: 18, volunteers: 12, messages: 65 },
    { month: 'Oct', donations: 22, volunteers: 15, messages: 78 },
    { month: 'Nov', donations: 26, volunteers: 18, messages: 92 },
    { month: 'Dec', donations: 24, volunteers: 16, messages: 85 },
    { month: 'Jan', donations: 31, volunteers: 21, messages: 108 },
    { month: 'Feb', donations: 28, volunteers: 19, messages: 98 },
    { month: 'Mar', donations: 35, volunteers: 24, messages: 117 },
  ];

  const donationAmounts = [
    { range: '₹0-5K', count: 156 },
    { range: '₹5-10K', count: 89 },
    { range: '₹10-25K', count: 67 },
    { range: '₹25-50K', count: 34 },
    { range: '₹50K+', count: 22 },
  ];

  const categoryDistribution = [
    { name: 'Donations', value: 562, color: '#14b8a6' },
    { name: 'Volunteers', value: 374, color: '#3b82f6' },
    { name: 'Complaints', value: 187, color: '#ef4444' },
    { name: 'General', value: 124, color: '#8b5cf6' },
  ];

  const urgencyDistribution = [
    { name: 'High', value: 234, color: '#ef4444' },
    { name: 'Medium', value: 456, color: '#f59e0b' },
    { name: 'Low', value: 557, color: '#22c55e' },
  ];

  const locationData = [
    { city: 'Mumbai', count: 342 },
    { city: 'Delhi', count: 298 },
    { city: 'Bangalore', count: 256 },
    { city: 'Pune', count: 189 },
    { city: 'Chennai', count: 167 },
    { city: 'Hyderabad', count: 145 },
    { city: 'Others', count: 234 },
  ];

  const responseTime = [
    { day: 'Mon', avgMinutes: 45 },
    { day: 'Tue', avgMinutes: 38 },
    { day: 'Wed', avgMinutes: 52 },
    { day: 'Thu', avgMinutes: 41 },
    { day: 'Fri', avgMinutes: 49 },
    { day: 'Sat', avgMinutes: 56 },
    { day: 'Sun', avgMinutes: 62 },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Insights and trends for your organization</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Donations</p>
                <p className="text-3xl font-semibold text-gray-900 dark:text-white mt-2">₹42.5L</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +18% vs last month
                </p>
              </div>
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-[#14b8a6]" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Donation</p>
                <p className="text-3xl font-semibold text-gray-900 dark:text-white mt-2">₹7,560</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +5% vs last month
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Volunteers</p>
                <p className="text-3xl font-semibold text-gray-900 dark:text-white mt-2">248</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +32 this month
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
                <p className="text-sm text-gray-600 dark:text-gray-400">Response Rate</p>
                <p className="text-3xl font-semibold text-gray-900 dark:text-white mt-2">94.2%</p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" /> -2% vs last month
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Monthly Trends */}
        <Card className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyTrends}>
              <defs>
                <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorVolunteers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f1f5f9'
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="donations" 
                stroke="#14b8a6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorDonations)" 
                name="Donations"
              />
              <Area 
                type="monotone" 
                dataKey="volunteers" 
                stroke="#3b82f6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorVolunteers)" 
                name="Volunteers"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Donation Amounts */}
          <Card className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Donation Amount Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={donationAmounts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="range" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }}
                />
                <Bar dataKey="count" fill="#14b8a6" radius={[8, 8, 0, 0]} name="Number of Donations" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Category Distribution */}
          <Card className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Message Categories</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Location Distribution */}
          <Card className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Messages by Location</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={locationData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis dataKey="city" type="category" stroke="#6b7280" width={80} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 8, 8, 0]} name="Messages" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Urgency Distribution */}
          <Card className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Urgency Levels</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={urgencyDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {urgencyDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Response Time */}
        <Card className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Average Response Time (minutes)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={responseTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f1f5f9'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="avgMinutes" 
                stroke="#14b8a6" 
                strokeWidth={3}
                dot={{ fill: '#14b8a6', r: 5 }}
                name="Avg Response Time"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </DashboardLayout>
  );
}