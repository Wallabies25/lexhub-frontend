import React, { useState } from 'react';
import { Play, FileText, Search, MessageCircle, BookOpen, Video, Download, Star, Clock, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Course {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  progress: number;
  thumbnail: string;
  description: string;
  lessons: number;
}

interface CaseLaw {
  id: string;
  title: string;
  court: string;
  year: string;
  category: string;
  summary: string;
  relevance: number;
}

const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { t } = useLanguage();

  const courses: Course[] = [
    {
      id: '1',
      title: 'Introduction to Intellectual Property Law',
      instructor: 'Prof. Samantha Perera',
      duration: '8 hours',
      progress: 65,
      thumbnail: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Comprehensive introduction to IP law covering trademarks, copyrights, patents, and industrial designs.',
      lessons: 12,
    },
    {
      id: '2',
      title: 'Trademark Law and Practice',
      instructor: 'Dr. Rohan Silva',
      duration: '6 hours',
      progress: 30,
      thumbnail: 'https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Deep dive into trademark registration, protection, and enforcement in Sri Lanka.',
      lessons: 10,
    },
    {
      id: '3',
      title: 'Copyright Law for Creative Industries',
      instructor: 'Ms. Nayomi Fernando',
      duration: '5 hours',
      progress: 0,
      thumbnail: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Understanding copyright protection for artists, writers, and creative professionals.',
      lessons: 8,
    },
  ];

  const caseLaws: CaseLaw[] = [
    {
      id: '1',
      title: 'ABC Company Ltd. v. XYZ Enterprises',
      court: 'Supreme Court of Sri Lanka',
      year: '2023',
      category: 'Trademark',
      summary: 'Landmark case establishing precedent for trademark infringement in the digital marketplace.',
      relevance: 95,
    },
    {
      id: '2',
      title: 'Creative Works Ltd. v. Digital Media Corp.',
      court: 'Court of Appeal',
      year: '2022',
      category: 'Copyright',
      summary: 'Important ruling on copyright protection for digital content and fair use exceptions.',
      relevance: 88,
    },
    {
      id: '3',
      title: 'Innovation Tech v. Patent Office',
      court: 'Commercial High Court',
      year: '2023',
      category: 'Patent',
      summary: 'Case defining patentability criteria for software and business method inventions.',
      relevance: 92,
    },
  ];

  const categories = ['all', 'Trademark', 'Copyright', 'Patent', 'Industrial Design'];

  const filteredCaseLaws = caseLaws.filter(caselaw => {
    const matchesSearch = caselaw.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         caselaw.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || caselaw.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Dashboard</h1>
          <p className="text-gray-600">Access course materials, case law database, and AI research assistant</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-6 py-4 font-medium text-sm transition-colors ${
                activeTab === 'courses'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Video className="h-4 w-4" />
                <span>Courses</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('caselaw')}
              className={`px-6 py-4 font-medium text-sm transition-colors ${
                activeTab === 'caselaw'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>Case Law</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className={`px-6 py-4 font-medium text-sm transition-colors ${
                activeTab === 'community'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Community</span>
              </div>
            </button>
          </div>
        </div>

        {/* Course Materials Tab */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <button className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-900 rounded-lg font-medium">
                        <Play className="h-4 w-4" />
                        <span>Continue Learning</span>
                      </button>
                    </div>
                    <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                      {course.duration}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{course.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                      <span>{course.instructor}</span>
                      <span>{course.lessons} lessons</span>
                    </div>
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-900 to-emerald-600 h-2 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-900 to-emerald-600 text-white rounded-lg hover:from-blue-800 hover:to-emerald-500 transition-all duration-200 text-sm font-medium">
                        Continue
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Case Law Database Tab */}
        {activeTab === 'caselaw' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search case law database..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Search case law"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Filter by category"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Case Law Results */}
            <div className="space-y-4">
              {filteredCaseLaws.map((caselaw) => (
                <div key={caselaw.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{caselaw.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <span>{caselaw.court}</span>
                        <span>{caselaw.year}</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {caselaw.category}
                        </span>
                      </div>
                      <p className="text-gray-700">{caselaw.summary}</p>
                    </div>
                    <div className="flex items-center space-x-2 ml-6">
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Relevance</div>
                        <div className="text-lg font-semibold text-emerald-600">{caselaw.relevance}%</div>
                      </div>
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <FileText className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="flex space-x-3">
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Read Full Case
                      </button>
                      <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">
                        Save to Library
                      </button>
                      <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">
                        Cite
                      </button>
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-emerald-500 h-2 rounded-full"
                        style={{ width: `${caselaw.relevance}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Community Tab */}
        {activeTab === 'community' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Student Community</h3>
            <p className="text-gray-600 mb-6">Connect with fellow law students, share resources, and collaborate on projects</p>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-900 to-emerald-600 text-white rounded-lg hover:from-blue-800 hover:to-emerald-500 transition-all duration-200">
              Join Community Forum
            </button>
          </div>
        )}

        {/* AI Assistant Widget */}
        <div className="fixed bottom-6 right-6">
          <button className="w-16 h-16 bg-gradient-to-r from-blue-900 to-emerald-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center">
            <MessageCircle className="h-8 w-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;