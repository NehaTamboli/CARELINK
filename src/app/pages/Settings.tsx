import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { User, Bell, Shield, Database, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const [settings, setSettings] = useState({
    name: 'Admin User',
    email: 'admin@carelink.org',
    organization: 'CareLink Foundation',
    emailNotifications: true,
    smsNotifications: false,
    weeklyReports: true,
    highUrgencyAlerts: true,
    autoAssign: true,
    aiAnalysis: true,
  });

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account and preferences</p>
        </div>

        {/* Profile Settings */}
        <Card className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-[#14b8a6]" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Information</h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  className="mt-2 bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="mt-2 bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-gray-600"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="organization" className="text-gray-700 dark:text-gray-300">Organization</Label>
              <Input
                id="organization"
                type="text"
                value={settings.organization}
                onChange={(e) => setSettings({ ...settings, organization: e.target.value })}
                className="mt-2 bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-gray-600"
              />
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notification Preferences</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive email updates for new messages</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">SMS Notifications</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get text alerts for urgent messages</p>
              </div>
              <Switch
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Weekly Reports</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive weekly analytics summary</p>
              </div>
              <Switch
                checked={settings.weeklyReports}
                onCheckedChange={(checked) => setSettings({ ...settings, weeklyReports: checked })}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">High Urgency Alerts</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Instant alerts for high priority messages</p>
              </div>
              <Switch
                checked={settings.highUrgencyAlerts}
                onCheckedChange={(checked) => setSettings({ ...settings, highUrgencyAlerts: checked })}
              />
            </div>
          </div>
        </Card>

        {/* System Settings */}
        <Card className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Settings</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Auto-Assign Messages</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Automatically assign messages to staff members</p>
              </div>
              <Switch
                checked={settings.autoAssign}
                onCheckedChange={(checked) => setSettings({ ...settings, autoAssign: checked })}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">AI Analysis</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Enable AI-powered message classification</p>
              </div>
              <Switch
                checked={settings.aiAnalysis}
                onCheckedChange={(checked) => setSettings({ ...settings, aiAnalysis: checked })}
              />
            </div>
          </div>
        </Card>

        {/* Security Settings */}
        <Card className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security</h3>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="currentPassword" className="text-gray-700 dark:text-gray-300">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="••••••••"
                className="mt-2 bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-gray-600"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="newPassword" className="text-gray-700 dark:text-gray-300">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  className="mt-2 bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="mt-2 bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-gray-600"
                />
              </div>
            </div>
            <Button
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Change Password
            </Button>
          </div>
        </Card>

        {/* API Configuration */}
        <Card className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="w-6 h-6 text-[#14b8a6]" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">API Configuration</h3>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="apiKey" className="text-gray-700 dark:text-gray-300">LLM API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="sk-••••••••••••••••"
                className="mt-2 bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-gray-600"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Your API key for AI model integration</p>
            </div>
            <div>
              <Label htmlFor="webhookUrl" className="text-gray-700 dark:text-gray-300">Webhook URL</Label>
              <Input
                id="webhookUrl"
                type="url"
                placeholder="https://your-webhook-url.com"
                className="mt-2 bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-gray-600"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Receive real-time updates via webhook</p>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            className="bg-[#14b8a6] hover:bg-[#0f9688] text-white px-8"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}