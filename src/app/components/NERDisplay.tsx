import { motion } from 'motion/react';
import { User, Mail, Phone, MapPin, Calendar, DollarSign, Hash, FileText, Tag, Building } from 'lucide-react';

interface ExtractedEntity {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  date?: string;
  amount?: string;
  id?: string;
  organization?: string;
  category?: string;
  [key: string]: string | undefined;
}

interface NERDisplayProps {
  entities: ExtractedEntity;
  animated?: boolean;
  compact?: boolean;
}

const entityConfig = [
  { key: 'name', icon: User, label: 'Name', color: '#14b8a6', bgColor: 'bg-teal-50 dark:bg-teal-900/20', borderColor: 'border-teal-200 dark:border-teal-700' },
  { key: 'email', icon: Mail, label: 'Email', color: '#3b82f6', bgColor: 'bg-blue-50 dark:bg-blue-900/20', borderColor: 'border-blue-200 dark:border-blue-700' },
  { key: 'phone', icon: Phone, label: 'Phone', color: '#8b5cf6', bgColor: 'bg-purple-50 dark:bg-purple-900/20', borderColor: 'border-purple-200 dark:border-purple-700' },
  { key: 'location', icon: MapPin, label: 'Location', color: '#ef4444', bgColor: 'bg-red-50 dark:bg-red-900/20', borderColor: 'border-red-200 dark:border-red-700' },
  { key: 'date', icon: Calendar, label: 'Date', color: '#f59e0b', bgColor: 'bg-orange-50 dark:bg-orange-900/20', borderColor: 'border-orange-200 dark:border-orange-700' },
  { key: 'amount', icon: DollarSign, label: 'Amount', color: '#10b981', bgColor: 'bg-green-50 dark:bg-green-900/20', borderColor: 'border-green-200 dark:border-green-700' },
  { key: 'id', icon: Hash, label: 'ID', color: '#6366f1', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20', borderColor: 'border-indigo-200 dark:border-indigo-700' },
  { key: 'organization', icon: Building, label: 'Organization', color: '#ec4899', bgColor: 'bg-pink-50 dark:bg-pink-900/20', borderColor: 'border-pink-200 dark:border-pink-700' },
  { key: 'category', icon: Tag, label: 'Category', color: '#06b6d4', bgColor: 'bg-cyan-50 dark:bg-cyan-900/20', borderColor: 'border-cyan-200 dark:border-cyan-700' },
];

export default function NERDisplay({ entities, animated = true, compact = false }: NERDisplayProps) {
  const extractedEntities = entityConfig.filter(config => entities[config.key]);

  if (extractedEntities.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 bg-gray-50 dark:bg-slate-700/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
        <div className="text-center">
          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
          <p className="text-sm text-gray-600 dark:text-gray-400">No entities extracted</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">AI will extract names, emails, dates, and more</p>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {extractedEntities.map((config, index) => {
          const Icon = config.icon;
          const value = entities[config.key];

          return (
            <motion.div
              key={config.key}
              initial={animated ? { scale: 0, opacity: 0 } : {}}
              animate={animated ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: index * 0.05 }}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${config.bgColor} border ${config.borderColor}`}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: config.color }} />
              <span className="text-xs font-medium text-gray-900 dark:text-white">{value}</span>
            </motion.div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-[#14b8a6] to-[#0f9688] rounded-lg flex items-center justify-center">
          <FileText className="w-4 h-4 text-white" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Extracted Entities</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">AI-powered Named Entity Recognition</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {extractedEntities.map((config, index) => {
          const Icon = config.icon;
          const value = entities[config.key];

          return (
            <motion.div
              key={config.key}
              initial={animated ? { x: -20, opacity: 0 } : {}}
              animate={animated ? { x: 0, opacity: 1 } : {}}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
              className={`relative overflow-hidden rounded-xl ${config.bgColor} border-2 ${config.borderColor} p-4 hover:shadow-lg transition-all group cursor-pointer`}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Content */}
              <div className="relative flex items-start gap-3">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: config.color }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </motion.div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wide font-medium">
                    {config.label}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white break-words">
                    {config.key === 'amount' && value ? `₹${parseInt(value).toLocaleString('en-IN')}` : value}
                  </p>
                </div>

                {/* Decorative element */}
                <motion.div
                  className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full opacity-10"
                  style={{ backgroundColor: config.color }}
                  animate={animated ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>

              {/* Animated border on hover */}
              <motion.div
                className="absolute inset-0 rounded-xl border-2"
                style={{ borderColor: config.color }}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.3 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      <motion.div
        initial={animated ? { y: 20, opacity: 0 } : {}}
        animate={animated ? { y: 0, opacity: 1 } : {}}
        transition={{ delay: extractedEntities.length * 0.1 }}
        className="mt-4 p-3 bg-gradient-to-r from-[#14b8a6]/10 to-[#0f9688]/10 dark:from-[#14b8a6]/20 dark:to-[#0f9688]/20 rounded-lg border border-[#14b8a6]/30"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#14b8a6] rounded-full animate-pulse" />
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {extractedEntities.length} entities identified
            </p>
          </div>
          <div className="flex items-center gap-1">
            {extractedEntities.slice(0, 3).map((config, idx) => {
              const Icon = config.icon;
              return (
                <div
                  key={idx}
                  className="w-6 h-6 rounded-md flex items-center justify-center"
                  style={{ backgroundColor: `${config.color}20` }}
                >
                  <Icon className="w-3 h-3" style={{ color: config.color }} />
                </div>
              );
            })}
            {extractedEntities.length > 3 && (
              <div className="w-6 h-6 rounded-md flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400">
                  +{extractedEntities.length - 3}
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
