import { motion } from 'motion/react';
import { AlertTriangle, AlertCircle, Info, Zap } from 'lucide-react';

interface UrgencyScaleProps {
  urgency: 'Critical' | 'High' | 'Medium' | 'Low';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const urgencyLevels = [
  {
    level: 'Low',
    icon: Info,
    color: '#10b981',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    textColor: 'text-green-700 dark:text-green-400',
    position: 0,
    description: 'Routine inquiry'
  },
  {
    level: 'Medium',
    icon: AlertCircle,
    color: '#f59e0b',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    textColor: 'text-yellow-700 dark:text-yellow-400',
    position: 33,
    description: 'Needs attention'
  },
  {
    level: 'High',
    icon: AlertTriangle,
    color: '#ef4444',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    textColor: 'text-red-700 dark:text-red-400',
    position: 66,
    description: 'Urgent response required'
  },
  {
    level: 'Critical',
    icon: Zap,
    color: '#dc2626',
    bgColor: 'bg-pink-100 dark:bg-pink-900/30',
    textColor: 'text-pink-700 dark:text-pink-400',
    position: 100,
    description: 'Immediate action needed'
  },
];

export default function UrgencyScale({ urgency, showLabel = true, size = 'md', animated = true }: UrgencyScaleProps) {
  const currentLevel = urgencyLevels.find(l => l.level === urgency) || urgencyLevels[0];
  const currentIndex = urgencyLevels.findIndex(l => l.level === urgency);
  const Icon = currentLevel.icon;

  const sizes = {
    sm: { height: 'h-2', iconSize: 'w-4 h-4', markerSize: 'w-3 h-3', fontSize: 'text-xs' },
    md: { height: 'h-3', iconSize: 'w-5 h-5', markerSize: 'w-4 h-4', fontSize: 'text-sm' },
    lg: { height: 'h-4', iconSize: 'w-6 h-6', markerSize: 'w-5 h-5', fontSize: 'text-base' },
  };

  const sizeConfig = sizes[size];

  return (
    <div className="space-y-3">
      {/* Scale Bar */}
      <div className="relative">
        {/* Background gradient bar */}
        <div className={`w-full ${sizeConfig.height} rounded-full overflow-hidden bg-gradient-to-r from-green-200 via-yellow-200 via-orange-200 to-red-200 dark:from-green-900/40 dark:via-yellow-900/40 dark:via-orange-900/40 dark:to-red-900/40`} />

        {/* Scale markers */}
        <div className="absolute top-0 left-0 w-full h-full flex justify-between items-center px-1">
          {urgencyLevels.map((level, index) => {
            const isActive = index <= currentIndex;
            const LevelIcon = level.icon;

            return (
              <motion.div
                key={level.level}
                initial={animated ? { scale: 0, opacity: 0 } : {}}
                animate={animated ? { scale: isActive ? 1 : 0.7, opacity: isActive ? 1 : 0.4 } : {}}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="relative flex flex-col items-center"
                style={{ width: '25%' }}
              >
                <div
                  className={`${sizeConfig.markerSize} rounded-full border-2 transition-all ${
                    isActive
                      ? 'bg-white dark:bg-slate-800 border-white dark:border-slate-700 shadow-lg scale-110'
                      : 'bg-gray-300 dark:bg-gray-600 border-gray-400 dark:border-gray-500'
                  }`}
                  style={{
                    borderColor: isActive ? level.color : undefined,
                    boxShadow: isActive ? `0 0 12px ${level.color}40` : undefined
                  }}
                />

                {/* Pulse effect for current level */}
                {level.level === urgency && animated && (
                  <motion.div
                    className="absolute top-0 w-6 h-6 rounded-full"
                    style={{ backgroundColor: level.color }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.6, 0, 0.6]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Current position indicator */}
        <motion.div
          initial={animated ? { left: 0 } : {}}
          animate={animated ? { left: `${currentLevel.position}%` } : { left: `${currentLevel.position}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="absolute -top-8 transform -translate-x-1/2 flex flex-col items-center"
        >
          <motion.div
            animate={animated ? { y: [0, -3, 0] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
            className={`${currentLevel.bgColor} ${sizeConfig.iconSize} rounded-lg flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-700`}
            style={{ borderColor: currentLevel.color }}
          >
            <Icon className={sizeConfig.iconSize} style={{ color: currentLevel.color }} />
          </motion.div>
          <div
            className="w-0.5 h-4 mt-1"
            style={{ backgroundColor: currentLevel.color }}
          />
        </motion.div>
      </div>

      {/* Labels */}
      {showLabel && (
        <div className="flex justify-between items-start">
          {urgencyLevels.map((level) => (
            <div
              key={level.level}
              className={`flex flex-col items-center ${sizeConfig.fontSize}`}
              style={{ width: '25%' }}
            >
              <span className={`font-medium ${level.level === urgency ? level.textColor : 'text-gray-400 dark:text-gray-600'}`}>
                {level.level}
              </span>
              {level.level === urgency && (
                <motion.span
                  initial={animated ? { opacity: 0, y: -5 } : {}}
                  animate={animated ? { opacity: 1, y: 0 } : {}}
                  className={`text-[10px] ${level.textColor} text-center mt-0.5`}
                >
                  {level.description}
                </motion.span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Current urgency badge */}
      <motion.div
        initial={animated ? { scale: 0.8, opacity: 0 } : {}}
        animate={animated ? { scale: 1, opacity: 1 } : {}}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${currentLevel.bgColor} border-2`}
        style={{ borderColor: currentLevel.color }}
      >
        <Icon className={sizeConfig.iconSize} style={{ color: currentLevel.color }} />
        <div>
          <p className={`font-semibold ${currentLevel.textColor} ${sizeConfig.fontSize}`}>
            {urgency} Priority
          </p>
          <p className={`text-xs ${currentLevel.textColor} opacity-80`}>
            {currentLevel.description}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
