import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Heart } from 'lucide-react';
import Chatbot from '../components/Chatbot';

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'staff',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock registration - in real app, this would call an API
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', formData.role);
    navigate('/dashboard');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="relative w-12 h-12 bg-[#14b8a6] rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white absolute" />
              <div className="absolute w-4 h-0.5 bg-white transform rotate-45 top-6 left-3"></div>
              <div className="absolute w-4 h-0.5 bg-white transform -rotate-45 top-6 right-3"></div>
            </div>
            <span className="text-2xl font-semibold text-gray-900 dark:text-white">CareLink</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Create your account</h2>
          <p className="text-gray-600 dark:text-gray-400">Get started with CareLink</p>
        </div>

        {/* Sign Up Form */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Rahul Sharma"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-2 bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-gray-600 rounded-lg"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-2 bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-gray-600 rounded-lg"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-2 bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-gray-600 rounded-lg"
              />
            </div>

            <div>
              <Label htmlFor="role" className="text-gray-700 dark:text-gray-300">Role</Label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-2 w-full px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#14b8a6]"
              >
                <option value="staff">Support Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" required className="mt-1 rounded border-gray-300 text-[#14b8a6] focus:ring-[#14b8a6]" />
                <span>I agree to the Terms of Service and Privacy Policy</span>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#14b8a6] hover:bg-[#0f9688] text-white py-6 rounded-lg text-base shadow-md hover:shadow-lg transition-all"
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-[#14b8a6] hover:text-[#0f9688] font-medium"
            >
              Sign in
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            ← Back to home
          </button>
        </div>
      </div>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}