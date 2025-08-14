import React, { useState } from 'react';
import { MessageSquare, Search, Calendar, Users, TrendingUp, FileText, Clock, Star, Brain } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ForumPost {
  id: string;
  title: string;
  author: string;
  replies: number;
  lastActivity: string;
  category: string;
}

interface ResearchQuery {
  id: string;
  query: string;
  results: number;
  timestamp: string;
  category: string;
}

interface Consultation {
  id: string;
  clientName: string;
  date: string;
  time: string;
  type: string;
  status: string;
}

const LawyerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('forum');
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useLanguage();

  const forumPosts: ForumPost[] = [
    {
      id: '1',
      title: 'Best practices for trademark opposition proceedings',
      author: 'Senior Partner',
      replies: 12,
      lastActivity: '2 hours ago',
      category: 'Strategy',
    },
    {
      id: '2',
      title: 'Recent changes in patent examination guidelines',
      author: 'IP Specialist',
      replies: 8,
      lastActivity: '4 hours ago',
      category: 'Updates',
    },
    {
      id: '3',
      title: 'Client communication strategies for complex IP cases',
      author: 'Managing Partner',
      replies: 15,
      lastActivity: '1 day ago',
      category: 'Practice Management',
    },
  ];

  const recentResearch: ResearchQuery[] = [
    {
      id: '1',
      query: 'Trademark infringement precedents in digital commerce',
      results: 47,
      timestamp: '1 hour ago',
      category: 'Trademark',
    },
    {
      id: '2',
      query: 'Copyright fair use exceptions for educational content',
      results: 23,
      timestamp: '3 hours ago',
      category: 'Copyright',
    },
    {
      id: '3',
      query: 'Patent validity challenges in pharmaceutical sector',
      results: 31,
      timestamp: '1 day ago',
      category: 'Patent',
    },
  ];

  const upcomingConsultations: Consultation[] = [
    {
      id: '1',
      clientName: 'Tech Innovations Ltd.',
      date: 'Today',
      time: '2:00 PM',
      type: 'Video Call',
      status: 'Confirmed',
    },
    {
      id: '2',
      clientName: 'Creative Studios Inc.',
      date: 'Tomorrow',
      time: '10:00 AM',
      type: 'In Person',
      status: 'Pending',
    },
    {
      id: '3',
      clientName: 'Manufacturing Corp.',
      date: 'Dec 28',
      time: '3:30 PM',
      type: 'Phone Call',
      status: 'Confirmed',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lawyer Dashboard</h1>
          <p className="text-gray-600">Professional networking, advanced research tools, and consultation management</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Cases</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">24</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span className="text-emerald-500 text-sm font-medium ml-1">+12%</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Consultations</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">18</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Users className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span className="text-emerald-500 text-sm font-medium ml-1">+8%</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Research Queries</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">156</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Search className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span className="text-emerald-500 text-sm font-medium ml-1">+23%</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Client Rating</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">4.9</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-gray-600 text-sm font-medium ml-1">127 reviews</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('forum')}
              className={`px-6 py-4 font-medium text-sm transition-colors ${
                activeTab === 'forum'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>Professional Forum</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('research')}
              className={`px-6 py-4 font-medium text-sm transition-colors ${
                activeTab === 'research'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Brain className="h-4 w-4" />
                <span>AI Research Tools</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-6 py-4 font-medium text-sm transition-colors ${
                activeTab === 'schedule'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Consultation Schedule</span>
              </div>
            </button>
          </div>
        </div>

        {/* Professional Forum Tab */}
        {activeTab === 'forum' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Professional Forum</h2>
                <button className="px-4 py-2 bg-gradient-to-r from-blue-900 to-emerald-600 text-white rounded-lg hover:from-blue-800 hover:to-emerald-500 transition-all duration-200">
                  New Discussion
                </button>
              </div>
              
              <div className="space-y-4">
                {forumPosts.map((post) => (
                  <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>by {post.author}</span>
                          <span>{post.replies} replies</span>
                          <span>{post.lastActivity}</span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {post.category}
                          </span>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                        Join Discussion
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI Research Tools Tab */}
        {activeTab === 'research' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">AI-Powered Legal Research</h2>
              
              {/* Research Input */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter your legal research query..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button className="mt-3 px-6 py-3 bg-gradient-to-r from-blue-900 to-emerald-600 text-white rounded-lg hover:from-blue-800 hover:to-emerald-500 transition-all duration-200">
                  Analyze with AI
                </button>
              </div>

              {/* Recent Research */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Research</h3>
                <div className="space-y-3">
                  {recentResearch.map((research) => (
                    <div key={research.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 mb-2">{research.query}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{research.results} results found</span>
                            <span>{research.timestamp}</span>
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                              {research.category}
                            </span>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                          View Results
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Consultation Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Upcoming Consultations</h2>
                <button className="px-4 py-2 bg-gradient-to-r from-blue-900 to-emerald-600 text-white rounded-lg hover:from-blue-800 hover:to-emerald-500 transition-all duration-200">
                  Add Appointment
                </button>
              </div>
              
              <div className="space-y-4">
                {upcomingConsultations.map((consultation) => (
                  <div key={consultation.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{consultation.clientName}</h3>
                          <div className="flex items-center space-x-3 text-sm text-gray-600">
                            <span className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{consultation.date}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{consultation.time}</span>
                            </span>
                            <span>{consultation.type}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          consultation.status === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {consultation.status}
                        </span>
                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                          Manage
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LawyerDashboard;