import React from 'react';
import { MessageCircle, Search, Users, TrendingUp, Clock, FileText } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    { title: 'Active Cases', value: '24', icon: FileText, change: '+12%', color: 'bg-blue-500' },
    { title: 'Consultations', value: '18', icon: Users, change: '+8%', color: 'bg-green-500' },
    { title: 'Statute Searches', value: '156', icon: Search, change: '+23%', color: 'bg-purple-500' },
    { title: 'Chat Sessions', value: '89', icon: MessageCircle, change: '+15%', color: 'bg-yellow-500' },
  ];

  const recentActivity = [
    { type: 'consultation', title: 'New consultation scheduled with Maria Johnson', time: '2 hours ago' },
    { type: 'search', title: 'Statute search: Contract Law Section 123.45', time: '4 hours ago' },
    { type: 'chat', title: 'Legal AI chat session completed', time: '6 hours ago' },
    { type: 'case', title: 'Case file updated: Smith vs. Anderson', time: '1 day ago' },
  ];

  return (
    <div className="h-full overflow-auto bg-gray-50">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John</h1>
          <p className="text-gray-600">Here's what's happening with your legal practice today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-green-500 text-sm font-medium ml-1">{stat.change}</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <Clock className="h-5 w-5 text-gray-400 mt-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 font-medium">{activity.title}</p>
                        <p className="text-gray-500 text-sm mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 text-left bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-900 font-medium">Start Legal Chat</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <Search className="h-5 w-5 text-purple-600" />
                  <span className="text-purple-900 font-medium">Search Statutes</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <Users className="h-5 w-5 text-green-600" />
                  <span className="text-green-900 font-medium">Book Consultation</span>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-sm p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Pro Tip</h3>
              <p className="text-blue-100 text-sm">Use the Legal Assistant for quick research and case analysis. It can help you find relevant precedents and draft documents.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;