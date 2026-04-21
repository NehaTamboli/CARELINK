import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { motion } from 'motion/react';
import {
  Server,
  Activity,
  Cpu,
  HardDrive,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const cpuData = [
  { time: '00:00', usage: 45 },
  { time: '04:00', usage: 32 },
  { time: '08:00', usage: 58 },
  { time: '12:00', usage: 72 },
  { time: '16:00', usage: 65 },
  { time: '20:00', usage: 51 },
];

const memoryData = [
  { time: '00:00', usage: 1200 },
  { time: '04:00', usage: 980 },
  { time: '08:00', usage: 1450 },
  { time: '12:00', usage: 1680 },
  { time: '16:00', usage: 1520 },
  { time: '20:00', usage: 1350 },
];

const services = [
  { name: 'AI Triage API', status: 'healthy', uptime: '99.98%', requests: '1.2M' },
  { name: 'LangChain Service', status: 'healthy', uptime: '99.95%', requests: '856K' },
  { name: 'ChromaDB', status: 'healthy', uptime: '100%', requests: '2.3M' },
  { name: 'Streamlit UI', status: 'warning', uptime: '99.87%', requests: '425K' },
  { name: 'Load Balancer', status: 'healthy', uptime: '100%', requests: '3.8M' },
];

const deploymentLogs = [
  { id: 1, timestamp: '2026-03-16 14:32:15', env: 'Production', message: 'Deployed v2.4.1 successfully', status: 'success' },
  { id: 2, timestamp: '2026-03-16 12:15:42', env: 'Staging', message: 'Database migration completed', status: 'success' },
  { id: 3, timestamp: '2026-03-16 10:22:08', env: 'Development', message: 'Updated AI model configuration', status: 'success' },
  { id: 4, timestamp: '2026-03-16 09:45:33', env: 'Staging', message: 'Health check failed - auto-recovery initiated', status: 'warning' },
  { id: 5, timestamp: '2026-03-16 08:10:19', env: 'Production', message: 'Scaled to 5 replicas', status: 'info' },
];

export function InfrastructureMonitoring() {
  const [selectedEnv, setSelectedEnv] = useState<'dev' | 'test' | 'prod'>('prod');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Infrastructure Monitoring
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Real-time monitoring and deployment logs
            </p>
          </div>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
            <RefreshCw size={18} className="mr-2" />
            Refresh Data
          </Button>
        </div>

        {/* Environment Selector */}
        <div className="flex gap-2 mb-6">
          <Button
            onClick={() => setSelectedEnv('dev')}
            variant={selectedEnv === 'dev' ? 'default' : 'outline'}
            className={
              selectedEnv === 'dev'
                ? 'bg-gradient-to-r from-green-500 to-green-600'
                : ''
            }
          >
            Development
          </Button>
          <Button
            onClick={() => setSelectedEnv('test')}
            variant={selectedEnv === 'test' ? 'default' : 'outline'}
            className={
              selectedEnv === 'test'
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                : ''
            }
          >
            Testing
          </Button>
          <Button
            onClick={() => setSelectedEnv('prod')}
            variant={selectedEnv === 'prod' ? 'default' : 'outline'}
            className={
              selectedEnv === 'prod'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                : ''
            }
          >
            Production
          </Button>
        </div>

        {/* Service Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Services Running</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">5/5</p>
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
              <p className="text-xs text-green-700 dark:text-green-300">
                All systems operational
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Cpu className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg CPU Usage</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">42%</p>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                style={{ width: '42%' }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <HardDrive className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Memory Usage</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">1.4GB</p>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full"
                style={{ width: '56%' }}
              />
            </div>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              CPU Usage (24h)
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={cpuData}>
                <defs>
                  <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="usage"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#cpuGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Memory Usage (24h)
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={memoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" />
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
                  dataKey="usage"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Service Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Service Health & Uptime
          </h3>
          <div className="space-y-3">
            {services.map((service, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {service.status === 'healthy' ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <AlertTriangle className="text-yellow-500" size={20} />
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{service.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {service.requests} requests
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Uptime</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {service.uptime}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      service.status === 'healthy'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                    }`}
                  >
                    {service.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Deployment Logs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Deployment Logs
          </h3>
          <div className="space-y-2">
            {deploymentLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg font-mono text-sm"
              >
                <span
                  className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                    log.status === 'success'
                      ? 'bg-green-500'
                      : log.status === 'warning'
                      ? 'bg-yellow-500'
                      : 'bg-blue-500'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {log.timestamp}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        log.env === 'Production'
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : log.env === 'Staging'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      }`}
                    >
                      {log.env}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{log.message}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
