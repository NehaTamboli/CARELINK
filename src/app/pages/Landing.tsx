import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Moon, Sun, Heart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Chatbot from '../components/Chatbot';

export default function Landing() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header with theme toggle */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-10 bg-[#14b8a6] rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white absolute" />
              <div className="absolute w-3 h-0.5 bg-white transform rotate-45 top-5 left-3"></div>
              <div className="absolute w-3 h-0.5 bg-white transform -rotate-45 top-5 right-3"></div>
            </div>
            <span className="text-xl font-semibold text-gray-900 dark:text-white">CareLink</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Sun className="w-5 h-5 text-gray-300" />
              )}
            </button>
            <Button
              variant="ghost"
              onClick={() => navigate('/about')}
              className="text-gray-700 dark:text-gray-300"
            >
              About Us
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/login')}
              className="text-gray-700 dark:text-gray-300"
            >
              Login
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section - Centered */}
      <div className="flex items-center justify-center min-h-screen px-6">
        <div className="max-w-3xl text-center">
          {/* Logo */}
          <div className="relative w-24 h-24 bg-[#14b8a6] rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
            <Heart className="w-14 h-14 text-white absolute" />
            <div className="absolute w-8 h-1 bg-white transform rotate-45 top-12 left-6 rounded-full"></div>
            <div className="absolute w-8 h-1 bg-white transform -rotate-45 top-12 right-6 rounded-full"></div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Welcome to
            <span className="block text-[#14b8a6] mt-2">CareLink</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            AI-powered platform to streamline your non-profit operations. 
            Automatically classify, prioritize, and respond to messages with intelligent assistance.
          </p>

          <Button
            onClick={() => navigate('/login')}
            className="bg-[#14b8a6] hover:bg-[#0f9688] text-white px-12 py-7 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            Get Started
          </Button>
        </div>
      </div>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}