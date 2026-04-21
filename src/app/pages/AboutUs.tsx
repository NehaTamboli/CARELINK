import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Moon, Sun, Heart, Target, Users, Zap, Award, ArrowLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Chatbot from '../components/Chatbot';

export default function AboutUs() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const features = [
    {
      icon: Zap,
      title: 'AI-Powered Classification',
      description: 'Automatically categorize messages using advanced machine learning algorithms for instant insights.',
    },
    {
      icon: Target,
      title: 'Smart Prioritization',
      description: 'Intelligent urgency detection ensures critical messages get immediate attention.',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Seamless coordination among team members with role-based access and assignment workflows.',
    },
    {
      icon: Award,
      title: 'Analytics Dashboard',
      description: 'Comprehensive insights and reports to track performance and improve operations.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
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
              onClick={() => navigate('/login')}
              className="text-gray-700 dark:text-gray-300"
            >
              Login
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#14b8a6] dark:hover:text-[#14b8a6] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>

          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="relative w-20 h-20 bg-[#14b8a6] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Heart className="w-12 h-12 text-white absolute" />
              <div className="absolute w-6 h-1 bg-white transform rotate-45 top-10 left-5 rounded-full"></div>
              <div className="absolute w-6 h-1 bg-white transform -rotate-45 top-10 right-5 rounded-full"></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              About CareLink
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              An AI-powered platform designed to revolutionize how non-profit organizations manage and respond to incoming messages, donations, volunteer requests, and partnerships.
            </p>
          </div>

          {/* Mission Statement */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 md:p-12 shadow-lg border border-gray-200 dark:border-gray-700 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed text-center max-w-4xl mx-auto">
              To empower non-profit organizations with intelligent automation tools that streamline operations, enhance donor relationships, and maximize social impact. We leverage cutting-edge AI technology to help organizations focus on what matters most - making a difference in their communities.
            </p>
          </div>

          {/* Features Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
                >
                  <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-[#14b8a6]" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Technology Stack */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 md:p-12 shadow-lg border border-gray-200 dark:border-gray-700 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Technology Stack
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4">
                <p className="font-semibold text-gray-900 dark:text-white mb-1">Frontend</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">React, TypeScript</p>
              </div>
              <div className="p-4">
                <p className="font-semibold text-gray-900 dark:text-white mb-1">Styling</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tailwind CSS</p>
              </div>
              <div className="p-4">
                <p className="font-semibold text-gray-900 dark:text-white mb-1">AI/ML</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">LLM Integration</p>
              </div>
              <div className="p-4">
                <p className="font-semibold text-gray-900 dark:text-white mb-1">DevOps</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">CI/CD Pipeline</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Join CareLink today and transform your non-profit operations
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => navigate('/signup')}
                className="bg-[#14b8a6] hover:bg-[#0f9688] text-white px-8 py-6 text-lg rounded-xl shadow-lg"
              >
                Get Started
              </Button>
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                className="border-[#14b8a6] text-[#14b8a6] px-8 py-6 text-lg rounded-xl hover:bg-teal-50 dark:hover:bg-teal-900/20"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}
