import DashboardLayout from '../components/DashboardLayout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Mail, Phone, MoreVertical, UserPlus } from 'lucide-react';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  messagesHandled: number;
  responseTime: string;
  status: 'Active' | 'Away' | 'Offline';
  avatar: string;
}

export default function Team() {
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'Neha Tamboli',
      role: 'Project Lead & AI Developer',
      email: 'neha.tamboli@carelink.org',
      phone: '+91-98765-43210',
      messagesHandled: 142,
      responseTime: '12 min',
      status: 'Active',
      avatar: 'NT'
    },
    {
      id: 2,
      name: 'Riddhima Toase',
      role: 'Frontend Developer',
      email: 'riddhima.toase@carelink.org',
      phone: '+91-98765-43211',
      messagesHandled: 98,
      responseTime: '18 min',
      status: 'Active',
      avatar: 'RT'
    },
    {
      id: 3,
      name: 'Uday Patidar',
      role: 'Backend Developer',
      email: 'uday.patidar@carelink.org',
      phone: '+91-98765-43212',
      messagesHandled: 67,
      responseTime: '25 min',
      status: 'Away',
      avatar: 'UP'
    },
    {
      id: 4,
      name: 'Rohan Rawat',
      role: 'DevOps Engineer',
      email: 'rohan.rawat@carelink.org',
      phone: '+91-98765-43213',
      messagesHandled: 89,
      responseTime: '15 min',
      status: 'Active',
      avatar: 'RR'
    },
    {
      id: 5,
      name: 'Naman Dwivedi',
      role: 'UI/UX Designer',
      email: 'naman.dwivedi@carelink.org',
      phone: '+91-98765-43214',
      messagesHandled: 76,
      responseTime: '20 min',
      status: 'Active',
      avatar: 'ND'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500';
      case 'Away': return 'bg-yellow-500';
      case 'Offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Team Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your support team members</p>
          </div>
          <Button className="bg-[#14b8a6] hover:bg-[#0f9688] text-white">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Members</p>
            <p className="text-3xl font-semibold text-gray-900 dark:text-white mt-2">{teamMembers.length}</p>
          </Card>
          <Card className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Now</p>
            <p className="text-3xl font-semibold text-gray-900 dark:text-white mt-2">
              {teamMembers.filter(m => m.status === 'Active').length}
            </p>
          </Card>
          <Card className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Messages</p>
            <p className="text-3xl font-semibold text-gray-900 dark:text-white mt-2">
              {teamMembers.reduce((sum, m) => sum + m.messagesHandled, 0)}
            </p>
          </Card>
          <Card className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response</p>
            <p className="text-3xl font-semibold text-gray-900 dark:text-white mt-2">17 min</p>
          </Card>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <Card key={member.id} className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-14 h-14 bg-[#14b8a6] rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {member.avatar}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-4 h-4 ${getStatusColor(member.status)} rounded-full border-2 border-white dark:border-slate-800`}></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
                  </div>
                </div>
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4" />
                  <span>{member.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Messages</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{member.messagesHandled}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Avg Response</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{member.responseTime}</p>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full mt-4 border-[#14b8a6] text-[#14b8a6] hover:bg-teal-50 dark:hover:bg-teal-900/20"
              >
                View Profile
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}