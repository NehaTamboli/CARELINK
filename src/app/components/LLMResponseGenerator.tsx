import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Copy, ThumbsUp, ThumbsDown, RefreshCw, Check } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface LLMResponseGeneratorProps {
  response: string;
  category?: string;
  urgency?: string;
  isGenerating?: boolean;
  onRegenerate?: () => void;
}

export default function LLMResponseGenerator({
  response,
  category,
  urgency,
  isGenerating = false,
  onRegenerate
}: LLMResponseGeneratorProps) {
  const [displayedResponse, setDisplayedResponse] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (!response) {
      setDisplayedResponse('');
      setIsTyping(false);
      return;
    }

    setDisplayedResponse('');
    setIsTyping(true);
    let currentIndex = 0;

    const typingInterval = setInterval(() => {
      if (currentIndex < response.length) {
        setDisplayedResponse(response.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 20);

    return () => clearInterval(typingInterval);
  }, [response]);

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    toast.success('Response copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(type);
    toast.success(`Feedback recorded: ${type === 'up' ? 'Helpful' : 'Not helpful'}`);
  };

  if (!response && !isGenerating) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <motion.div
            animate={isTyping ? {
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            } : {}}
            transition={{ duration: 2, repeat: isTyping ? Infinity : 0 }}
            className="w-7 h-7 bg-gradient-to-br from-[#14b8a6] to-[#0f9688] rounded-lg flex items-center justify-center shadow-md"
          >
            <Sparkles className="w-4 h-4 text-white" />
          </motion.div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              AI Generated Response
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isTyping ? 'Generating...' : 'Ready to send'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isTyping && onRegenerate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRegenerate}
              className="text-gray-600 dark:text-gray-400 hover:text-[#14b8a6]"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          )}
          {!isTyping && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="text-gray-600 dark:text-gray-400 hover:text-[#14b8a6]"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </div>

      {/* Response Content */}
      <div className="relative bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl border-2 border-teal-200 dark:border-teal-700 p-5 shadow-lg">
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#14b8a6]/5 to-[#0f9688]/5 rounded-xl"
          animate={{
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Content */}
        <div className="relative">
          <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-line">
            {displayedResponse}
            {isTyping && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="inline-block w-0.5 h-4 bg-[#14b8a6] ml-1"
              />
            )}
          </p>

          {/* Metadata tags */}
          {!isTyping && (category || urgency) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mt-4 pt-4 border-t border-teal-200 dark:border-teal-700"
            >
              {category && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-800 text-[#14b8a6] rounded-lg text-xs font-medium border border-teal-200 dark:border-teal-700">
                  <span className="w-1.5 h-1.5 bg-[#14b8a6] rounded-full" />
                  {category}
                </span>
              )}
              {urgency && (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border ${
                  urgency === 'High' || urgency === 'Critical'
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-700'
                    : urgency === 'Medium'
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700'
                    : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-700'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    urgency === 'High' || urgency === 'Critical' ? 'bg-red-500' : urgency === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  {urgency} Urgency
                </span>
              )}
            </motion.div>
          )}
        </div>

        {/* Decorative elements */}
        <div className="absolute top-3 right-3 w-20 h-20 bg-gradient-to-br from-[#14b8a6]/10 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-3 left-3 w-16 h-16 bg-gradient-to-tr from-cyan-400/10 to-transparent rounded-full blur-xl" />
      </div>

      {/* Feedback buttons */}
      {!isTyping && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3 mt-3"
        >
          <p className="text-xs text-gray-600 dark:text-gray-400">Was this response helpful?</p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFeedback('up')}
              className={`p-2 ${feedback === 'up' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'text-gray-500 hover:text-green-600'}`}
            >
              <ThumbsUp className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFeedback('down')}
              className={`p-2 ${feedback === 'down' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 'text-gray-500 hover:text-red-600'}`}
            >
              <ThumbsDown className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Loading state */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-3 border-[#14b8a6] border-t-transparent rounded-full"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400">Generating response...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
