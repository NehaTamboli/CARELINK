import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Copy, Edit, Trash2, Plus, Search } from 'lucide-react';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';

interface Template {
  id: number;
  name: string;
  category: string;
  content: string;
  usageCount: number;
}

export default function Templates() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const templates: Template[] = [
    {
      id: 1,
      name: 'Donation Thank You',
      category: 'Donation',
      content: 'Dear {name}, Thank you for your generous donation of {amount}! Your support will help us continue our mission to serve the community. We will send you a donation receipt within 24 hours.',
      usageCount: 156
    },
    {
      id: 2,
      name: 'Volunteer Welcome',
      category: 'Volunteer',
      content: 'Hello {name}, Welcome to CareLink! We are thrilled to have you join our volunteer team. Your orientation is scheduled for {date} at {time}. Looking forward to working with you!',
      usageCount: 89
    },
    {
      id: 3,
      name: 'Complaint Acknowledgment',
      category: 'Complaint',
      content: 'Dear {name}, We have received your complaint regarding {issue}. We sincerely apologize for the inconvenience. Our team is investigating this matter and will respond within 24 hours. Reference: #{ticket_number}',
      usageCount: 45
    },
    {
      id: 4,
      name: 'Partnership Inquiry Response',
      category: 'Partnership',
      content: 'Dear {name}, Thank you for your interest in partnering with CareLink. We are excited about the potential collaboration. Our partnerships team will contact you at {email} within 48 hours to discuss this further.',
      usageCount: 23
    },
    {
      id: 5,
      name: 'Event Information',
      category: 'General',
      content: 'Hello {name}, Thank you for your interest in our upcoming events! Here are the details: Event: {event_name}, Date: {date}, Location: {location}, Time: {time}. We hope to see you there!',
      usageCount: 67
    },
    {
      id: 6,
      name: 'Receipt Follow-up',
      category: 'Donation',
      content: 'Dear {name}, Your donation receipt for {amount} is attached to this message. Transaction ID: {transaction_id}. If you have any questions, please contact us at support@carelink.org.',
      usageCount: 112
    },
    {
      id: 7,
      name: 'Volunteer Opportunity',
      category: 'Volunteer',
      content: 'Hi {name}, We have a new volunteer opportunity that matches your interests: {opportunity_name}, Date: {date}, Duration: {duration}, Location: {location}. Please confirm your availability.',
      usageCount: 54
    },
    {
      id: 8,
      name: 'General Inquiry Response',
      category: 'General',
      content: 'Hello {name}, Thank you for reaching out to CareLink. {custom_message}. If you have any further questions, please don\'t hesitate to contact us.',
      usageCount: 78
    },
  ];

  const categories = ['All', 'Donation', 'Volunteer', 'Complaint', 'Partnership', 'General'];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Template copied to clipboard!');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Donation': return 'bg-teal-100 dark:bg-teal-900/30 text-[#14b8a6]';
      case 'Volunteer': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600';
      case 'Complaint': return 'bg-red-100 dark:bg-red-900/30 text-red-600';
      case 'Partnership': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600';
      case 'General': return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-600';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Response Templates</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Pre-written responses for common messages</p>
          </div>
          <Button className="bg-[#14b8a6] hover:bg-[#0f9688] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-gray-600"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-[#14b8a6] text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Templates</p>
            <p className="text-3xl font-semibold text-gray-900 dark:text-white mt-2">{templates.length}</p>
          </Card>
          <Card className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Most Used</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white mt-2">Donation Thank You</p>
          </Card>
          <Card className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Usage</p>
            <p className="text-3xl font-semibold text-gray-900 dark:text-white mt-2">
              {templates.reduce((sum, t) => sum + t.usageCount, 0)}
            </p>
          </Card>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{template.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-3 py-1 rounded-lg font-medium ${getCategoryColor(template.category)}`}>
                      {template.category}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Used {template.usageCount} times
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {template.content}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleCopy(template.content)}
                  className="flex-1 bg-[#14b8a6] hover:bg-[#0f9688] text-white"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-300 dark:border-gray-600"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <Card className="p-12 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No templates found matching your search</p>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
