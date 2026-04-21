import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  Heart,
  FileText
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import AIAssistantBot from './AIAssistantBot';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: FileText, label: 'Templates', path: '/templates' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 bg-[#14b8a6] rounded-lg flex items-center justify-center flex-shrink-0">
              <Heart className="w-5 h-5 text-white absolute" />
              <div className="absolute w-3 h-0.5 bg-white transform rotate-45 top-5 left-3"></div>
              <div className="absolute w-3 h-0.5 bg-white transform -rotate-45 top-5 right-3"></div>
            </div>
            {sidebarOpen && (
              <span className="text-xl font-semibold text-gray-900 dark:text-white">CareLink</span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#14b8a6] text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 flex-shrink-0" />
            ) : (
              <Sun className="w-5 h-5 flex-shrink-0" />
            )}
            {sidebarOpen && <span className="font-medium">Theme</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Admin User</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">admin@carelink.org</p>
              </div>
              <div className="w-10 h-10 bg-[#14b8a6] rounded-full flex items-center justify-center text-white font-medium">
                AU
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-slate-900">
          {children}
        </main>
      </div>

      {/* AI Assistant Bot */}
      <AIAssistantBot />
    </div>
  );
}