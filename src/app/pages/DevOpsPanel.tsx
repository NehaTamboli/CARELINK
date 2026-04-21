import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { motion } from 'motion/react';
import {
  GitBranch,
  CheckCircle,
  XCircle,
  Clock,
  Container,
  Cloud,
  Settings,
  PlayCircle,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';

const pipelines = [
  { id: 1, name: 'Build & Test', status: 'success', duration: '3m 42s', branch: 'main' },
  { id: 2, name: 'Deploy to Staging', status: 'running', duration: '2m 15s', branch: 'develop' },
  { id: 3, name: 'Security Scan', status: 'success', duration: '5m 12s', branch: 'main' },
  { id: 4, name: 'Deploy to Production', status: 'pending', duration: '-', branch: 'main' },
];

const containers = [
  { name: 'ai-triage-api', status: 'running', replicas: '3/3', cpu: '45%', memory: '512MB' },
  { name: 'langchain-service', status: 'running', replicas: '2/2', cpu: '62%', memory: '1.2GB' },
  { name: 'chromadb', status: 'running', replicas: '1/1', cpu: '23%', memory: '768MB' },
  { name: 'streamlit-ui', status: 'running', replicas: '2/2', cpu: '18%', memory: '256MB' },
];

const terraformResources = [
  { name: 'kubernetes_cluster', type: 'Cluster', status: 'applied', region: 'us-east-1' },
  { name: 'load_balancer', type: 'LoadBalancer', status: 'applied', region: 'us-east-1' },
  { name: 'postgres_db', type: 'Database', status: 'applied', region: 'us-east-1' },
  { name: 'storage_bucket', type: 'Storage', status: 'applied', region: 'us-east-1' },
];

export function DevOpsPanel() {
  const [activeTab, setActiveTab] = useState<'cicd' | 'containers' | 'terraform'>('cicd');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            DevOps Deployment Panel
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage CI/CD pipelines, containers, and infrastructure
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            onClick={() => setActiveTab('cicd')}
            variant={activeTab === 'cicd' ? 'default' : 'outline'}
            className={
              activeTab === 'cicd'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                : ''
            }
          >
            <GitBranch className="mr-2" size={18} />
            CI/CD Pipeline
          </Button>
          <Button
            onClick={() => setActiveTab('containers')}
            variant={activeTab === 'containers' ? 'default' : 'outline'}
            className={
              activeTab === 'containers'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                : ''
            }
          >
            <Container className="mr-2" size={18} />
            Docker/K8s
          </Button>
          <Button
            onClick={() => setActiveTab('terraform')}
            variant={activeTab === 'terraform' ? 'default' : 'outline'}
            className={
              activeTab === 'terraform'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                : ''
            }
          >
            <Cloud className="mr-2" size={18} />
            Terraform
          </Button>
        </div>

        {/* CI/CD Tab */}
        {activeTab === 'cicd' && (
          <div className="space-y-6">
            {/* Git Repository */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Git Repository
                </h3>
                <Button size="sm" variant="outline">
                  <Settings size={16} className="mr-2" />
                  Configure
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Repository</p>
                  <p className="font-mono text-sm text-gray-900 dark:text-white">
                    github.com/nonprofit/ai-triage-system
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-green-600 dark:text-green-400" size={16} />
                    <span className="font-medium text-green-600 dark:text-green-400">
                      Connected
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Pipeline Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Jenkins Pipeline Status
                </h3>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <PlayCircle size={16} className="mr-2" />
                  Run Pipeline
                </Button>
              </div>
              <div className="space-y-3">
                {pipelines.map((pipeline) => (
                  <div
                    key={pipeline.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      {pipeline.status === 'success' ? (
                        <CheckCircle className="text-green-500" size={24} />
                      ) : pipeline.status === 'running' ? (
                        <RefreshCw className="text-blue-500 animate-spin" size={24} />
                      ) : pipeline.status === 'failed' ? (
                        <XCircle className="text-red-500" size={24} />
                      ) : (
                        <Clock className="text-gray-400" size={24} />
                      )}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {pipeline.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Branch: {pipeline.branch}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          pipeline.status === 'success'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : pipeline.status === 'running'
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            : pipeline.status === 'failed'
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {pipeline.status}
                      </span>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {pipeline.duration}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Containers Tab */}
        {activeTab === 'containers' && (
          <div className="space-y-6">
            {/* Cluster Health */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Cluster Health
                  </h4>
                </div>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">Healthy</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  All nodes operational
                </p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Container className="text-blue-600 dark:text-blue-400" size={20} />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Running Pods
                  </h4>
                </div>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">8/8</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  All pods running
                </p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Cloud className="text-purple-600 dark:text-purple-400" size={20} />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Cluster Nodes
                  </h4>
                </div>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">3</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  All nodes ready
                </p>
              </div>
            </motion.div>

            {/* Container List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Docker Containers
              </h3>
              <div className="space-y-3">
                {containers.map((container, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Container className="text-blue-500" size={20} />
                        <div>
                          <p className="font-mono font-medium text-gray-900 dark:text-white">
                            {container.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Replicas: {container.replicas}
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                        {container.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          CPU Usage
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: container.cpu }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {container.cpu}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Memory
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {container.memory}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Terraform Tab */}
        {activeTab === 'terraform' && (
          <div className="space-y-6">
            {/* Terraform Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Infrastructure State
                </h3>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <RefreshCw size={16} className="mr-2" />
                    Plan
                  </Button>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    Apply
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Resources Managed
                  </p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {terraformResources.length}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Last Applied
                  </p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    2 hours ago
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Resource List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Terraform Resources
              </h3>
              <div className="space-y-3">
                {terraformResources.map((resource, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Cloud className="text-purple-500" size={20} />
                      <div>
                        <p className="font-mono font-medium text-gray-900 dark:text-white">
                          {resource.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Type: {resource.type} • Region: {resource.region}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                      {resource.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
